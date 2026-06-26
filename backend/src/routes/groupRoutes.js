const express = require("express");
const router = express.Router();
const db = require("../models/db");

/* GET ALL GROUPS */
router.get("/", (req, res) => {
  const { userId } = req.query;

  const sql = `
    SELECT g.id AS group_id, g.name AS group_name,
           d.id AS display_id, d.name AS display_name, d.pairing_code
    FROM display_groups g
    LEFT JOIN display_group_players gp ON gp.group_id = g.id
    LEFT JOIN displays d ON d.id = gp.display_id
    WHERE g.user_id = ?
    ORDER BY g.name
  `;

  db.query(sql, [userId], (err, rows) => {
    if (err) return res.status(500).json(err);

    const groups = {};
    rows.forEach(r => {
      if (!groups[r.group_id]) {
        groups[r.group_id] = { id: r.group_id, name: r.group_name, players: [] };
      }
      if (r.display_id) {
        groups[r.group_id].players.push({
          id: r.display_id,
          name: r.display_name,
          pairing_code: r.pairing_code
        });
      }
    });

    res.json(Object.values(groups));
  });
});

/* CREATE GROUP */
router.post("/", (req, res) => {
  const { name, userId } = req.body;
  db.query(
    "INSERT INTO display_groups (name, user_id) VALUES (?, ?)",
    [name, userId],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Group created", groupId: result.insertId });
    }
  );
});

/* ADD PLAYER */
router.post("/:groupId/players", (req, res) => {
  const { groupId } = req.params;
  const { displayId } = req.body;

  db.query(
    "INSERT IGNORE INTO display_group_players (group_id, display_id) VALUES (?, ?)",
    [groupId, displayId],
    err => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Player added to group" });
    }
  );
});

/* RUN PLAYLIST */
router.post("/:groupId/run", (req, res) => {
  const { groupId } = req.params;
  const { playlistId } = req.body;

  db.query(
    `
    SELECT d.pairing_code
    FROM display_group_players gp
    JOIN displays d ON d.id = gp.display_id
    WHERE gp.group_id = ?
    `,
    [groupId],
    (err, rows) => {
      if (err) return res.status(500).json(err);

      rows.forEach(r => {
        req.io.to(r.pairing_code).emit("start-playlist", { playlistId });
        db.query(
          "UPDATE displays SET current_playlist_id = ? WHERE pairing_code = ?",
          [playlistId, r.pairing_code]
        );
      });

      res.json({ message: "Playlist sent", tvs: rows.length });
    }
  );
});
/* REMOVE PLAYER */
router.delete("/:groupId/players/:displayId", (req, res) => {
  const { groupId, displayId } = req.params;

  db.query(
    "DELETE FROM display_group_players WHERE group_id = ? AND display_id = ?",
    [groupId, displayId],
    (err, result) => {
      if (err) {
        console.error("Remove player error:", err);
        return res.status(500).json(err);
      }

      res.json({
        message: "Player removed from group",
        affectedRows: result.affectedRows
      });
    }
  );
});
/* ======================
   DELETE GROUP
====================== */
router.delete("/:groupId", (req, res) => {
  const { groupId } = req.params;

  // 1️⃣ Remove players from group
  db.query(
    "DELETE FROM display_group_players WHERE group_id = ?",
    [groupId],
    (err) => {
      if (err) return res.status(500).json(err);

      // 2️⃣ Delete group itself
      db.query(
        "DELETE FROM display_groups WHERE id = ?",
        [groupId],
        (err2) => {
          if (err2) return res.status(500).json(err2);
          res.json({ message: "Group deleted successfully" });
        }
      );
    }
  );
});
module.exports = router;