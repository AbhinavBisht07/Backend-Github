const express = require("express");
const postRouter = express.Router();
const postController = require("../controllers/post.controller");

//Using multer to recieve and read file :-
const multer = require("multer");
// Then using memoryStorage to temorarily store file in server's RAM as a BUFFER
const upload = multer({ storage: multer.memoryStorage() });

const identifyUser = require("../middlewares/auth.middleware");



/**
 * @route POST /api/posts [protected]
 * @description Create a post with the content and image provided in the request body( req.body = { caption, image-file } ). The post should be associated with the user, from whom the request came. 
 * @access Private
 */
postRouter.post("/", upload.single("image"), identifyUser,postController.createPostController)


/**
 * @route GET /api/posts/  [protected]
 * @description Get all the posts created by the user that the request came from. Also return the total number of posts created by the user.
 * @access Private
 */
postRouter.get("/", identifyUser, postController.getPostController)


/**
 * @route GET /api/posts/details/:postid
 * @description return details about a specific post with the id. Also check whether the posts belongs to the user that is requesting or from whom the request came...
 * @access Private
 */
postRouter.get("/details/:postId", identifyUser, postController.getPostDetailsController)


/**
 * @route POST /api/posts/like/:postid
 * @description like a post with the provided postId in the request inside params (req.params.postid). 
 */
postRouter.post("/like/:postId", identifyUser, postController.likePostController)

module.exports = postRouter;