import mongoose from "mongoose";
import priceSchema from "./price.schema.js";

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "products",
                required: true
            },
            variant: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "products.variants",
            },
            quantity: {
                type: Number,
                default: 1
            },
            price: {
                type: priceSchema,
                required: true
            },
            size: {
                type: String
            },
            color: {
                type: String
            }
        }
    ]
})


const cartModel = mongoose.model("carts", cartSchema);


export default cartModel;