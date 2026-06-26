const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const { uploadAsset, getAssets,deleteAsset,generateTemplateAsset } = require("../controllers/assetController");

const storage = multer.diskStorage({
  destination: "src/uploads",
  filename: (_, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

router.post("/upload", upload.single("file"), uploadAsset);
router.get("/", getAssets);
router.delete("/:id", deleteAsset);
router.post("/generate-template", generateTemplateAsset);
module.exports = router;