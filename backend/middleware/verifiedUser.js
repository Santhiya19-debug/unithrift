/**
 * Verified User Middleware
 * Requires user to be verified for product creation/updates
 * Must be used after authenticate middleware
 */
const requireVerified = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  if (!req.user.isVerified) {
    return res.status(403).json({
      success: false,
      message: 'Email verification required. Please verify your email to create listings.',
      isVerified: false
    });
  }

  next();
};

module.exports = requireVerified;