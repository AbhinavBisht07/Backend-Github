const express = require("express")
const userController = require("../controllers/user.controller");
const identifyUser = require("../middlewares/auth.middleware");

const userRouter = express.Router();


// Neeche jo use kari hai its nothing but a JavaScript Comment String ... it does not have any "functionality" ... its core purpose is only "readability".... kalko hum apnna code padhein ya koi aur humara code padhe to usko smajh ajaye ki ye API ka route kya hai, ye APi karti kya hai ... and API private hai ya public ....
// Description abhi to bohot chhota likh rakha humne ... prooduction mein jaenge to thode aur bade description dekhne ko milenge humko ... and humko bhi thode bade description likhne padenge .. 
// isse code ki readability and understanding badhti hai ...
// 2 type ki comment string hoti hain :- 
// 1. ek to hum jo direct ctrl + slash karke likhte hain 
// 2. Jo neeche use kari hai .. "/" + "*" + "*" .... slash + asterisk + asterisk.


// APIs for the user sending follow requests or trying to unfollow another user :-
/**
 * @route POST /api/users/follow/:username
 * @description Follow a user(send a follow request to a user)
 * @access Private
 */
userRouter.post("/follow/:username", identifyUser, userController.followUserController)

/**
 * @route DELETE /api/users/unfollow/:username
 * @description Unfollow a user
 * @access Private
 */
userRouter.delete("/unfollow/:username", identifyUser, userController.unfollowUserController)



// APIs for the user who is accepting/rejecting follow requests :-
/**
 * @route GET /api/users/follow/requests
 * @description fetches all the follow requests' records of the user
 * @access Private
 */
userRouter.get("/follow/requests", identifyUser, userController.getPendingFollowRequestsController)


/**
 * @route PATCH /api/users/follow/accept/:requestId
 * @description accepts follow request, if exists. Also checks if user is authorized to accept the request.
 * @access Private
 */
userRouter.patch("/follow/accept/:requestId", identifyUser, userController.acceptFollowRequestController);


/**
 * @route PATCH /api/users/follow/reject/:requestId
 * @description rejects follow request, if exists. Also checks if user is authorized to reject the request.
 * @access Private
 */
userRouter.patch("/follow/reject/:requestId", identifyUser, userController.rejectFollowRequestController);




module.exports = userRouter;