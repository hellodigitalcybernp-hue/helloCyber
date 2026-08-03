const express = require("express");
const router = express.Router();
const Admin = require("../models/Admin");
const Service = require("../models/Service");
const Message = require("../models/Message");
const Setting = require("../models/Setting");
const ChatConversation = require("../models/ChatConversation");
const ChatMessage = require("../models/ChatMessage");
const upload = require("../middleware/upload");
const { requireAdmin, redirectIfLoggedIn } = require("../middleware/auth");

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function getSettings() {
  let settings = await Setting.findOne({ key: "site" });
  if (!settings) settings = await Setting.create({ key: "site" });
  return settings;
}

/* ---------- AUTH ---------- */

router.get("/login", redirectIfLoggedIn, (req, res) => {
  res.render("admin/login", { title: "Admin Login", layout: false });
});

router.post("/login", redirectIfLoggedIn, async (req, res) => {
  const { username, password } = req.body;
  const admin = await Admin.findOne({ username: (username || "").toLowerCase().trim() });
  if (!admin || !(await admin.comparePassword(password))) {
    req.flash("error", "Invalid username or password.");
    return res.redirect("/admin/login");
  }
  req.session.adminId = admin._id;
  req.session.adminName = admin.name;
  res.redirect("/admin/dashboard");
});

router.post("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/admin/login"));
});

/* ---------- DASHBOARD ---------- */

router.get("/dashboard", requireAdmin, async (req, res) => {
  const [totalServices, activeServices, totalMessages, newMessages] = await Promise.all([
    Service.countDocuments(),
    Service.countDocuments({ active: true }),
    Message.countDocuments(),
    Message.countDocuments({ status: "new" }),
  ]);
  const recentMessages = await Message.find().sort({ createdAt: -1 }).limit(5);
  const recentServices = await Service.find().sort({ createdAt: -1 }).limit(5);
  res.render("admin/dashboard", {
    title: "Dashboard",
    stats: { totalServices, activeServices, totalMessages, newMessages },
    recentMessages,
    recentServices,
  });
});

/* ---------- SERVICES CRUD ---------- */

router.get("/services", requireAdmin, async (req, res) => {
  const services = await Service.find().sort({ order: 1, createdAt: -1 });
  res.render("admin/services", { title: "Manage Services", services });
});

router.get("/services/new", requireAdmin, (req, res) => {
  res.render("admin/service-form", { title: "Add Service", service: null });
});

router.post("/services", requireAdmin, upload.single("image"), async (req, res) => {
  try {
    const { title, icon, shortDescription, fullDescription, price, priceNote, duration, category, order } =
      req.body;
    const requirements = (req.body.requirements || "")
      .split("\n")
      .map((r) => r.trim())
      .filter(Boolean);
    let slug = slugify(title);
    const exists = await Service.findOne({ slug });
    if (exists) slug = slug + "-" + Date.now().toString().slice(-5);

    await Service.create({
      title,
      slug,
      icon: icon || "file-text",
      shortDescription,
      fullDescription,
      price: Number(price) || 0,
      priceNote,
      duration,
      requirements,
      category: category || "General",
      order: Number(order) || 0,
      featured: req.body.featured === "on",
      active: req.body.active === "on",
      image: req.file ? "/uploads/services/" + req.file.filename : "",
    });
    req.flash("success", "Service added successfully.");
    res.redirect("/admin/services");
  } catch (err) {
    req.flash("error", "Could not add service: " + err.message);
    res.redirect("/admin/services/new");
  }
});

router.get("/services/:id/edit", requireAdmin, async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) {
    req.flash("error", "Service not found.");
    return res.redirect("/admin/services");
  }
  res.render("admin/service-form", { title: "Edit Service", service });
});

router.put("/services/:id", requireAdmin, upload.single("image"), async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      req.flash("error", "Service not found.");
      return res.redirect("/admin/services");
    }
    const { title, icon, shortDescription, fullDescription, price, priceNote, duration, category, order } =
      req.body;
    const requirements = (req.body.requirements || "")
      .split("\n")
      .map((r) => r.trim())
      .filter(Boolean);

    if (title && title !== service.title) {
      let newSlug = slugify(title);
      const exists = await Service.findOne({ slug: newSlug, _id: { $ne: service._id } });
      if (exists) newSlug = newSlug + "-" + Date.now().toString().slice(-5);
      service.slug = newSlug;
    }

    service.title = title;
    service.icon = icon || "file-text";
    service.shortDescription = shortDescription;
    service.fullDescription = fullDescription;
    service.price = Number(price) || 0;
    service.priceNote = priceNote;
    service.duration = duration;
    service.requirements = requirements;
    service.category = category || "General";
    service.order = Number(order) || 0;
    service.featured = req.body.featured === "on";
    service.active = req.body.active === "on";
    if (req.file) service.image = "/uploads/services/" + req.file.filename;

    await service.save();
    req.flash("success", "Service updated successfully.");
    res.redirect("/admin/services");
  } catch (err) {
    req.flash("error", "Could not update service: " + err.message);
    res.redirect("/admin/services");
  }
});

