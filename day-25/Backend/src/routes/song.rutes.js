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
 * @route GET /api/songs
 * @description Fetch song based on mood ... Mood will be given in query :- /api/songs?mood=sad
 */
router.get("/", songController.getSong)

/**
 * @route GET /api/songs/
 * @description Fetch all songs
 */
router.get("/all-songs", songController.getAllSongs)

module.exports = router;