function requireAdmin(req, res, next) {
  if (req.session && req.session.adminId) {
    return next();
  }
  req.flash("error", "Please log in to continue.");
  return res.redirect("/admin/login");
}

function redirectIfLoggedIn(req, res, next) {
  if (req.session && req.session.adminId) {
    return res.redirect("/admin/dashboard");
  }
  next();
}

module.exports = { requireAdmin, redirectIfLoggedIn };
