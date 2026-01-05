const jwt = require('jsonwebtoken');

// REMOVE the || 'hardcoded-string'. We want it to fail if .env is missing 
// so you know there's a configuration problem immediately.
const JWT_SECRET = process.env.JWT_SECRET; 
const JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';

const generateToken = (user) => {
  if (!JWT_SECRET) throw new Error("JWT_SECRET is missing in .env!");
  
  const payload = {
    userId: user._id.toString(), // This is the key we must match
    email: user.email,
    role: user.role
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    console.error("JWT Verification Error:", error.message);
    return null;
  }
};

module.exports = { generateToken, verifyToken };