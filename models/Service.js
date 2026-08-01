const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    icon: { type: String, default: "file-text" }, // lucide-style icon keyword used on the frontend
    shortDescription: { type: String, required: true, trim: true },
    fullDescription: { type: String, default: "" },
    price: { type: Number, default: 0 },
    priceNote: { type: String, default: "" }, // e.g. "starting from" / "govt fee separate"
    duration: { type: String, default: "" }, // e.g. "1-2 working days"
    requirements: [{ type: String }], // list of documents/info needed from customer
    image: { type: String, default: "" }, // uploaded image path
    category: { type: String, default: "General" },
    featured: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Service", serviceSchema);