router.delete("/services/:id", requireAdmin, async (req, res) => {
  await Service.findByIdAndDelete(req.params.id);
  req.flash("success", "Service deleted.");
  res.redirect("/admin/services");
});

/* ---------- MESSAGES / APPLICATIONS ---------- */

router.get("/messages", requireAdmin, async (req, res) => {
  const messages = await Message.find().sort({ createdAt: -1 });
  res.render("admin/messages", { title: "Requests & Messages", messages });
});

router.put("/messages/:id/status", requireAdmin, async (req, res) => {
  await Message.findByIdAndUpdate(req.params.id, { status: req.body.status });
  req.flash("success", "Status updated.");
  res.redirect("/admin/messages");
});

router.delete("/messages/:id", requireAdmin, async (req, res) => {
  await Message.findByIdAndDelete(req.params.id);
  req.flash("success", "Message deleted.");
  res.redirect("/admin/messages");
});

/* ---------- LIVE CHAT ---------- */

// Inbox page: list of conversations + panel for the selected one
router.get("/chat", requireAdmin, async (req, res) => {
  const conversations = await ChatConversation.find().sort({ lastMessageAt: -1 });
  res.render("admin/chat", {
    title: "Live Chat",
    conversations,
    activeConversationId: req.query.id || (conversations[0] ? conversations[0]._id : null),
  });
});

// Polled by the sidebar to catch new/updated conversations
router.get("/chat/list", requireAdmin, async (req, res) => {
  const conversations = await ChatConversation.find().sort({ lastMessageAt: -1 });
  res.json({ ok: true, conversations });
});

// Load messages for a conversation
router.get("/chat/:conversationId/messages", requireAdmin, async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { after } = req.query;

    const conversation = await ChatConversation.findById(conversationId);
    if (!conversation) return res.status(404).json({ ok: false, error: "Conversation not found" });

    const query = { conversation: conversation._id };
    if (after) query.createdAt = { $gt: new Date(after) };

    const messages = await ChatMessage.find(query).sort({ createdAt: 1 });

    conversation.unreadByAdmin = false;
    await conversation.save();

    res.json({ ok: true, messages, conversation });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "Could not load messages" });
  }
});

// Admin sends a reply
router.post("/chat/:conversationId/message", requireAdmin, async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ ok: false, error: "Message is empty" });
    }

    const conversation = await ChatConversation.findById(conversationId);
    if (!conversation) return res.status(404).json({ ok: false, error: "Conversation not found" });

    const message = await ChatMessage.create({
      conversation: conversation._id,
      sender: "admin",
      text: text.trim(),
    });

    conversation.lastMessageAt = new Date();
    conversation.unreadByVisitor = true;
    await conversation.save();

    res.json({ ok: true, message });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "Could not send message" });
  }
});

// Mark a conversation as closed
router.post("/chat/:conversationId/close", requireAdmin, async (req, res) => {
  const conversation = await ChatConversation.findById(req.params.conversationId);
  if (conversation) {
    conversation.status = "closed";
    await conversation.save();
  }
  res.json({ ok: true });
});

/* ---------- SITE SETTINGS ---------- */

router.get("/settings", requireAdmin, async (req, res) => {
  const settings = await getSettings();
  res.render("admin/settings", { title: "Site Settings", settings });
});

router.put("/settings", requireAdmin, async (req, res) => {
  const settings = await getSettings();
  Object.assign(settings, req.body);
  await settings.save();
  req.flash("success", "Settings updated successfully.");
  res.redirect("/admin/settings");
});

/* ---------- ADMIN PASSWORD ---------- */

router.get("/account", requireAdmin, async (req, res) => {
  const admin = await Admin.findById(req.session.adminId);
  res.render("admin/account", { title: "My Account", admin });
});

router.put("/account", requireAdmin, async (req, res) => {
  const admin = await Admin.findById(req.session.adminId);
  const { name, username, newPassword } = req.body;
  admin.name = name;
  admin.username = username.toLowerCase().trim();
  if (newPassword && newPassword.trim()) {
    admin.password = newPassword;
  }
  await admin.save();
  req.session.adminName = admin.name;
  req.flash("success", "Account updated successfully.");
  res.redirect("/admin/account");
});

module.exports = router;