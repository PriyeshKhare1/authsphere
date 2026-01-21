// Admin only middleware
export const admin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admin only." });
  }
  next();
};

// Manager or Admin middleware
export const managerOrAdmin = (req, res, next) => {
  if (req.user.role !== "admin" && req.user.role !== "manager") {
    return res.status(403).json({ message: "Access denied. Manager or Admin only." });
  }
  next();
};
