const db = require("../models/db");
const fs = require("fs");
const path = require("path");

/* =========================
   UPLOAD ASSET (UNCHANGED LOGIC)
========================= */
exports.uploadAsset = (req, res) => {
  const { userId } = req.body;

  if (!req.file || !userId) {
    return res.status(400).json({ message: "Missing file or userId" });
  }

  const type = req.file.mimetype.startsWith("video")
    ? "video"
    : "image";

const filePath = `/uploads/${req.file.filename}`; // ✅ KEEP THIS  const fullPath = path.resolve(process.cwd(), "src", filePath);
const fullPath = path.resolve(
  process.cwd(),
  "src/uploads",
  req.file.filename
);

  const sql = `
    INSERT INTO assets (user_id, file_name, file_path, file_type, file_size)
    VALUES (?, ?, ?, ?, ?)
  `;

  // 🔍 Prevent duplicate uploads
  db.query(
    "SELECT * FROM assets WHERE file_name = ? AND user_id = ?",
    [req.file.originalname, userId],
    (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "DB error" });
      }

      if (rows && rows.length > 0) {
        // ❌ delete newly uploaded duplicate file
        fs.unlink(fullPath, (err) => {
          if (err) {
            console.warn("⚠️ Duplicate file cleanup failed:", err.message);
          } else {
            console.log("🗑 Duplicate file removed:", fullPath);
          }
        });

        return res.json({
          message: "File already exists",
          asset: rows[0]
        });
      }

      // ✅ Insert new asset
      db.query(
        sql,
        [
          userId,
          req.file.originalname,
          filePath,
          type,
          req.file.size
        ],
        (err) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ message: "DB error" });
          }

          res.json({ message: "Asset uploaded" });
        }
      );
    }
  );
};

/* =========================
   GET ASSETS (FIXED ORDER BY)
========================= */
exports.getAssets = (req, res) => {
  const { userId } = req.query;

  db.query(
    "SELECT * FROM assets WHERE user_id = ? ORDER BY id DESC",
    [userId],
    (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).json([]);
      }
      res.json(rows);
    }
  );
};

/* =========================
   DELETE ASSET (NEW – REQUIRED)
========================= */
exports.deleteAsset = (req, res) => {
  const { id } = req.params;

  db.query(
    "SELECT file_path FROM assets WHERE id = ?",
    [id],
    (err, rows) => {
      if (err || rows.length === 0) {
        return res.status(404).json({ message: "Asset not found" });
      }

      const filename = path.basename(rows[0].file_path);

      // ✅ ALWAYS resolve correctly
      const filePath = path.resolve(
        process.cwd(),
        "src/uploads",
        filename
      );

      fs.unlink(filePath, (err) => {
        if (err) {
          console.warn("⚠️ File delete issue:", filePath, err.message);
        } else {
          console.log("✅ File deleted:", filePath);
        }

        db.query(
          "DELETE FROM assets WHERE id = ?",
          [id],
          (err) => {
            if (err) {
              console.error(err);
              return res.status(500).json({ message: "DB delete error" });
            }

            res.json({ message: "Asset deleted successfully" });
          }
        );
      });
    }
  );
};