const express = require("express");
const postRouter = express.Router();
const postController = require("../controllers/post.controller");

//Using multer to recieve and read file :-
const multer = require("multer");
// Then using memoryStorage to temorarily store file in server's RAM as a BUFFER
const upload = multer({ storage: multer.memoryStorage() });



// - POST /api/posts [protected]
// - req.body = { caption, image-file }
postRouter.post("/", upload.single("image") ,postController.createPostController)



module.exports = postRouter;