require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const Admin = require("./models/Admin");
const Service = require("./models/Service");
const Setting = require("./models/Setting");

const sampleServices = [
  {
    title: "Professional CV / Resume Writing",
    slug: "cv-resume-writing",
    icon: "file-user",
    category: "Documents",
    shortDescription: "A clean, professional CV designed to get you noticed by employers.",
    fullDescription:
      "We create a professional, well-formatted CV or resume based on your work history, education and skills. Includes one free revision.",
    price: 150,
    priceNote: "starting from",
    duration: "Same day",
    requirements: ["Your basic information (name, contact, address)", "Educational certificates", "Work experience details", "A recent photo"],
    featured: true,
    order: 1,
  },
  {
    title: "NID Correction & Form Fill-up",
    slug: "nid-correction-form",
    icon: "id-card",
    category: "Government",
    shortDescription: "National ID (NID) new application, correction and re-issue form fill-up support.",
    fullDescription:
      "We help you fill up National ID application/correction forms correctly and guide you on required documents, so your application isn't rejected due to simple mistakes.",
    price: 200,
    priceNote: "service charge only, govt fee separate",
    duration: "1-2 working days",
    requirements: ["Birth certificate", "Existing NID copy (if correction)", "Supporting documents for correction (if any)"],
    featured: true,
    order: 2,
  },
  {
    title: "Ward / Union Document Support",
    slug: "ward-union-document",
    icon: "file-check",
    category: "Government",
    shortDescription: "Ward commissioner certificates, citizenship & character certificates, and related paperwork.",
    fullDescription:
      "Assistance preparing and submitting applications for ward commissioner / union parishad certificates such as citizenship certificate, character certificate, and income certificate.",
    price: 100,
    priceNote: "starting from",
    duration: "2-3 working days",
    requirements: ["NID copy", "Holding/tax receipt (if applicable)", "Passport size photo"],
    featured: false,
    order: 3,
  },
  {
    title: "Passport Application Form Fill-up",
    slug: "passport-form-fillup",
    icon: "passport",
    category: "Government",
    shortDescription: "e-Passport / MRP application form fill-up with document checklist guidance.",
    fullDescription:
      "We fill up your e-Passport application form (new or renewal), double-check for common errors, and guide you through the required supporting documents so your appointment goes smoothly.",
    price: 250,
    priceNote: "service charge only, govt fee separate",
    duration: "Same day",
    requirements: ["NID / Birth certificate", "Old passport (for renewal)", "Passport size photo (as per e-passport spec)"],
    featured: true,
    order: 4,
  },
  {
    title: "Birth & Death Registration",
    slug: "birth-death-registration",
    icon: "file-plus",
    category: "Government",
    shortDescription: "Online birth and death registration, correction and certificate download support.",
    price: 120,
    priceNote: "starting from",
    duration: "1-3 working days",
    requirements: ["Hospital/ward certificate", "Parents' NID copies"],
    order: 5,
  },
  {
    title: "Online Form Fill-up (Jobs, Admission, etc.)",
    slug: "online-form-fillup",
    icon: "monitor",
    category: "Digital Services",
    shortDescription: "Job circulars, admission forms, and other online application form fill-up.",
    price: 50,
    priceNote: "per form",
    duration: "Same day",
    requirements: ["Circular/notice details", "Required documents and photo/signature scans"],
    order: 6,
  },
  {
    title: "Photocopy, Scan & Print",
    slug: "photocopy-scan-print",
    icon: "printer",
    category: "Digital Services",
    shortDescription: "Photocopy, scanning, color/black & white printing and lamination.",
    price: 5,
    priceNote: "per page",
    duration: "Instant",
    order: 7,
  },
  {
    title: "Passport Size Photo & Photo Editing",
    slug: "photo-editing",
    icon: "camera",
    category: "Digital Services",
    shortDescription: "Passport/visa size photo printing and background/photo editing for forms.",
    price: 30,
    priceNote: "starting from",
    duration: "Instant",
    order: 8,
  },
];

async function seed() {
  await connectDB();

  const username = (process.env.ADMIN_USERNAME || "admin").toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "Admin@12345";

  let admin = await Admin.findOne({ username });
  if (!admin) {
    admin = await Admin.create({ name: "Site Admin", username, password });
    console.log(`[Seed] Admin created -> username: ${username} / password: ${password}`);
  } else {
    console.log(`[Seed] Admin already exists: ${username}`);
  }

  let settings = await Setting.findOne({ key: "site" });
  if (!settings) {
    settings = await Setting.create({ key: "site" });
    console.log("[Seed] Default site settings created.");
  }

  for (const s of sampleServices) {
    const exists = await Service.findOne({ slug: s.slug });
    if (!exists) {
      await Service.create(s);
      console.log(`[Seed] Service created: ${s.title}`);
    }
  }

  console.log("[Seed] Done.");
  await mongoose.connection.close();
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
