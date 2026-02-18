const followModel = require("../models/follow.model");
const userModel = require("../models/user.model");


// CONTROLLERS FOR THE USER WHO CAN SEND FOLLOW REQUESTS :-
async function followUserController(req, res) {
    // const followerId = req.user.id; // jo user request kar raha follow karne ki(client/ logged in user) .. uski id
    // const followeeId = req.params.userid; // jiss user ko follow karne ki request aayi hai ... ya we can say jiss user ko follow kia ja raha hai uski id...

    const followerUsername = req.user.username; // jo user request kar raha follow karne ki(client/ logged in user) .. uska username
    const followeeUsername = req.params.username; // jiss user ko follow karne ki request aayi hai ... ya we can say jiss user ko follow kia ja raha hai uska username...

    // Check1.: check if user is trying to follow themselves :-
    if (followerUsername === followeeUsername) {
        return res.status(400).json({
            message: "You cannot follow yourself"
        })
    }

    // Check3.: The username you are requesting to follow, if any user exists with that username :- 
    const doesFolloweeExists = await userModel.findOne({
        username: followeeUsername
    })
    if (!doesFolloweeExists) {
        return res.status(404).json({
            message: "User you are trying to follow does not exist."
        })
    }

    // Check2.: Check if user already follow some user and they are trying to follow the same user again :-
    // const isAlreadyFollowing = await followModel.findOne({
    //     follower: followerUsername,
    //     followee: followeeUsername
    // })
    // if(isAlreadyFollowing){
    //     return res.status(200).json({
    //         message: `You already follow ${followeeUsername}`,
    //         follow: isAlreadyFollowing
    //     })
    // }

    // as we are implementing follow request(pending, accepted, rejected) feature .. this is how we check :-
    // if follow request exists :-
    const existingFollowRequest = await followModel.findOne({
        follower: followerUsername,
        followee: followeeUsername
    })
    // if exists :-
    if (existingFollowRequest) {
        if (existingFollowRequest.status === "pending") {
            return res.status(200).json({
                message: "Follow request already sent."
            })
        }
        if (existingFollowRequest.status === "accepted") {
            return res.status(200).json({
                message: `You already follow ${followeeUsername}.`
            })
        }
        if (existingFollowRequest.status === "rejected") {
            // allow sending request again :-
            existingFollowRequest.status = "pending";
            await existingFollowRequest.save();

            return res.status(200).json({
                message: "Follow request sent again.",
                follow: existingFollowRequest
            })
        }
    }

    // finally creating followRecord if exstingFollowRequest doesn't exists(user never followed other user before) :-
    const followRecord = await followModel.create({
        follower: followerUsername,
        followee: followeeUsername,
        status: "pending"
    })

    res.status(201).json({
        message: `Follow request sent to ${followeeUsername}`,
        follow: followRecord
    })
}

// async function unfollowUserController(req,res){
//     const followerUsername = req.user.username;
//     const followeeUsername = req.params.username;

//     // check if you follow the user that you are trying to unfollow
//     const isUserFollowing = await followModel.findOne({
//         follower: followerUsername,
//         followee: followeeUsername
//     })
//     // If you dont follow that user :-
//     if(!isUserFollowing){
//         res.status(200).json({
//             message: `You do not follow ${followeeUsername}`
//         })
//     }

//     // if you follow that user ... delete that follow record:-
//     await followModel.findByIdAndDelete(isUserFollowing._id);


//     // final response:-
//     res.status(200).json({
//         message: `You have unfollowed ${followeeUsername}`
//     })
// }
async function unfollowUserController(req, res) {
    const followerUsername = req.user.username;
    const followeeUsername = req.params.username;
    
    // prevent user from unfollowing themselves
    if (followerUsername === followeeUsername) {
        return res.status(400).json({
            message: "You cannot unfollow yourself"
        });
    }

    // check if you follow the user that you are trying to unfollow(accepted) ... or if you have send a folllow request to the user(pending) ... or if your follow request has been rejected by the user(rejected) :-
    const followRecord = await followModel.findOne({
        follower: followerUsername,
        followee: followeeUsername
    })
    // If you dont follow that user(accepted) and you have not send follow request(pending) and the user has not yet rejected any of your requests(rejected) ...(whhich means you havent sent any request yet till date).:-
    if (!followRecord) {
        return res.status(200).json({
            // message: `No follow record found for ${followeeUsername}`
            message: `Follow record does not exist.`
        })
    }


    // if followRecord found(accepted, pending or rejected) ... delete that follow record from database:-
    await followModel.findByIdAndDelete(followRecord._id);

    // followRecord was deleted from Database but it still exists in the variable followRecord we created ... so using that variable we will check if followRecord's status is "pending"... and if it is we will send a response 
    // we have deleted the record anyway ... but if request was pending send this response :-
    if (followRecord.status === "pending") {
        return res.status(200).json({
            message: `Follow request sent to ${followeeUsername} is cancelled`
        })
    }

    // if request was "accepted" send this response :-
    return res.status(200).json({
        message: `You have unfollowed ${followeeUsername}`
    })
}


// CONTROLLERS FOR THE USER WHO CAN ACCEPT AND REJECT FOLLOW REQUESTS :-
async function getPendingFollowRequestsController(req, res) {
    const username = req.user.username;

    const requests = await followModel.find({
        followee: username,
        status: "pending"
    })
    // as find() method always returns an array .. and if no matching values found it returns an empty array ...
    if (requests.length === 0) {
        return res.status(200).json({
            message: "Currently no pending follow requests exist.",
            requests
        })
    }

    res.status(200).json({
        message: "Pending follow requests fetched successfully",
        requests
    })
}

async function acceptFollowRequestController(req, res) {
    const requestId = req.params.requestId; // followRecord's id
    const username = req.user.username;

    const request = await followModel.findById(requestId);

    if (!request) {
        return res.status(404).json({
            message: "Follow request not found."
        })
    }

    if (request.followee !== username) {
        return res.status(403).json({
            message: "Unauthorized to accept this follow request."
        })
    }

    // prevent user from accepting already accepted requests
    if (request.status !== "pending") {
        return res.status(400).json({
            message: "Request already processed."
        });
    }

    request.status = "accepted";
    await request.save();

    // final response :-
    res.status(200).json({
        message: "Follow request accepted",
        request
    })
}

async function rejectFollowRequestController(req, res) {
    const requestId = req.params.requestId;
    const username = req.user.username;

    const request = await followModel.findById(requestId);
    if (!request) {
        return res.status(404).json({
            message: "Follow request not found."
        })
    }

    if (request.followee !== username) {
        return res.status(403).json({
            message: "Unauthorized to reject this follow request."
        })
    }

    // prevent user from rejecting already rejected requests
    if (request.status !== "pending") {
        return res.status(400).json({
            message: "Request already processed."
        });
    }

    request.status = "rejected";
    await request.save();

    // final response:-
    res.status(200).json({
        message: "Follow request rejected",
        request
    })
}


module.exports = {
    followUserController,
    unfollowUserController,
    getPendingFollowRequestsController,
    acceptFollowRequestController,
    rejectFollowRequestController
}