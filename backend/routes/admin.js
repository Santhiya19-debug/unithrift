const express = require('express');
const router = express.Router();

const Product = require('../models/Product');
const User = require('../models/user');
const authenticate = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

/**
 * ===============================
 * PRODUCTS – MODERATION
 * ===============================
 */

/**
 * GET /api/admin/products
 * Get all products (active + removed)
 */
router.get(
  '/products',
  authenticate,
  roleCheck('admin'),
  async (req, res, next) => {
    try {
      const products = await Product.find()
        .populate('sellerId', 'name email')
        .sort({ createdAt: -1 });

      res.json({
        success: true,
        products
      });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * PATCH /api/admin/products/:id/remove
 * Soft remove product
 */
router.patch(
  '/products/:id/remove',
  authenticate,
  roleCheck('admin'),
  async (req, res, next) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }

      product.status = 'removed';
      await product.save();

      res.json({ success: true, message: 'Product removed' });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * PATCH /api/admin/products/:id/restore
 * Restore removed product
 */
router.patch(
  '/products/:id/restore',
  authenticate,
  roleCheck('admin'),
  async (req, res, next) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }

      product.status = 'active';
      await product.save();

      res.json({ success: true, message: 'Product restored' });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * ===============================
 * USERS – ADMIN CONTROL
 * ===============================
 */

/**
 * GET /api/admin/users
 * Get all users
 */
router.get(
  '/users',
  authenticate,
  roleCheck('admin'),
  async (req, res, next) => {
    try {
      const users = await User.find().select('-password');
      res.json({ success: true, users });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * PATCH /api/admin/users/:id/block
 * Block a user
 */
router.patch(
  '/users/:id/block',
  authenticate,
  roleCheck('admin'),
  async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      user.isBlocked = true;
      await user.save();

      res.json({ success: true, message: 'User blocked' });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;

router.get('/stats', authenticate, roleCheck('admin'), async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({});
    const blockedUsers = await User.countDocuments({ isBlocked: true });

    const activeListings = await Product.countDocuments({
      status: { $in: ['active', 'ACTIVE'] }
    });

    const removedListings = await Product.countDocuments({
      status: { $in: ['removed', 'REMOVED', 'hidden'] }
    });

    res.json({
      success: true,
      stats: {
        totalUsers,
        blockedUsers,
        activeListings,
        removedListings
      }
    });
  } catch (err) {
    next(err);
  }
});
