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
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/hellodigitalcyber";

connectDB();

// View engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(expressLayouts);
app.set("layout", "layout");

// Body parsers & static
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));

// Sessions & flash
app.use(
  session({
    secret: process.env.SESSION_SECRET || "hellodigitalcyber-secret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: MONGO_URI }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 1 day
  })
);
app.use(flash());

// Locals available in every view
app.use(async (req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.isAdmin = !!(req.session && req.session.adminId);
  res.locals.adminName = req.session ? req.session.adminName : null;
  res.locals.currentPath = req.path;
  res.locals.icon = icon;
  res.locals.iconList = iconList;
  if (!res.locals.siteName) {
    try {
      const s = await Setting.findOne({ key: "site" });
      res.locals.siteSettings = s || {};
    } catch (e) {
      res.locals.siteSettings = {};
    }
  }
  next();
});

// Routes
app.use("/admin", (req, res, next) => {
  res.locals.layout = "admin/layout";
  next();
}, adminRoutes);

app.use(chatRouter);
app.use("/", publicRoutes);

// 404
app.use((req, res) => {
  res.status(404).render("404", { title: "Page Not Found", settings: res.locals.siteSettings });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Something went wrong. Please try again later.");
});

app.listen(PORT, () => {
  console.log(`HelloDigitalCyber server running at http://localhost:${PORT}`);
  console.log(`HelloDigitalCyber server running at http://localhost:${PORT}/admin/dashboard`);
  console.log(`HelloDigitalCyber server running at http://localhost:${PORT}/admin/login`);
});