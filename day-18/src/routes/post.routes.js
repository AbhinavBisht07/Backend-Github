const express = require("express");
const postRouter = express.Router();
const postController = require("../controllers/post.controller");

//Using multer to recieve and read file :-
const multer = require("multer");
// Then using memoryStorage to temorarily store file in server's RAM as a BUFFER
const upload = multer({ storage: multer.memoryStorage() });

const identifyUser = require("../middlewares/auth.middleware");



// - POST /api/posts [protected]
// - req.body = { caption, image-file }
postRouter.post("/", upload.single("image"), identifyUser,postController.createPostController)


// GET /api/posts/
// identify user and FETCH user posts
postRouter.get("/", identifyUser, postController.getPostController)


// GET /api/posts/details/:postid
// return details about a specific post with the id. Also check whether the posts belongs to the user that is requesting or from whom the request came...
postRouter.get("/details/:postId", identifyUser, postController.getPostDetailsController)


module.exports = postRouter;