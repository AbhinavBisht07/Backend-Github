const mongoose = require("mongoose");


const likeSchema = new mongoose.Schema({
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "posts",
        required: [true, "post id required for creating a like"]
    },
    user: {
        type: String,
        required: [true, "username is required for creating a like"]
    }
}, {
    timestamps: true
})
// ek user ek post ko ek hi baar like kar sakta hai .. uske liye ek unique index create kar lenge hum :-
likeSchema.index({ post:1, user:1 }, { unique: true });


const likeModel = mongoose.model("likes", likeSchema);


module.exports = likeModel