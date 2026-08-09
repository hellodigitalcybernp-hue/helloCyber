const express = require("express");
const router = express.Router();
const Service = require("../models/Service");
const Message = require("../models/Message");
const Setting = require("../models/Setting");
const Article = require("../models/Article");

// helper to always have settings available
async function getSettings() {
  let settings = await Setting.findOne({ key: "site" });
  if (!settings) settings = await Setting.create({ key: "site" });
  return settings;
}

// Home
router.get("/", async (req, res) => {
  const settings = await getSettings();
  const services = await Service.find({ active: true }).sort({ order: 1, createdAt: -1 }).limit(6);
  const featured = await Service.find({ active: true, featured: true }).sort({ order: 1 }).limit(3);
  res.render("index", {
    title: `${settings.siteName} | ${settings.tagline || "Digital & Document Service Center"}`,
    metaDescription: settings.metaDescription,
    metaKeywords: settings.metaKeywords,
    settings,
    services,
    featured: featured.length ? featured : services.slice(0, 3),
  });
});

// Services listing
router.get("/services", async (req, res) => {
  const settings = await getSettings();
  const category = req.query.category || "";
  const filter = { active: true };
  if (category) filter.category = category;
  const services = await Service.find(filter).sort({ order: 1, createdAt: -1 });
  const categories = await Service.distinct("category", { active: true });
  const metaDescription = category
    ? `${category} services at ${settings.siteName} — browse pricing, requirements and request the service online.`
    : `Full list of services at ${settings.siteName}: CV writing, NID form correction, ward/union document support, passport form fill-up and more. ${settings.metaDescription || ""}`;
  res.render("services", {
    title: (category ? category + " Services" : "Our Services") + " - " + settings.siteName,
    metaDescription,
    metaKeywords: settings.metaKeywords,
    settings,
    services,
    categories,
    activeCategory: category,
  });
});

// Service detail + apply form
router.get("/services/:slug", async (req, res) => {
  const settings = await getSettings();
  const service = await Service.findOne({ slug: req.params.slug, active: true });
  if (!service) {
    return res.status(404).render("404", { title: "Not found", settings });
  }
  const related = await Service.find({
    active: true,
    category: service.category,
    _id: { $ne: service._id },
  }).limit(3);
  res.render("service-detail", {
    title: service.title + " - " + settings.siteName,
    metaDescription: (service.shortDescription || settings.metaDescription || "").slice(0, 160),
    metaKeywords: `${service.title}, ${service.category}, ${settings.metaKeywords || ""}`,
    ogImage: service.image || settings.ogImage,
    settings,
    service,
    related,
  });
});

router.post("/services/:slug/apply", async (req, res) => {
  const service = await Service.findOne({ slug: req.params.slug });
  const { name, phone, email, note } = req.body;
  await Message.create({
    name,
    phone,
    email,
    note,
    service: service ? service.title : "General Inquiry",
    serviceId: service ? service._id : undefined,
  });
  req.flash("success", "Your request has been received! We will contact you shortly.");
  res.redirect(service ? "/services/" + service.slug : "/services");
});

