const express = require("express");
const router = express.Router();
const db = require("../models/db");
const displayController = require("../controllers/displayController");

// TV generates pairing code
router.post("/register", displayController.registerDisplay);

// Client enters pairing code
router.post("/pair", displayController.pairDisplay);

// Players (user scoped)
router.get("/players", displayController.getPlayers);

// Register player (bind TV to user)
router.post("/register-player", displayController.registerPlayer);

// Unregister player
router.delete("/unregister/:id", displayController.unregisterPlayer);


// dashboard
router.get("/dashboard-stats", (req, res) => {
  const { userId } = req.query;

  const stats = {};

  db.query(
    "SELECT COUNT(*) AS totalPlayers FROM displays WHERE user_id = ?",
    [userId],
    (e, r) => {
      stats.players = r[0].totalPlayers;

      db.query(
        "SELECT COUNT(*) AS totalPlaylists FROM playlists WHERE user_id = ?",
        [userId],
        (e, r) => {
          stats.playlists = r[0].totalPlaylists;

          db.query(
            "SELECT COUNT(*) AS totalAssets FROM assets WHERE user_id = ?",
            [userId],
            (e, r) => {
              stats.assets = r[0].totalAssets;

              db.query(
                "SELECT COUNT(*) AS totalGroups FROM display_groups WHERE user_id = ?",
                [userId],
                (e, r) => {
                  stats.groups = r[0].totalGroups;
                  res.json(stats);
                }
              );
            }
          );
        }
      );
    }
  );
});

//online or offline
router.get("/status", (req, res) => {
  const { userId } = req.query;

  db.query(
    `
    SELECT id, name, pairing_code, last_seen,
    IF(TIMESTAMPDIFF(SECOND, last_seen, NOW()) < 20, 1, 0) AS online
    FROM displays
    WHERE user_id = ?
    `,
    [userId],
    (err, rows) => {
      if (err) return res.status(500).json(err);
      res.json(rows);
    }
  );
});

module.exports = router;