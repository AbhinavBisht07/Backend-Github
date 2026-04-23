import Router from "express";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { validateAddToCart, validateIncrementCartItemQuantity } from "../validator/cart.validator.js";
import { addToCart, decrementCartItemQuantity, getCart, incrementCartItemQuantity, removeCartItem } from "../controllers/cart.controller.js";

const router = Router();

/**
 * @route POST /api/cart/add/:productId/:variantId
 * @description Add an item(product variant) to the cart
 * @access Private
 * @argument productId - ID of the product to be added to the cart
 * @argument variantId - ID of the product variant to be added to the cart
 * @argument quantity - Quantity of the product variant to be added to the cart(optional, default is 1)
 */
router.post("/add/:productId/:variantId", authenticateUser, validateAddToCart, addToCart)


/** 
 * @route GET /api/cart/
 * @description Get the user's cart
 * @access Private
 */
router.get("/", authenticateUser, getCart)


/**
 * @route PATCH /api/cart/quantity/increment/:productId/:variantId
 * @description Increment the quantity of an item(product variant) in the cart by 1
 * @access Private
 * @argument productId - ID of the product to be updated in the cart
 * @argument variantId - ID of the product variant to be updated in the cart
 */
router.patch("/quantity/increment/:productId/:variantId", authenticateUser, validateIncrementCartItemQuantity, incrementCartItemQuantity)

/**
 * @route PATCH /api/cart/quantity/decrement/:productId/:variantId
 * @description Decrement the quantity of an item(product variant) in the cart by 1
 * @access Private
 * @argument productId - ID of the product to be updated in the cart
 * @argument variantId - ID of the product variant to be updated in the cart
 */
router.patch("/quantity/decrement/:productId/:variantId", authenticateUser, validateIncrementCartItemQuantity, decrementCartItemQuantity)   

/**
 * @route DELETE /api/cart/quantity/remove/:productId/:variantId
 * @description Remove an item from the cart
 * @access Private
 */
router.delete("/quantity/remove/:productId/:variantId", authenticateUser, removeCartItem)   


export default router;