// ---------- Blog: listing (search + category filter + pagination) ----------
router.get("/blog", async (req, res) => {
  const settings = await getSettings();
  const category = req.query.category || "";
  const q = (req.query.q || "").trim();
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const perPage = 9;

  const filter = { published: true };
  if (category) filter.category = category;
  if (q) filter.$text = { $search: q };

  const [articles, total, categories] = await Promise.all([
    Article.find(filter)
      .sort(q ? { score: { $meta: "textScore" } } : { publishedAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage),
    Article.countDocuments(filter),
    Article.distinct("category", { published: true }),
  ]);

  const totalPages = Math.max(Math.ceil(total / perPage), 1);
  const metaDescription = category
    ? `${category} guides and articles from ${settings.siteName} — step-by-step help with Nepal government forms and documents.`
    : `Step-by-step guides for Nepal passport forms, NID correction, citizenship, driving licence and other government paperwork, from ${settings.siteName}.`;

  res.render("blog", {
    title: (category ? category + " Articles" : "Blog & Guides") + " - " + settings.siteName,
    metaDescription,
    metaKeywords: settings.metaKeywords,
    settings,
    articles,
    categories,
    activeCategory: category,
    q,
    page,
    totalPages,
  });
});



// ---------- Blog: article detail ----------
router.get("/blog/:slug", async (req, res) => {
  const settings = await getSettings();
  const article = await Article.findOne({ slug: req.params.slug, published: true }).populate("relatedService");
  if (!article) {
    return res.status(404).render("404", { title: "Not found", settings });
  }

  Article.updateOne({ _id: article._id }, { $inc: { views: 1 } }).catch(() => {});

  const related = await Article.find({
    published: true,
    category: article.category,
    _id: { $ne: article._id },
  })
    .sort({ publishedAt: -1 })
    .limit(3);

  res.render("blog-detail", {
    title: (article.metaTitle || article.title) + " - " + settings.siteName,
    metaDescription: (article.metaDescription || article.excerpt || settings.metaDescription || "").slice(0, 160),
    metaKeywords: `${(article.tags || []).join(", ")}, ${settings.metaKeywords || ""}`,
    ogImage: article.coverImage || settings.ogImage,
    settings,
    article,
    related,
  });
});


// About
router.get("/about", async (req, res) => {
  const settings = await getSettings();
  res.render("about", {
    title: "About Us - " + settings.siteName,
    metaDescription: settings.aboutText ? settings.aboutText.slice(0, 160) : settings.metaDescription,
    metaKeywords: settings.metaKeywords,
    settings,
  });
});

// Contact
router.get("/contact", async (req, res) => {
  const settings = await getSettings();
  res.render("contact", {
    title: "Contact Us - " + settings.siteName,
    metaDescription: `Contact ${settings.siteName} — ${settings.address || ""}. Call, WhatsApp, or send a message and we'll respond quickly.`,
    metaKeywords: settings.metaKeywords,
    settings,
  });
});

router.post("/contact", async (req, res) => {
  const { name, phone, email, note } = req.body;
  await Message.create({ name, phone, email, note, service: "General Inquiry" });
  req.flash("success", "Thanks for reaching out! We'll get back to you soon.");
  res.redirect("/contact");
});

// Privacy Policy (required by Google AdSense for site approval)
router.get("/privacy-policy", async (req, res) => {
  const settings = await getSettings();
  res.render("privacy", {
    title: "Privacy Policy - " + settings.siteName,
    metaDescription: `Privacy Policy for ${settings.siteName} — how we collect, use and protect your information.`,
    metaKeywords: settings.metaKeywords,
    settings,
  });
});

// ---------- SEO: robots.txt ----------
router.get("/robots.txt", async (req, res) => {
  const settings = await getSettings();
  const base = (settings.siteUrl || `${req.protocol}://${req.get("host")}`).replace(/\/$/, "");
  res.type("text/plain").send(
    [
      "User-agent: *",
      "Allow: /",
      "Disallow: /admin",
      "",
      `Sitemap: ${base}/sitemap.xml`,
    ].join("\n")
  );
});

// ---------- SEO: dynamic sitemap.xml (auto-includes every active service) ----------
router.get("/sitemap.xml", async (req, res) => {
  const settings = await getSettings();
  const base = (settings.siteUrl || `${req.protocol}://${req.get("host")}`).replace(/\/$/, "");
  const services = await Service.find({ active: true }).select("slug updatedAt");
  const articles = await Article.find({ published: true }).select("slug updatedAt");

  const staticUrls = [
    { loc: "/", priority: "1.0" },
    { loc: "/services", priority: "0.9" },
    { loc: "/blog", priority: "0.8" },
    { loc: "/about", priority: "0.6" },
    { loc: "/contact", priority: "0.6" },
  ];

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  staticUrls.forEach((u) => {
    xml += `  <url><loc>${base}${u.loc}</loc><priority>${u.priority}</priority></url>\n`;
  });
  services.forEach((s) => {
    const lastmod = s.updatedAt ? new Date(s.updatedAt).toISOString().split("T")[0] : "";
    xml += `  <url><loc>${base}/services/${s.slug}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}<priority>0.8</priority></url>\n`;
  });
  articles.forEach((a) => {
    const lastmod = a.updatedAt ? new Date(a.updatedAt).toISOString().split("T")[0] : "";
    xml += `  <url><loc>${base}/blog/${a.slug}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}<priority>0.6</priority></url>\n`;
  });
  xml += "</urlset>";

  res.type("application/xml").send(xml);
});

// ---------- Google AdSense: ads.txt (auto-generated from the Client ID saved in Admin > Settings) ----------
router.get("/ads.txt", async (req, res) => {
  const settings = await getSettings();
  if (!settings.googleAdsenseClientId) {
    return res.type("text/plain").send("# Add your Google AdSense Publisher ID in Admin > Settings to activate ads.txt");
  }
  const pubId = settings.googleAdsenseClientId.replace("ca-", "");
  res.type("text/plain").send(`google.com, ${pubId}, DIRECT, f08c47fec0942fa0`);
});


module.exports = router;
