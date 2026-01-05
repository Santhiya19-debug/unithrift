const Product = require('../models/Product');

/**
 * Ownership Check Middleware
 * Validates user owns the product or is admin
 * Must be used after authenticate middleware
 */
const checkOwnership = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const productId = req.params.id;
    
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }

    // Find product
    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if user is owner or admin
    const isOwner = product.isOwnedBy(req.user._id);
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to modify this product'
      });
    }

    // Attach product to request for use in route handler
    req.product = product;
    
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = checkOwnership;