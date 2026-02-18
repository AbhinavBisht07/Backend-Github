const postModel = require("../models/post.model");
const ImageKit = require("@imagekit/nodejs");
const { toFile } = require("@imagekit/nodejs");
const jwt = require("jsonwebtoken");
const likeModel = require("../models/like.model");


const imageKit = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY
})


async function createPostController(req, res){
    // console.log(req.body, req.file);

    // // token ko access kar lenge user ke 
    // const token = req.cookies.token;

    // // agar kisi user pe token nahi hoga to iske 2 reasons hain .... ya to usnne register hi nahi kar rakha ... ya fir usne kabhi register kia tha and ab uska purana token expire ho chuka hai and usne dobara login nahi kia ...
    // if(!token){
    //     res.status(401).json({
    //         message: "Token not provided, Unauthorized access"
    //     })
    // }

    // //decoded ke andar wahi data aajaega jo token banate wakt bheja tha humne .. yaani user ki id ajaegi ...
    // let decoded = null
    // try{
    //     decoded = jwt.verify(token, process.env.JWT_SECRET);
    // }catch(err){ 
    //     return res.status(401).json({
    //         message: err
    //     })
    // }
    // // console.log(decoded);

    // uploading image file to imageKit
    const file = await imageKit.files.upload({
        file: await toFile(Buffer.from(req.file.buffer), 'file'),
        fileName: "Test_image",
        folder: `cohort-2-insta-clone/posts`
    })
    // res.send(file); // got URL from this response .. or we can say got to know that URL is present inside file object


    // finally creatig post :-
    const post = await postModel.create({
        caption : req.body.caption,
        imgUrl: file.url,
        // user: decoded.id
        user: req.user.id
    })
    // sending response :- used status code 201 because we are creating a resource...
    res.status(201).json({
        message: "Post created successfully.",
        post
    })
}


async function getPostController(req,res){
    // const token = req.cookies.token;
    // // checking if token exsts :-
    // if(!token){
    //     return res.status(401).json({
    //         message: "Unauthorized access"
    //     })
    // }

    // // identifying which user requested :-
    // let decoded = null;
    // try{
    //     decoded = jwt.verify(token, process.env.JWT_SECRET)
    // }catch(err){
    //     return res.status(401).json({
    //         message: "Token invalid."
    //     })
    // }

    // if we get decoded means that we have found user that requested on this GET API ... we have got his/her id :- decoded.id
    // const userId = decoded.id;
    const userId = req.user.id;

    // hum querry ye laga rahe hain yahan pe ki... humein wo saari posts return kardo that contain this field and value ...
    // yaad karo humne posts ke andar "user" naam ki field store karwai thi and uss field ki value mein user ki id store karwai thi ...
    const posts = await postModel.find({
        user: userId
    })

    // final response :-
    res.status(200).json({
        message: "Posts fetched successfully",
        posts
    })
}


async function getPostDetailsController(req,res){
    // const token = req.cookies.token;
    // checking if token exists ...
    // if(!token){
    //     return res.status(401).json({
    //         message: "Unauthorized access"
    //     })
    // }

    // let decoded = null;
    // try{
    //     decoded = jwt.verify(token, process.env.JWT_SECRET);
    // }catch(err){
    //     return res.status(401).json({
    //         message: "Invalid token"
    //     })
    // }

    // const userId = decoded.id;
    const userId = req.user.id;
    const postId = req.params.postId;

    // Fetching post:-
    const post = await postModel.findById(postId);

    // if we didnt find any post :-
    if(!post){
        return res.status(404).json({
            message: "Post not found."
        })
    }

    // If we found the post ...checking if the same user created the post that is currently logged in :-
    // const isUserValid = post.user === userId
    // humne dekha ki postman se req send karne pe ek bug hora tha ki chaahe logged in wala user apni post bhi dekhna cch ra tha to bhi forbidden conent aara tha response mein ... to isko check karne ke liye mene inn dono ko console karwaya 
    // console.log(post.user, userId);
    // ye console karke pata chala ki post.user mein user ki id ObjectId ki form mein stored hai .. to hum directly compare ni kar sakte inn dono ko .. thats why pehle post.user ko string mein convert karke fir check kia humne :-
    const isUserValid = post.user.toString() === userId

    // is user is not valid
    if(!isUserValid){
        return res.status(403).json({
            message: "Forbidden Content."
        })
    }

    return res.status(200).json({
        message: "Post fetched successfully",
        post
    })
}


async function likePostController(req,res){ 
    const username = req.user.username; // the user that is trying to like a post.
    const postId = req.params.postId; // the post that is being liked

    // check1: checking if the post exists or not :-
    const post = await postModel.findById(postId);
    // if post not found:-
    if(!post){
        return res.status(404).json({
            message: "Post not found."
        })
    }

    // if post found but user has already liked it :-
    const hasAlreadyLiked = await likeModel.findOne({
        post: postId,
        user: username
    })
    if(hasAlreadyLiked){
        return res.status(200).json({
            message: "You have already liked this post.",
            hasAlreadyLiked
        })
    }

    // if user has not already liked the post create like record :-
    const like = await likeModel.create({
        post: postId,
        user: username
    })

    // final response :-
    res.status(200).json({
        message: "Post liked successfully",
        like
    })
}


module.exports = {
    createPostController,
    getPostController,
    getPostDetailsController,
    likePostController
}