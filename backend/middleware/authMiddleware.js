const requireRole = (...roles) => (req, res, next) => {
  const user = req.session?.user;
  if (!user) return res.status(401).json({ message: "Please log in first." });
  if (roles.length && !roles.includes(user.role)) {
    return res.status(403).json({ message: "Access denied." });
  }
  next();
};

module.exports = requireRole;
