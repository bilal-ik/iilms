/**
 * requireRole — role-based access control factory.
 * Returns middleware that allows the request to proceed only if
 * req.user.role is included in the provided roles list.
 *
 * @param {...string} roles - Permitted role values (e.g. 'admin', 'student', 'company')
 * @returns {Function} Express middleware
 */
function requireRole(...roles) {
  return function (req, res, next) {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }
    next();
  };
}

module.exports = { requireRole };
