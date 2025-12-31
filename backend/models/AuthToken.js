const mongoose = require('mongoose');
const crypto = require('crypto');

const authTokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  tokenHash: {
    type: String,
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['EMAIL_VERIFICATION', 'PASSWORD_RESET'],
    required: true
  },
  expiresAt: {
    type: Date,
    required: true,
    index: true
  },
  used: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Hash token before saving
authTokenSchema.pre('save', function(next) {
  if (!this.isModified('tokenHash')) {
    return next();
  }
  
  // Token is already hashed when passed to this model
  next();
});

// Static method to hash token
authTokenSchema.statics.hashToken = function(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
};

// Static method to create token
authTokenSchema.statics.createToken = async function(userId, type, expiryHours = 24) {
  // Generate random token
  const token = crypto.randomBytes(32).toString('hex');
  
  // Hash token for storage
  const tokenHash = this.hashToken(token);
  
  // Calculate expiry
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + expiryHours);
  
  // Create token document
  await this.create({
    userId,
    tokenHash,
    type,
    expiresAt
  });
  
  // Return unhashed token (only time it's visible)
  return token;
};

// Static method to verify and consume token
authTokenSchema.statics.verifyAndConsume = async function(token, type) {
  const tokenHash = this.hashToken(token);
  
  const tokenDoc = await this.findOne({
    tokenHash,
    type,
    used: false,
    expiresAt: { $gt: new Date() }
  });
  
  if (!tokenDoc) {
    return null;
  }
  
  // Mark as used
  tokenDoc.used = true;
  await tokenDoc.save();
  
  return tokenDoc.userId;
};

// Auto-delete expired tokens (run periodically)
authTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('AuthToken', authTokenSchema);