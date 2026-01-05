/**
 * Middleware to restrict access to Admins only
 * Must be placed AFTER the 'authenticate' middleware
 */
const requireAdmin = (req, res, next) => {
  // 1. Check if user exists (populated by authenticate middleware)
  if (!req.user) {
    return res.status(401).json({ 
      success: false, 
      message: 'Authentication required' 
    });
  }

  // 2. Check if the role is 'admin'
  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      success: false, 
      message: 'Access denied. Professional Admin privileges required.' 
    });
  }

  // 3. User is admin, proceed to the next function
  next();
};

module.exports = requireAdmin;