const db = require("../models/db");

/* =========================
   ADD ASSET TO PLAYLIST
========================= */
exports.addToPlaylist = (req, res) => {
  const { playlistId, assetIds } = req.body;

  if (!playlistId || !Array.isArray(assetIds)) {
    return res.status(400).json({ message: "Invalid data" });
  }

  const values = assetIds.map((assetId, index) => [
    playlistId,
    assetId,
    10,        // default duration
    index      // sort order
  ]);

  const sql = `
    INSERT IGNORE INTO playlist_assets
    (playlist_id, asset_id, duration, sort_order)
    VALUES ?
  `;

  db.query(sql, [values], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Assign failed" });
    }
    res.json({ message: "Assets added to playlist" });
  });
};

/* =========================
   REMOVE ASSET FROM PLAYLIST
========================= */
exports.removeFromPlaylist = (req, res) => {
  const { playlistId, assetId } = req.params;

  const sql = `
    DELETE FROM playlist_assets
    WHERE playlist_id = ? AND asset_id = ?
  `;

  db.query(sql, [playlistId, assetId], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Remove failed" });
    }
    res.json({ message: "Asset removed from playlist" });
  });
};

/* =========================
   GET PLAYLIST ASSETS (ORDERED)
========================= */
exports.getPlaylistAssets = (req, res) => {
  const { playlistId } = req.params;

  const sql = `
    SELECT 
      pa.id AS playlist_asset_id,
      pa.duration,
      pa.sort_order,
      a.*
    FROM playlist_assets pa
    JOIN assets a ON a.id = pa.asset_id
    WHERE pa.playlist_id = ?
    ORDER BY pa.sort_order ASC
  `;

  db.query(sql, [playlistId], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json([]);
    }
    res.json({ assets: rows });
  });
};
exports.getPlaylistStats = (req, res) => {
  const { playlistId } = req.params;

  const sql = `
    SELECT
      COUNT(CASE WHEN a.file_type = 'image' THEN 1 END) AS image_count,
      COUNT(CASE WHEN a.file_type = 'video' THEN 1 END) AS video_count,
      COALESCE(SUM(pa.duration), 0) AS total_duration
    FROM playlist_assets pa
    JOIN assets a ON a.id = pa.asset_id
    WHERE pa.playlist_id = ?
  `;

  db.query(sql, [playlistId], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({});
    }
    res.json(rows[0]);
  });
};