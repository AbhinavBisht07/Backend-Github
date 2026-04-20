import productModel from "../models/product.model.js";
import { uploadFile } from "../services/storage.service.js";


export async function createProduct(req, res) {
    const { title, description, priceAmount, priceCurrency } = req.body;
    const seller = req.user;

    const images = await Promise.all(req.files.map(async (file) => {
        // console.log(file)
        return await uploadFile({
            buffer: file.buffer,
            fileName: file.originalname
        })
    }))

    const product = await productModel.create({
        title,
        description,
        price: {
            amount: priceAmount,
            currency: priceCurrency || "INR"
        },
        images,
        seller: seller._id
    })

    res.status(201).json({
        message: "Product created successfully",
        success: true,
        product
    })
}


export async function getProductsBySeller(req, res) {
    const seller = req.user;

    const products = await productModel.find({ seller: seller._id });

    res.status(200).json({
        message: "Products fetched successfully",
        success: true,
        products
    })
}


export async function getAllProducts(req, res) {
    const products = await productModel.find();

    return res.status(200).json({
        message: "Products fetched successfully",
        success: true,
        products
    })
}


export async function getProductDetails(req, res) {
    const { id } = req.params;

    const product = await productModel.findById(id);

    if (!product) {
        return res.status(404).json({
            message: "Product not found",
            success: false
        })
    }

    return res.status(200).json({
        message: "Product details fetched successfully",
        success: true,
        product
    })
}


export async function addProductVariant(req, res) {

    const productId = req.params.productId;

    const product = await productModel.findOne({
        _id: productId,
        seller: req.user._id
    });

    // 2 reasons product might not be found:
    // 1. Wrong product id (doesn't belong to this seller)
    // 2. Valid id but wrong seller (trying to edit someone else's product)
    if (!product) {
        return res.status(404).json({
            message: "Product not found",
            success: false
        })
    }

    const files = req.files;

    // Fix: use && so we don't enter when files is undefined/null
    // Fix: let Promise.all RETURN the results instead of pushing inside (push returns length, not the object)
    let images = [];
    if (files && files.length > 0) {
        images = await Promise.all(files.map(async (file) => {
            return await uploadFile({
                buffer: file.buffer,
                fileName: file.originalname
            });
        }));
    }

    const price = req.body.priceAmount;
    const stock = req.body.stock;
    const attributes = JSON.parse(req.body.attributes || "{}");

    const variant = {
        images,
        stock: Number(stock) || 0,
        attributes
    };

    // price is optional — only set it if priceAmount was sent
    if (price !== undefined && price !== '') {
        variant.price = {
            amount: Number(price),
            currency: req.body.priceCurrency || "INR"
        };
    }

    product.variants.push(variant);

    await product.save();

    return res.status(201).json({
        message: "Product variant added successfully",
        success: true,
        product
    });
}