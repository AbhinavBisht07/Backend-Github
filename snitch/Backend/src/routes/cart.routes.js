import Router from "express";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { validateAddToCart } from "../validator/cart.validator.js";
import { addToCart, getCart } from "../controllers/cart.controller.js";

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


export default router;