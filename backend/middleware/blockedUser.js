/**
 * Blocked User Middleware
 * Denies all protected actions for blocked users
 * Must be used after authenticate middleware
 */
const checkBlocked = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  if (req.user.isBlocked) {
    return res.status(403).json({
      success: false,
      message: 'Your account has been restricted. Please contact support.',
      isBlocked: true
    });
  }

  next();
};

module.exports = checkBlocked;