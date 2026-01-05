const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Product title is required'],
    trim: true,
    minlength: [3, 'Title must be at least 3 characters'],
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    trim: true,
    minlength: [10, 'Description must be at least 10 characters'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  price: {
    type: Number,
    min: [0, 'Price cannot be negative'],
    required: function() {
      return !this.isFree;
    }
  },
  isFree: {
    type: Boolean,
    default: false
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'Furniture',
      'Electronics',
      'Books & Study Material',
      'Kitchen Items',
      'Hostel Essentials',
      'Free Items'
    ]
  },
  condition: {
    type: String,
    required: [true, 'Condition is required'],
    enum: ['new', 'like-new', 'used']
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  images: {
    type: [String],
    default: [],
    validate: {
      validator: function(arr) {
        return arr.length <= 5;
      },
      message: 'Cannot upload more than 5 images'
    }
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  status: {
    type: String,
    enum: ['active', 'removed', 'under_review', 'sold'],
    default: 'active',
    index: true
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
productSchema.index({ status: 1, createdAt: -1 });
productSchema.index({ sellerId: 1, status: 1 });

// Validate price and isFree consistency
productSchema.pre('save', function(next) {
  if (this.isFree && this.price && this.price > 0) {
    this.price = 0;
  }
  
  if (!this.isFree && (!this.price || this.price === 0)) {
    return next(new Error('Price is required for paid items'));
  }
  
  next();
});

// Method to check if user is owner
productSchema.methods.isOwnedBy = function(userId) {
  return this.sellerId.toString() === userId.toString();
};

// Method to check if product is visible to user
productSchema.methods.isVisibleTo = function(user) {
  // Active products are visible to everyone
  if (this.status === 'active') {
    return true;
  }
  
  // Sold products are visible to everyone (read-only)
  if (this.status === 'sold') {
    return true;
  }
  
  // Removed/under_review only visible to owner or admin
  if (this.status === 'removed' || this.status === 'under_review') {
    if (!user) return false;
    
    // Check if user is owner
    if (this.isOwnedBy(user._id || user.id)) {
      return true;
    }
    
    // Check if user is admin
    if (user.role === 'admin') {
      return true;
    }
    
    return false;
  }
  
  return false;
};

// Method to get safe product object with seller info
productSchema.methods.toSafeObject = async function() {
  await this.populate('sellerId', 'name email isVerified');
  
  return {
    id: this._id,
    title: this.title,
    description: this.description,
    price: this.price,
    isFree: this.isFree,
    category: this.category,
    condition: this.condition,
    location: this.location,
    images: this.images,
    status: this.status,
    seller: this.sellerId ? {
      id: this.sellerId._id,
      name: this.sellerId.name,
      isVerified: this.sellerId.isVerified
    } : null,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

// This creates a virtual 'id' field that maps to '_id'
productSchema.virtual('id').get(function() {
    return this._id.toHexString();
});

// This ensures the virtual 'id' is sent when we call res.json()
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);

module.exports = mongoose.model('Product', productSchema);