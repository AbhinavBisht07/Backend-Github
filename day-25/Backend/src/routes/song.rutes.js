const {Router} = require("express");
const upload = require("../middlewares/upload.middleware");
const songController = require("../controllers/song.controller");

const router = Router();


/**
 * @route POST /api/songs/
 * @description Upload song
 */
router.post("/", upload.single("song"), songController.uploadSong)

/**
 * @route 
 */
router.get("/", songController.getSong)

module.exports = router;