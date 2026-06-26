const db = require("../models/db");
const { v4: uuid } = require("uuid");
const geoip = require("geoip-lite");

// Generate 6-character pairing code
const generateCode = () => {
  return uuid().slice(0, 6).toUpperCase();
};

// TV registers itself
const registerDisplay = (req, res) => {
  const code = generateCode();
  console.log("REGISTER DISPLAY HIT");
  console.log("Generated code:", code);

  const sql = "INSERT INTO displays (pairing_code) VALUES (?)";
  db.query(sql, [code], (err, result) => {
    if (err) return res.status(500).send(err);

    res.json({
      displayId: result.insertId,
      pairingCode: code
    });
  });
};

// Client pairs with TV using code
const pairDisplay = (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ message: "Pairing code required" });
  }

  const sql =
    "SELECT * FROM displays WHERE pairing_code = ? AND is_paired = false";

  db.query(sql, [code], (err, results) => {
    if (err) return res.status(500).send(err);

    if (results.length === 0) {
      return res
        .status(404)
        .json({ message: "Invalid or already used code" });
    }

    const displayId = results[0].id;

    db.query(
      "UPDATE displays SET is_paired = true WHERE id = ?",
      [displayId],
      () => {
        req.io.to(code).emit("tv-paired");

        res.json({
          message: "TV paired successfully",
          displayId
        });
      }
    );
  });
};

const getPlayers = (req, res) => {
  const { userId } = req.query;

  const sql = `
  SELECT
    d.id,
    d.name,
    d.pairing_code,
    d.location,
    d.last_seen,
    d.current_playlist_id,
    p.name AS current_playlist_name,
    (
      SELECT COUNT(*)
      FROM playlist_assets pa
      JOIN assets a ON a.id = pa.asset_id
      WHERE pa.playlist_id = d.current_playlist_id
        AND a.file_type = 'image'
    ) AS image_count,

    -- ✅ video count
    (
      SELECT COUNT(*)
      FROM playlist_assets pa
      JOIN assets a ON a.id = pa.asset_id
      WHERE pa.playlist_id = d.current_playlist_id
        AND a.file_type = 'video'
    ) AS video_count,
    GROUP_CONCAT(g.name SEPARATOR ', ') AS group_name,

    IF(TIMESTAMPDIFF(SECOND, d.last_seen, NOW()) < 20, 1, 0) AS online

  FROM displays d
  LEFT JOIN playlists p ON p.id = d.current_playlist_id
  LEFT JOIN display_group_players dgp ON d.id = dgp.display_id
  LEFT JOIN display_groups g ON g.id = dgp.group_id

  WHERE d.user_id = ?
  GROUP BY d.id
  ORDER BY d.name
`;

  db.query(sql, [userId], (err, rows) => {
    if (err) {
      console.error("getPlayers error:", err);
      return res.status(500).json([]);
    }
    res.json(rows);
  });
};

// REGISTER PLAYER (WITH CORRECT DEVICE LIMIT)
const registerPlayer = (req, res) => {
  const { pairingCode, name, timezone, location, userId } = req.body;

  if (!pairingCode || !userId) {
    return res.status(400).json({ message: "Missing data" });
  }

  // 🔍 STEP 1: VALIDATE PAIRING CODE
  db.query(
    "SELECT id, is_paired FROM displays WHERE pairing_code = ?",
    [pairingCode],
    (err, rows) => {
      if (err) return res.status(500).json({ message: "DB error" });

      if (rows.length === 0) {
        return res.status(400).json({ message: "Invalid TV code" });
      }

      if (rows[0].is_paired === 1) {
        return res.status(400).json({ message: "Player already registered" });
      }

      // 🔒 DEVICE LIMIT CHECK
      const limitSql = `
        SELECT
          max_devices,
          (
            SELECT COUNT(*)
            FROM displays
            WHERE user_id = ? AND is_paired = 1
          ) AS current_devices
        FROM users
        WHERE id = ?
      `;

      db.query(limitSql, [userId, userId], (err, limitRows) => {
        if (err || !limitRows.length) {
          return res.status(500).json({ message: "Device limit check failed" });
        }

        const { max_devices, current_devices } = limitRows[0];

        if (current_devices >= max_devices) {
          return res
            .status(403)
            .json({ message: `Device limit reached (${max_devices})` });
        }

        // ✅ REGISTER PLAYER
        const updateSql = `
          UPDATE displays
          SET
            name = ?,
            location = ?,
            timezone = ?,
            is_paired = 1,
            user_id = ?
          WHERE pairing_code = ?
        `;

        db.query(
          updateSql,
          [name, location || null, timezone, userId, pairingCode],
          (err) => {
            if (err) {
              console.error("Register player DB error:", err);
              return res.status(500).json({ message: "DB error" });
            }

            res.json({ message: "Player registered successfully" });
          }
        );
      });
    }
  );
};
// UNREGISTER PLAYER
const unregisterPlayer = (req, res) => {
  const { id } = req.params;

  const sql = `
    UPDATE displays
    SET
      user_id = NULL,
      is_paired = 0,
      name = NULL,
      location = NULL,
      timezone = NULL
    WHERE id = ?
  `;

  db.query(sql, [id], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "DB error" });
    }

    res.json({ message: "Player unregistered successfully" });
  });
};

module.exports = {
  registerDisplay,
  pairDisplay,
  getPlayers,
  registerPlayer,
  unregisterPlayer
};