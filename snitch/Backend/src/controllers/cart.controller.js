import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";
import { stockOfVariant } from "../dao/product.dao.js";


export const addToCart = async (req, res) => {

    const { productId, variantId } = req.params;
    const { quantity = 1 } = req.body;

    const product = await productModel.findOne({
        _id: productId,
        "variants._id": variantId
    })

    // ab do conditions kko ek sath handle karenge :- 1. agar productId ke base pe product nahi mila ya fir  2. Product to mil gaya but uske andar uss variantId se variant nahi mila 
    // to inn dono condition mein hum request ko reject kar denge

    if (!product) {
        return res.status(404).json({
            message: "Product not found",
            success: false
        });
    }

    const stock = await stockOfVariant(productId, variantId);

    // agar cart exist karti hogi to aa jaegi and cart mein save hojaegi agar nahi karti hogi to create ho jaegi 
    const cart = await cartModel.findOne({ user: req.user._id }) || await cartModel.create({ user: req.user._id, items: [] });


    // ye line humko check karke bata rahi hai ki jo product hai wo user ki cart mein kahi already exist to nahi karta
    // Mtlb agar ooper wale check mein user ki cart already exist karti hai to ye bhi to possibility hai ki ye product already cart mein exixt karta ho
    const isProductAlreadyInCart = cart.items.some(item => item.product.toString() === productId && item.variant?.toString() === variantId);

    // agar product already exist karta hoga cart mein to uski quantity increase kar denge by 1 ... but usse pehle ek aur cheez check karni padegi ki itna stock hai bhi ya nahi .. And stock check karne wala kaam bohot jagah pe hora hoga .... to iske liye hum ek DAO file create kar lennge 
    if (isProductAlreadyInCart) {
        // const stock = await stockOfVariant(productId, variantId);
        const quantityInCart = cart.items.find(item => item.product.toString() === productId && item.variant?.toString() === variantId)?.quantity || 0;

        if (quantityInCart + quantity > stock) {
            return res.status(400).json({
                message: `Only ${stock} items left in stock. 
                And you already have ${quantityInCart} items in your cart.
                So you can only add ${stock - quantityInCart} more items to your cart.`,
                success: false
            });
        }

        // if quantityInCart + quantity is not > stock
        await cartModel.findOneAndUpdate(
            {
                user: req.user._id,
                "items.product": productId,
                "items.variant": variantId
            },
            { $inc: { "items.$.quantity": quantity } },
            { new: true }
        )
        return res.status(200).json({
            message: "Cart updated successfully",
            success: true,
            data: cart
        });
    }


    // agar cart mein product already exist nahii karta hoga :-
    // tab bhi ek check to lagana padega ki user jo quantity add kar raha hai wo stock se zyada to nahi hai
    if (quantity > stock) {
        return res.status(400).json({
            message: `Only ${stock} items left in stock.`,
            success: false
        });
    }

    // agar quantity stock se jada nahi hai to :-
    cart.items.push({
        product: productId,
        variant: variantId,
        quantity,
        price: product.variants.find(variant => variant._id.toString() === variantId).price
    })
    await cart.save();

    return res.status(200).json({
        message: "Product added to cart successfully",
        success: true,
        data: cart
    });
}


export const getCart = async (req, res) => {
    const user = req.user;

    let cart = await cartModel.findOne({ user: user._id }).populate("items.product");

    if (!cart) {
        cart = await cartModel.create({
            user: user._id,
            items: []
        });
    }

    return res.status(200).json({
        message: "Cart fetched successfully",
        success: true,
        data: cart
    });
}