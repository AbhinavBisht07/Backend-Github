const postModel = require("../models/post.model");
const ImageKit = require("@imagekit/nodejs");
const { toFile } = require("@imagekit/nodejs");
const jwt = require("jsonwebtoken");


const imageKit = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY
})


async function createPostController(req, res){
    // console.log(req.body, req.file);

    // token ko access kar lenge user ke 
    const token = req.cookies.token;

    // agar kisi user pe token nahi hoga to iske 2 reasons hain .... ya to usnne register hi nahi kar rakha ... ya fir usne kabhi register kia tha and ab uska purana token expire ho chuka hai and usne dobara login nahi kia ...
    if(!token){
        res.status(401).json({
            message: "Token not provided, Unauthorized access"
        })
    }

    //decoded ke andar wahi data aajaega jo token banate wakt bheja tha humne .. yaani user ki id ajaegi ...
    let decoded = null
    try{
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    }catch(err){ 
        return res.status(401).json({
            message: err
        })
    }
    // console.log(decoded);

    // uploading image file to imageKit
    const file = await imageKit.files.upload({
        file: await toFile(Buffer.from(req.file.buffer), 'file'),
        fileName: "Test_image",
        folder: "cohort-2-insta-clone-posts"
    })
    // res.send(file); // got URL from this response .. or we can say got to know that URL is present inside file object


    // finally creatig post :-
    const post = await postModel.create({
        caption : req.body.caption,
        imgUrl: file.url,
        user: decoded.id
    })
    // sending response :- used status code 201 because we are creating a resource...
    res.status(201).json({
        message: "Post created successfully.",
        post
    })
}


module.exports = {
    createPostController
}