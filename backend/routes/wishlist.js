const express = require('express');
const router = express.Router();
const User = require('../models/user');
const authenticate = require('../middleware/auth');

/**
 * @route   POST /api/wishlist/toggle/:productId
 * @desc    Add or Remove item from wishlist
 */
router.post('/toggle/:productId', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const productId = req.params.productId;

    const isWishlisted = user.wishlist.includes(productId);

    if (isWishlisted) {
      // Remove item
      user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
    } else {
      // Add item
      user.wishlist.push(productId);
    }

    await user.save();
    res.json({ success: true, isWishlisted: !isWishlisted, wishlist: user.wishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route   GET /api/wishlist
 * @desc    Get all wishlisted products for the logged-in user
 */
router.get('/', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');
    res.json({ success: true, wishlist: user.wishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;