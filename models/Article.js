const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    excerpt: { type: String, required: true, trim: true }, // short summary for cards + meta description fallback
    content: { type: String, required: true, default: "" }, // HTML body (rendered unescaped)
    coverImage: { type: String, default: "" }, // uploaded image path
    category: { type: String, default: "Guides" }, // e.g. Passport, NID, Citizenship, Driving License
    tags: [{ type: String }], // free-form keyword tags, also used for meta keywords
    author: { type: String, default: "HelloDigitalCyber Team" },
    metaTitle: { type: String, default: "" }, // optional SEO title override
    metaDescription: { type: String, default: "" }, // optional SEO description override
    faqs: [
      {
        question: { type: String, trim: true },
        answer: { type: String, trim: true },
      },
    ],
    requirements: [{ type: String }], // required documents checklist (e.g. "Citizenship certificate")
    documentPhotos: [{ type: String }], // sample/reference document photos (uploaded paths)
    relatedService: { type: mongoose.Schema.Types.ObjectId, ref: "Service" }, // optional link to a service page
    published: { type: Boolean, default: true },
    publishedAt: { type: Date, default: Date.now },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

articleSchema.index({ title: "text", excerpt: "text", tags: "text" });

module.exports = mongoose.model("Article", articleSchema);
