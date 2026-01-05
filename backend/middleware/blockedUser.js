const User = require('../models/user');

/**
 * Airtight Blocked User Middleware
 * Checks the LIVE database status to ensure immediate enforcement
 */
const checkBlocked = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    // Fetch the most recent status from the database
    const user = await User.findById(req.user._id).select('isBlocked');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Immediate enforcement
    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been restricted. Please contact support.',
        isBlocked: true
      });
    }

    next();
  } catch (error) {
    console.error('CheckBlocked Middleware Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = checkBlocked;