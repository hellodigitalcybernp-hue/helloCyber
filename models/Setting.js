const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema(
  {
    key: { type: String, default: "site", unique: true },
    siteName: { type: String, default: "HelloDigitalCyber" },
    tagline: { type: String, default: "Your Trusted Digital Service Point" },
    heroTitle: { type: String, default: "All Your Government & Digital Paperwork, Handled." },
    heroSubtitle: {
      type: String,
      default:
        "CV writing, NID correction, Ward documents, Passport forms and more — done accurately, quickly, and without the hassle of standing in line.",
    },
    aboutText: {
      type: String,
      default:
        "HelloDigitalCyber is a local digital service center helping people complete essential paperwork — from CVs to national ID corrections, ward certificates, and passport applications — with accuracy and care. We handle the confusing forms so you don't have to.",
    },
    phone: { type: String, default: "+880 1XXX-XXXXXX" },
    whatsapp: { type: String, default: "+880 1XXX-XXXXXX" },
    email: { type: String, default: "info@hellodigitalcyber.com" },
    address: { type: String, default: "Shop 4, Main Bazar Road, Your City" },
    openingHours: { type: String, default: "Sat - Thu: 9:00 AM - 8:00 PM" },
    facebook: { type: String, default: "" },
    mapEmbedUrl: { type: String, default: "" },

    // ---------- SEO ----------
    siteUrl: { type: String, default: "" }, // e.g. https://www.hellodigitalcyber.com  (no trailing slash)
    metaDescription: {
      type: String,
      default:
        "HelloDigitalCyber is your trusted digital service center for CV writing, NID form correction, ward/union document support, passport form fill-up and more. Fast, accurate, same-day help.",
    },
    metaKeywords: {
      type: String,
      default:
        "hello digital cyber, hellodigitalcyber, digital service center, cyber cafe services, CV writing service, resume writing, NID correction form, NID form fill up, ward union document, passport form fill up, online form fill up, digital service point",
    },
    ogImage: { type: String, default: "/image/logo.png" },
    googleSiteVerification: { type: String, default: "" }, // Google Search Console HTML tag content value
    bingSiteVerification: { type: String, default: "" },

    // ---------- Google AdSense ----------
    googleAdsenseClientId: { type: String, default: "" }, // e.g. ca-pub-1234567890123456
    googleAdsenseAutoAds: { type: Boolean, default: true }, // let Google place ads automatically
    googleAdsenseSlotInContent: { type: String, default: "" }, // optional manual ad unit slot id

    // ---------- Analytics (optional, helps track SEO/Ads performance) ----------
    googleAnalyticsId: { type: String, default: "" }, // e.g. G-XXXXXXXXXX
  },
  { timestamps: true }
);

module.exports = mongoose.model("Setting", settingSchema);
