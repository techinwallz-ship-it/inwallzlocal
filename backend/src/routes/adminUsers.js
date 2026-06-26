const express = require("express");
const bcrypt = require("bcrypt");
const db = require("../models/db");

const router = express.Router();

/* ================= CREATE USER ================= */
router.post("/", async (req, res) => {
  const { username, password, deviceLimit } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Missing fields" });
  }

  try {
    const hashed = await bcrypt.hash(password, 10);

    const sql = `
      INSERT INTO users (username, password, role, max_devices)
      VALUES (?, ?, 'client', ?)
    `;

    db.query(
      sql,
      [username, hashed, deviceLimit || 1],
      (err, result) => {
        if (err) {
          if (err.code === "ER_DUP_ENTRY") {
            return res.status(409).json({ message: "User already exists" });
          }
          console.error(err);
          return res.status(500).json({ message: "Insert failed" });
        }

        res.json({
          message: "User created successfully",
          userId: result.insertId
        });
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= LIST USERS ================= */
router.get("/", (req, res) => {
  const sql = `
    SELECT id, username, max_devices, is_active, created_at
    FROM users
    WHERE role = 'client'
    ORDER BY created_at DESC
  `;

  db.query(sql, (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "DB error" });
    }
    res.json(rows);
  });
});

/* ================= UPDATE DEVICE LIMIT ================= */
router.put("/:userId/device-limit", (req, res) => {
  const { userId } = req.params;
  const { deviceLimit } = req.body;

  if (deviceLimit < 1) {
    return res.status(400).json({ message: "Invalid device limit" });
  }

  db.query(
    "UPDATE users SET max_devices = ? WHERE id = ?",
    [deviceLimit, userId],
    (err) => {
      if (err) return res.status(500).json({ message: "DB error" });
      res.json({ message: "Device limit updated" });
    }
  );
});

/* ================= ENABLE / DISABLE USER ================= */
/* ================= ENABLE / DISABLE USER ================= */
router.patch("/:id/toggle", (req, res) => {
  db.query(
    "UPDATE users SET is_active = NOT is_active WHERE id = ?",
    [req.params.id],
    (err) => {
      if (err) return res.status(500).json({ message: "DB error" });
      res.json({ message: "User status updated" });
    }
  );
});

/* ================= ADMIN DASHBOARD STATS ================= */
router.get("/dashboard", (req, res) => {

  // TOTAL CLIENT USERS
  db.query(
    `
    SELECT COUNT(*) AS totalUsers
    FROM users
    WHERE role='client'
    `,
    (err, usersResult) => {

      if (err) {
        console.error(err);
        return res.status(500).json({ message: "DB error" });
      }

      // TOTAL DEVICES
      db.query(
        `
        SELECT COUNT(*) AS totalDevices
        FROM displays
        `,
        (err, devicesResult) => {

          if (err) {
            console.error(err);
            return res.status(500).json({ message: "DB error" });
          }

          // ONLINE DEVICES
          db.query(
            `
            SELECT COUNT(*) AS onlineDevices
            FROM displays
            WHERE last_seen >= NOW() - INTERVAL 60 SECOND
            `,
            (err, onlineResult) => {

              if (err) {
                console.error(err);
                return res.status(500).json({ message: "DB error" });
              }

              // OFFLINE DEVICES
              db.query(
                `
                SELECT COUNT(*) AS offlineDevices
                FROM displays
                WHERE last_seen IS NULL
                   OR last_seen < NOW() - INTERVAL 60 SECOND
                `,
                (err, offlineResult) => {

                  if (err) {
                    console.error(err);
                    return res.status(500).json({ message: "DB error" });
                  }

                  res.json({
                    totalUsers: usersResult[0].totalUsers,
                    totalDevices: devicesResult[0].totalDevices,
                    onlineDevices: onlineResult[0].onlineDevices,
                    offlineDevices: offlineResult[0].offlineDevices
                  });

                }
              );
            }
          );
        }
      );
    }
  );
});

/* ================= ADMIN PLAYERS ================= */
router.get("/players", (req, res) => {

  const sql = `
    SELECT
      d.*,

      p.name AS current_playlist_name,

      CASE
        WHEN d.last_seen >= NOW() - INTERVAL 60 SECOND
        THEN 1
        ELSE 0
      END AS online

    FROM displays d

    LEFT JOIN playlists p
      ON d.current_playlist_id = p.id

    ORDER BY d.created_at DESC
  `;

  db.query(sql, (err, rows) => {

    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "DB error"
      });
    }

    res.json(rows);

  });
});

module.exports = router;