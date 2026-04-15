import { Router } from "express";
import { authenticateSeller } from "../middlewares/auth.middleware.js";
import { createProduct, getProductsBySeller } from "../controllers/product.controller.js";
import multer from "multer";
import { createProductValidator } from "../validator/product.validator.js";

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // Limit file size to 5MB
    }
})

const router = Router();


/**
 * @route POST /api/products/
 * @description Create a new product
 * @access Private
 */
router.post("/", authenticateSeller, upload.array("images", 7), createProductValidator, createProduct)


/**
 * @route GET /api/products/sellerId
 * @description Get all products of the authenticated seller
 * @access Private(seller only)
 */
router.get("/seller", authenticateSeller, getProductsBySeller)


export default router;