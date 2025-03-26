const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        itemStatus: { type: String, enum: ["Lost", "Found"], required: true, },
        category: { type: String, enum: ["Wallet", "Phone", "Keys", "Other"], }, //TODO more
        description: { type: String, required: false, },
        tags: { type: [String], default: [], },
        location: { type: String, required: true, },
        coordinates: { latitude: { type: String, required: true, }, longitude: { type: String, required: true, }, },//TODO 2d sphere indexig
        contactDetails: { type: String, required: true, },
        uploadedImage: { type: String, required: false, },// URL or path to the image

        uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        claims: [
            {
                user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
                email: { type: String, required: true },
                status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
            }
        ],
    },
    {
        timestamps: true, // Adds createdAt and updatedAt
    }
);

module.exports = mongoose.model("Product", productSchema);
