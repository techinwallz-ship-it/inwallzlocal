const db = require("../models/db");
const fs = require("fs");
const path = require("path");
const { generateTemplateImage } =
require("../services/templateGenerator");
/* =========================
   UPLOAD ASSET (UNCHANGED LOGIC)
========================= */
exports.uploadAsset = (req, res) => {
  const { userId , isTemplate } = req.body;

  if (!req.file || !userId) {
    return res.status(400).json({ message: "Missing file or userId" });
  }

  const type = req.file.mimetype.startsWith("video")
    ? "video"
    : "image";

const filePath = `/uploads/${req.file.filename}`; 
const fullPath = path.resolve(
  process.cwd(),
  "src/uploads",
  req.file.filename
);

if (isTemplate == 1) {

  const backupPath = path.resolve(

    process.cwd(),

    "src/uploads",

    `original_${req.file.filename}`

  );

  fs.copyFileSync(fullPath, backupPath);

  console.log(

    "✅ Template backup created:",

    backupPath

  );

}
  const sql = `
    INSERT INTO assets (user_id, file_name, file_path, file_type, file_size,is_template)
    VALUES (?, ?, ?, ?, ?, ?)
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
          req.file.size,
          isTemplate == 1 ? 1 : 0          
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
      const originalPath = path.resolve(
  process.cwd(),
  "src/uploads",
  `original_${filename}`
);

if (fs.existsSync(originalPath)) {
  fs.unlinkSync(originalPath);
  console.log("✅ Original template deleted:", originalPath);
}
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

exports.generateTemplateAsset = async (req, res) => {
  try {
    const { assetId, text, userId } = req.body;

    db.query(
      "SELECT * FROM assets WHERE id = ?",
      [assetId],
      async (err, rows) => {
        if (err || !rows.length) {
          return res.status(404).json({
            message: "Template not found"
          });
        }

        const template = rows[0];

        const templatePath = path.resolve(
          process.cwd(),
          "src",
          template.file_path.replace(/^\/+/, "")
        );

        const generatedName =
          `generated_${Date.now()}.png`;

        const outputPath = path.resolve(
          process.cwd(),
          "src/generated",
          generatedName
        );

        await generateTemplateImage(
          templatePath,
          text,
          outputPath
        );

        const generatedDbPath =
          `/generated/${generatedName}`;

        db.query(
          `INSERT INTO assets
          (
            user_id,
            file_name,
            file_path,
            file_type,
            file_size,
            is_template
          )
          VALUES (?, ?, ?, ?, ?, 0)`,
          [
            userId,
            generatedName,
            generatedDbPath,
            "image",
            0
          ],
          (err, result) => {
            if (err) {
              console.error(err);
              return res.status(500).json({
                message: "DB insert failed"
              });
            }

            res.json({
              assetId: result.insertId,
              filePath: generatedDbPath
            });
          }
        );
      }
    );
  } catch (e) {
    console.error(e);
    res.status(500).json({
      message: "Generation failed"
    });
  }
};