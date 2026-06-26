const express = require("express");
const router = express.Router();
const db = require("../models/db");

/* =========================================================
   CREATE SCHEDULE (WITH END TIME + CONFLICT CHECK)
========================================================= */
router.post("/", (req, res) => {
  const {
    userId,
    targetType,   // "group" | "player"
    targetId,
    playlistId,
    startTime,
    endTime,
    repeatType
  } = req.body;

  if (!userId || !targetType || !targetId || !playlistId || !startTime) {
    return res.status(400).json({ message: "Missing fields" });
  }

  /* ---------- CONFLICT CHECK ---------- */
  const conflictQuery = `
    SELECT id FROM schedules
    WHERE target_type = ?
      AND target_id = ?
      AND active = 1
      AND (
      start_time < ?
      AND (end_time IS NULL OR end_time > ?)
    )
  `;

  db.query(
    conflictQuery,
    [
  targetType,
  targetId,
  endTime || '9999-12-31 23:59:59',
  startTime
],
    (err, rows) => {
      if (err) {
        console.error("Conflict check error:", err);
        return res.status(500).json(err);
      }

      if (rows.length > 0) {
        return res.status(409).json({
          message: "Schedule conflict detected"
        });
      }

      /* ---------- INSERT SCHEDULE ---------- */
      db.query(
        `
        INSERT INTO schedules
        (
          user_id,
          target_type,
          target_id,
          playlist_id,
          start_time,
          end_time,
          repeat_type,
          active,
          previous_playlist_id
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, 1, NULL)
        `,
        [
          userId,
          targetType,
          targetId,
          playlistId,
          startTime,
          endTime || null,
          repeatType || "once"
        ],
        (err) => {
          if (err) return res.status(500).json(err);
          res.json({ message: "Schedule created" });
        }
      );
    }
  );
});

/* =========================================================
   GET SCHEDULES
========================================================= */
router.get("/", (req, res) => {
  const { userId } = req.query;

  db.query(
    "SELECT * FROM schedules WHERE user_id = ? ORDER BY start_time",
    [userId],
    (err, rows) => {
      if (err) return res.status(500).json(err);
      res.json(rows);
    }
  );
});

/* =========================================================
   UPDATE SCHEDULE (RESET EXECUTION STATE)
========================================================= */
router.put("/:id", (req, res) => {
  const { startTime, endTime, repeatType, playlistId, active } = req.body;

  db.query(
    `
    UPDATE schedules
    SET
      start_time = ?,
      end_time = ?,
      repeat_type = ?,
      playlist_id = ?,
      active = ?,
      previous_playlist_id = NULL,
      last_run = NULL
    WHERE id = ?
    `,
    [
      startTime,
      endTime || null,
      repeatType,
      playlistId,
      active,
      req.params.id
    ],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Schedule updated" });
    }
  );
});

/* =========================================================
   PAUSE / RESUME SCHEDULE
========================================================= */
router.patch("/:id/toggle", (req, res) => {
  db.query(
    "UPDATE schedules SET active = NOT active WHERE id = ?",
    [req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Schedule toggled" });
    }
  );
});

/* =========================================================
   DELETE SCHEDULE
========================================================= */
router.delete("/:id", (req, res) => {
  db.query(
    "DELETE FROM schedules WHERE id = ?",
    [req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Schedule deleted" });
    }
  );
});

/* =========================================================
   UPCOMING SCHEDULES
========================================================= */
router.get("/upcoming", (req, res) => {
  const { userId } = req.query;

  const sql = `
    SELECT 
      s.*,
      p.name AS playlist_name,
      CASE 
        WHEN s.target_type = 'player' THEN d.name
        WHEN s.target_type = 'group' THEN g.name
      END AS target_name
    FROM schedules s
    LEFT JOIN playlists p ON s.playlist_id = p.id
    LEFT JOIN displays d 
      ON s.target_id = d.id AND s.target_type = 'player'
    LEFT JOIN display_groups g 
      ON s.target_id = g.id AND s.target_type = 'group'
    WHERE s.user_id = ?
      AND s.active = 1
    ORDER BY s.start_time
  `;

  db.query(sql, [userId], (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

/* =========================================================
   COMPLETED SCHEDULES
========================================================= */
router.get("/completed", (req, res) => {
  const { userId } = req.query;

  const sql = `
    SELECT 
      s.*,
      p.name AS playlist_name,
      CASE 
        WHEN s.target_type = 'player' THEN d.name
        WHEN s.target_type = 'group' THEN g.name
      END AS target_name
    FROM schedules s
    LEFT JOIN playlists p ON s.playlist_id = p.id
    LEFT JOIN displays d 
      ON s.target_id = d.id AND s.target_type = 'player'
    LEFT JOIN display_groups g 
      ON s.target_id = g.id AND s.target_type = 'group'
    WHERE s.user_id = ?
      AND s.active = 0
    ORDER BY s.start_time DESC
  `;

  db.query(sql, [userId], (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

module.exports = router;