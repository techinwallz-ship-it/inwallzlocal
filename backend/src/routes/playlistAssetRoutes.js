const express = require("express");
const router = express.Router();
const {
  addToPlaylist,
  removeFromPlaylist,
  getPlaylistAssets
} = require("../controllers/playlistAssetController");

router.post("/", addToPlaylist);
router.delete("/:id", removeFromPlaylist);
router.get("/playlist/:playlistId", getPlaylistAssets);

module.exports = router;