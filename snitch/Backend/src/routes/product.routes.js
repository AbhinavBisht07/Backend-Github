import { Router } from "express";
import { authenticateSeller } from "../middlewares/auth.middleware.js";
import { addProductVariant, createProduct, deleteProductVariant, getAllProducts, getProductDetails, getProductsBySeller, updateProduct, updateProductVariant } from "../controllers/product.controller.js";
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


/**
 * @route GET /api/products/
 * @description Get all products
 * @access Public
 */
router.get("/", getAllProducts)


/**
 * @route GET /api/products/details/:id
 * @description Get a single product by ID
 * @access Public
 */
router.get("/details/:id", getProductDetails)


/**
 * @route post /api/products/:productId/variants
 * @description Add new variant to a product
 * @access Private
 */
router.post("/:productId/variants", authenticateSeller, upload.array("images", 7), addProductVariant)
+
+/**
+ * @route PATCH /api/products/:productId
+ * @description Update main product details
+ */
+router.patch("/:productId", authenticateSeller, updateProduct)
+
+/**
+ * @route PATCH /api/products/:productId/variants/:variantId
+ * @description Update specific variant details or stock
+ */
+router.patch("/:productId/variants/:variantId", authenticateSeller, updateProductVariant)
+
+/**
+ * @route DELETE /api/products/:productId/variants/:variantId
+ * @description Delete a specific variant
+ */
+router.delete("/:productId/variants/:variantId", authenticateSeller, deleteProductVariant)

export default router;