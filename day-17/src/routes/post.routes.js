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


// GET /api/posts/
// identify user and FETCH user posts
postRouter.get("/", postController.getPostController)


// GET /api/posts/details/:postid
// return details about a specific post with the id. Also check whether the posts belongs to the user that is requesting or from whom the request came...
postRouter.get("/details/:postId", postController.getPostDetailsController)


module.exports = postRouter;