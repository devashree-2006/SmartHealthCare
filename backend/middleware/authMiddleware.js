
const authMiddleware = (req, res, next) => {
  if (!req.session || !req.session.user) {
    return res.status(401).json({
      message: "Please log in first",
    });
  }

  if (req.session.user.role !== "patient") {
    return res.status(403).json({
      message: "Access denied",
    });
  }

  next();
};

module.exports = authMiddleware;
