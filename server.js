require("dotenv").config();

const express = require("express");
const path = require("path");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const methodOverride = require("method-override");
const expressLayouts = require("express-ejs-layouts");

const chatRouter = require("./routes/chat");
const connectDB = require("./config/db");
const Setting = require("./models/Setting");

const publicRoutes = require("./routes/public");
const adminRoutes = require("./routes/admin");
const { icon, iconList } = require("./utils/icons");

const app = express();

const PORT = process.env.PORT || 3000;
const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb://127.0.0.1:27017/hellodigitalcyber";

// =======================
// View Engine
// =======================
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(expressLayouts);
app.set("layout", "layout");

// =======================
// Middleware
// =======================
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));

// =======================
// Session
// =======================
app.use(
  session({
    secret: process.env.SESSION_SECRET || "hellodigitalcyber-secret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: MONGO_URI,
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.use(flash());

// =======================
// Global View Data
// =======================
app.use(async (req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.isAdmin = !!req.session?.adminId;
  res.locals.adminName = req.session?.adminName || null;
  res.locals.currentPath = req.path;
  res.locals.icon = icon;
  res.locals.iconList = iconList;

  try {
    const setting = await Setting.findOne({ key: "site" });

    res.locals.siteSettings = setting || {};
  } catch (err) {
    console.error("Setting Error:", err.message);
    res.locals.siteSettings = {};
  }

  next();
});

// ─── Icon helper for EJS ───
app.locals.icon = function(name) {
  const icons = {
    trash: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M8 6V4a1 1 0 011-1h6a1 1 0 011 1v2M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z"/></svg>',
    plus: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>',
    check: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>'
  };
  return icons[name] || '';
};

// =======================
// Routes
// =======================
app.use(
  "/admin",
  (req, res, next) => {
    res.locals.layout = "admin/layout";
    next();
  },
  adminRoutes
);

app.use(chatRouter);
app.use("/", publicRoutes);

// =======================
// 404
// =======================
app.use((req, res) => {
  res.status(404).render("404", {
    title: "Page Not Found",
    settings: res.locals.siteSettings,
  });
});

// =======================
// Error Handler
// =======================
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Something went wrong.");
});

// =======================
// Start Server
// =======================
async function startServer() {
  try {
    console.log("Connecting to MongoDB...");

    await connectDB();

    console.log("MongoDB Connected Successfully");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌐 Local: http://localhost:${PORT}`);
      console.log(`👤 Admin: http://localhost:${PORT}/admin/login`);
    });
  } catch (err) {
    console.error("Server startup failed:");
    console.error(err);
    process.exit(1);
  }
}

startServer();