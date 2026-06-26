const express = require("express");
const router = express.Router();
const db = require("../models/db");

/**
 * GET /api/devices/:pairingCode/playlist
 * Returns assets + tickerConfig for the device
 */
router.get("/:pairingCode/playlist", (req, res) => {
  const { pairingCode } = req.params;

  // 1️⃣ Get assigned playlist for device
  db.query(
    "SELECT current_playlist_id FROM displays WHERE pairing_code = ?",
    [pairingCode],
    (err, rows) => {
      if (err) {
        console.error("Display lookup error:", err);
        return res.status(500).json({ assets: [], tickerConfig: null });
      }

      if (!rows.length || !rows[0].current_playlist_id) {
        // No playlist assigned yet
        return res.json({ assets: [], tickerConfig: null });
      }

      const playlistId = rows[0].current_playlist_id;

      // 2️⃣ Get playlist assets (IMPORTANT: sort_order)
      db.query(
        `
        SELECT 
          a.id,
          a.file_name,
          a.file_path,
          a.file_type,
          pa.duration
        FROM playlist_assets pa
        JOIN assets a ON a.id = pa.asset_id
        WHERE pa.playlist_id = ?
        ORDER BY pa.sort_order ASC
        `,
        [playlistId],
        (err2, assets) => {
          if (err2) {
            console.error("Playlist assets error:", err2);
            return res.status(500).json({ assets: [], tickerConfig: null });
          }

          // 3️⃣ Get ticker config
          db.query(
            "SELECT ticker_config FROM playlists WHERE id = ?",
            [playlistId],
            (err3, rows2) => {
              let tickerConfig = null;

              if (!err3 && rows2.length && rows2[0].ticker_config) {
                try {
                  tickerConfig = JSON.parse(rows2[0].ticker_config);
                } catch (e) {
                  console.error("Ticker JSON parse error:", e);
                }
              }

              // ✅ FINAL RESPONSE
              res.json({
                assets,
                tickerConfig
              });
            }
          );
        }
      );
    }
  );
});

module.exports = router;
