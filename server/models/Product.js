const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        itemStatus: {
            type: String,
            enum: ["Lost", "Found"],
            required: true,
        },
        category: {
            type: String,
            enum: ["Wallet", "Phone", "Keys", "Other"], //TODO more
            required: true,
        },
        description: {
            type: String,
            required: false,
        },
        tags: {
            type: [String],
            default: [],
        },
        location: {
            type: String,
            required: true,
        },
        coordinates: { //TODO 2d sphere indexig
            latitude: {
                type: String,
                required: true,
            },
            longitude: {
                type: String,
                required: true,
            },
        },
        contactDetails: {
            type: String,
            required: true,
        },
        uploadedImage: {
            type: String, // URL or path to the image
            required: false,
        },
    },
    {
        timestamps: true, // Adds createdAt and updatedAt
    }
);

module.exports = mongoose.model("Product", productSchema);
