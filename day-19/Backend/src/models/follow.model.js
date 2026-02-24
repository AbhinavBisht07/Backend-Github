const mongoose = require("mongoose");


const followSchema = new mongoose.Schema(
    {
        follower: {
            type: String,
            required: [true, "Follower username is required"]
        },
        followee: {
            type: String,
            required: [true, "Followee username is required"]
        },
        status: {
            type: String,
            default: "pending",
            enum: {
                values: ["pending", "accepted", "rejected"],
                message: "Status can only be pending, accepted or rejected"
            }
        }
    }, 
    { timestamps: true }
)

followSchema.index({ follower: 1, followee: 1 }, { unique: true });

const followModel = mongoose.model("follows", followSchema);

module.exports = followModel;



// const mongoose = require("mongoose");

// const followSchema = new mongoose.Schema(
//     {
//         follower: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "users",
//             required: [true, "Follower is required"]
//         },
//         follwee: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "users",
//             required: [true, "Followee is required"]
//         }
//     }, 
//     { timestamps: true }
// )

// const followModel = mongoose.model("follows", followSchema);

// module.exports = followModel;