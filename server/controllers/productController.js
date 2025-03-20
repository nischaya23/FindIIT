const mongoose = require("mongoose");
const Product = require("../models/Product");

exports.getProducts = async (req, res) => {
    try {
        const { search } = req.query;
        let query = {};

        if (search) {
            query = {
                $or: [
                    { category: { $regex: search, $options: "i" } },
                    { description: { $regex: search, $options: "i" } },
                    { location: { $regex: search, $options: "i" } },
                    { tags: { $in: [new RegExp(search, "i")] } },
                ],
            };
        }

        const products = await Product.find(query);
        return res.status(200).json({ data: products, message: "Products Returned" });
    } catch (error) {
        console.error("Error fetching products:", error.message);
        return res.status(500).json({ message: "Server Error" });
    }
};

exports.createProduct = async (req, res) => {
    const product = req.body;

    if (req.file) {
        product.uploadedImage = `/uploads/${req.file.filename}`;
    }

    if (
        !product.itemStatus ||
        !product.category ||
        !product.location ||
        !product.coordinates ||
        !product.coordinates.latitude ||
        !product.coordinates.longitude ||
        !product.contactDetails
    ) {
        return res.status(400).json({ success: false, message: "Please provide all required fields" });
    }

    const newProduct = new Product(product);

    try {
        await newProduct.save();
        res.status(201).json({ success: true, data: newProduct, message: "Added successfully" });
    } catch (error) {
        console.error("Error in Create product:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

exports.deleteProduct = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Invalid Product Id" });
    }

    try {
        await Product.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Product deleted" });
    } catch (error) {
        console.log("error in deleting product:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

exports.getProductById = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: "Invalid Product ID" });
    }

    try {
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        res.status(200).json({ success: true, data: product });
    } catch (error) {
        console.error("Error fetching product:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
