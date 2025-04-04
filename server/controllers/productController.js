const mongoose = require("mongoose");
const Product = require("../models/Product");

exports.getProducts = async (req, res) => {
    try {
        const { search, filter, category } = req.query;
        let query = {};

        if (search) {
            query.$or = [
                { category: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
                { location: { $regex: search, $options: "i" } },
                { tags: { $in: [new RegExp(search, "i")] } },
            ];
        }

        // Apply lost/found filter
        if (filter && filter !== "all") {
            query.itemStatus = new RegExp(`^${filter}$`, "i");
        }

        // Apply category filter
        if (category) {
            query.category = new RegExp(`^${category}$`, "i");
        }

        const products = await Product.find(query).sort({ createdAt: -1 });
        return res.status(200).json({ data: products, message: "Products Returned" });
    } catch (error) {
        console.error("Error fetching products:", error.message);
        return res.status(500).json({ message: "Server Error" });
    }
};

exports.createProduct = async (req, res) => {
    const product = req.body;
    const id = req.user.id;
    const emailUser = req.user.email;

    product.uploadedBy = id;
    product.email = emailUser;

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
        return res.status(400).json({ success: false, message: "Invalid Product Id" });
    }

    try {
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        if (product.uploadedBy.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: "Unauthorized: You can only delete your own products" });
        }

        await Product.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Product deleted" });
    } catch (error) {
        console.error("Error in deleting product:", error.message);
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

        res.status(200).json({ success: true, data: product, message: "Returned product" });
    } catch (error) {
        console.error("Error fetching product:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

exports.getProductsByUploader = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(id);

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: `Invalid uploader ID${id}` });
        }

        const products = await Product.find({ uploadedBy: id });

        return res.status(200).json({ data: products, message: "Products by uploader returned" });
    } catch (error) {
        console.error("Error fetching products by uploader:", error.message);
        return res.status(500).json({ message: "Server Error" });
    }
};

exports.addClaimRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const userEmail = req.user.email;
        console.log(userEmail);

        const product = await Product.findById(id);
        if (!product) return res.status(404).json({ message: "Item not found" });

        if (product.uploadedBy.toString() === userId) {
            return res.status(400).json({ message: "You cannot claim your own item" });
        }

        if (product.claimed) {
            return res.status(400).json({ message: "Product already claimed" });
        }

        const existingClaim = product.claims.find(claim => claim.user.toString() === userId);
        if (existingClaim) {
            return res.status(400).json({ message: "You have already claimed this item" });
        }

        product.claims.push({ user: userId, email: userEmail, status: "Pending" });
        await product.save();

        res.status(201).json({ message: "Claim request submitted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.handleClaimRequest = async (req, res) => {
    try {
        const { id, claimId, status } = req.params;
        const adminId = req.user.id;

        if (!["Approved", "Rejected"].includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        const product = await Product.findById(id);
        if (!product) return res.status(404).json({ message: "Item not found" });

        if (product.uploadedBy.toString() !== adminId) {
            return res.status(403).json({ message: "You are not authorized to approve/reject claims" });
        }

        const claim = product.claims.id(claimId);
        if (!claim) return res.status(404).json({ message: "Claim not found" });

        const existingApprovedClaim = product.claims.find(claim => claim.status === "Approved");
        if (existingApprovedClaim && status === "Approved") {
            return res.status(400).json({ message: "Only one claim can be approved per item" });
        }

        claim.status = status;
        if (status === "Approved") {
            product.claimed = true;
        }
        await product.save();

        res.json({ message: `Claim has been ${status.toLowerCase()}` });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

