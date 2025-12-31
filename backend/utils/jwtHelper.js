const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';

/**
 * Generate JWT token
 */
const generateToken = (user) => {
  const payload = {
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
    isVerified: user.isVerified,
    isBlocked: user.isBlocked
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRY
  });
};

/**
 * Verify JWT token
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

module.exports = {
  generateToken,
  verifyToken
};