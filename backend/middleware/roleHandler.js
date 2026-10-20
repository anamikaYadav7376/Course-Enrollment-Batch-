// Middleware generator to restrict endpoint access to specific roles (e.g. 'admin' or 'student')
const allowRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({
        success: false,
        message: "Authentication required."
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden. You do not have permission to access this resource (${allowedRoles.join(" or ")} role required).`
      });
    }

    next();
  };
};

module.exports = allowRoles;
