const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
{
    title: {
        type: String,
        required: true
    },

    slug: {
        type: String,
        required: true,
        unique: true
    },

    category: {
        type: String,
        default: "General"
    },

    image: {
        type: String,
        default: "/images/blog/default.jpg"
    },

    shortDescription: {
        type: String,
        required: true
    },

    content: {
        type: String,
        required: true
    },

    readTime: {
        type: String,
        default: "5 min read"
    },

    author: {
        type: String,
        default: "Admin"
    },

    isPublished: {
        type: Boolean,
        default: true
    }

},
{
    timestamps: true
});

module.exports = mongoose.model("Blog", blogSchema);