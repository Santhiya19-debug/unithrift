const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const User = require('../models/user');
const authenticate = require('../middleware/auth');
const checkBlocked = require('../middleware/blockedUser');
const requireVerified = require('../middleware/verifiedUser');
const checkOwnership = require('../middleware/ownershipCheck');
const upload = require('../middleware/upload'); // Import the new Cloudinary/Multer middleware

// ==========================================
// READ ROUTES (Order is critical!)
// ==========================================

/**
 * @route   GET /api/products/my
 * @desc    Get listings belonging to the authenticated user
 */
router.get('/my', authenticate, async (req, res, next) => {
  try {
    const products = await Product.find({ 
      sellerId: req.user._id,
      status: { $ne: 'removed' } 
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      products: products.map(p => ({
        id: p._id,
        title: p.title,
        description: p.description,
        price: p.price,
        isFree: p.isFree,
        category: p.category,
        condition: p.condition,
        location: p.location,
        images: p.images,
        status: p.status,
        createdAt: p.createdAt,
        seller: {
          id: req.user._id,
          name: req.user.name,
          isVerified: req.user.isVerified
        }
      }))
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/products
 * @desc    Marketplace Feed
 */
router.get('/', async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const blockedUsers = await User.find({ isBlocked: true }).select('_id');
    const blockedIds = blockedUsers.map(u => u._id);

    const query = {
      status: 'active',
      sellerId: { $nin: blockedIds }
    };

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('sellerId', 'name isVerified');

    res.json({
      success: true,
      products: products.map(p => ({
        id: p._id,
        title: p.title,
        description: p.description,
        price: p.price,
        isFree: p.isFree,
        category: p.category,
        condition: p.condition,
        location: p.location,
        images: p.images,
        status: p.status,
        seller: {
          id: p.sellerId?._id,
          name: p.sellerId?.name,
          isVerified: p.sellerId?.isVerified
        },
        createdAt: p.createdAt
      })),
      pagination: { total, page, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/products/:id
 */
router.get('/:id', async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('sellerId', 'name isVerified email');
    if (!product || product.status === 'removed') {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({
  success: true,
  product: {
    id: product._id,
    title: product.title,
    description: product.description,
    price: product.price,
    isFree: product.isFree,
    category: product.category,
    condition: product.condition,
    location: product.location,
    images: product.images,
    status: product.status,
    createdAt: product.createdAt,
    seller: {
      id: product.sellerId?._id,
      name: product.sellerId?.name,
      email: product.sellerId?.email,
      isVerified: product.sellerId?.isVerified
    }
  }
});

  } catch (error) {
    next(error);
  }
});

// ==========================================
// WRITE ROUTES
// ==========================================

/**
 * @route   POST /api/products
 * @desc    Create a new listing with Cloudinary Upload
 */
router.post('/', authenticate, checkBlocked, requireVerified, upload.array('images', 5), async (req, res, next) => {
  try {
    // Extract data from req.body (parsed by multer)
    const { title, name, description, price, isFree, category, condition, location } = req.body;

    const finalTitle = title || name;

    if (!finalTitle || !description || !category || !condition || !location) {
      return res.status(400).json({ success: false, message: 'All core fields are required' });
    }

    // Extract Cloudinary URLs from req.files
    const imageUrls = req.files ? req.files.map(file => file.path) : [];

    if (imageUrls.length === 0) {
      return res.status(400).json({ success: false, message: 'At least one image is required' });
    }

    const product = new Product({
      title: finalTitle.trim(),
      description: description.trim(),
      price: String(isFree) === 'true' ? 0 : Number(price),
      isFree: String(isFree) === 'true',
      category,
      condition,
      location: location.trim(),
      images: imageUrls, // Store Cloudinary URLs
      sellerId: req.user._id,
      status: 'active'
    });

    const savedProduct = await product.save();
    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product: { id: savedProduct._id, title: savedProduct.title, images: savedProduct.images }
    });
  } catch (error) {
    console.error('BACKEND PRODUCT POST ERROR:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

/**
/**
 * @route   PUT /api/products/:id
 * @desc    Update listing (supports keeping old images + adding new ones)
 * @access  Private (Owner only)
 */
router.put('/:id', authenticate, checkBlocked, requireVerified, checkOwnership, upload.array('images', 5), async (req, res, next) => {
  try {
    const product = req.product; // From checkOwnership middleware
    const { title, description, price, isFree, category, condition, location, existingImages } = req.body;

    // 1. Basic Field Updates
    if (title !== undefined) product.title = title.trim();
    if (description !== undefined) product.description = description.trim();
    if (category !== undefined) product.category = category;
    if (condition !== undefined) product.condition = condition;
    if (location !== undefined) product.location = location.trim();

    // 2. Advanced Image Merging Logic
    let finalImages = [];

    // Parse existing images (the ones the user chose to keep)
    if (existingImages) {
      try {
        // existingImages comes as a JSON string from FormData
        finalImages = JSON.parse(existingImages);
      } catch (e) {
        // Fallback if parsing fails
        finalImages = product.images; 
      }
    } else {
      // If the field is missing entirely, we assume they kept all current images
      finalImages = product.images;
    }

    // Add newly uploaded images from Cloudinary (req.files)
    if (req.files && req.files.length > 0) {
      const newImageUrls = req.files.map(file => file.path);
      finalImages = [...finalImages, ...newImageUrls];
    }

    // Final safety: enforce the 5-image limit and update product
    product.images = finalImages.slice(0, 5);

    // 3. Price and Free Status Handling
    if (isFree !== undefined) {
      product.isFree = String(isFree) === 'true';
      if (product.isFree) product.price = 0;
    }

    if (price !== undefined && !product.isFree) {
      const numPrice = Number(price);
      if (numPrice < 0) return res.status(400).json({ success: false, message: 'Invalid price' });
      product.price = numPrice;
    }

    await product.save();
    
    res.json({ 
      success: true, 
      message: 'Product updated successfully', 
      product: {
        id: product._id,
        title: product.title,
        images: product.images
      } 
    });
  } catch (error) {
    console.error('UPDATE PRODUCT ERROR:', error);
    next(error);
  }
});

/**
 * @route   DELETE /api/products/:id
 */
router.delete('/:id', authenticate, checkBlocked, checkOwnership, async (req, res, next) => {
  try {
    req.product.status = 'removed';
    await req.product.save();
    res.json({ success: true, message: 'Product removed' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;