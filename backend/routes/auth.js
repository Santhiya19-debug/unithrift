const express = require('express');
const router = express.Router();
const User = require('../models/user');
const AuthToken = require('../models/AuthToken');
const { validateInstitutionalEmail } = require('../utils/emailValidation');
const { generateToken } = require('../utils/jwtHelper');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../utils/emailService');
const authenticate = require('../middleware/auth');
const rateLimit = require('../middleware/rateLimiter');

/**
 * POST /api/auth/signup
 * Create new user account
 */
router.post('/signup', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required'
      });
    }

    // Validate email format
    const emailValidation = validateInstitutionalEmail(email);
    if (!emailValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: emailValidation.error
      });
    }

    // Validate password length
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters'
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Create user
    const user = new User({
      name: name.trim(),
      email: email.toLowerCase(),
      passwordHash: password, // Will be hashed by pre-save hook
      role: 'user',
      isVerified: false,
      isBlocked: false
    });

    await user.save();

    // Create verification token
    const verificationToken = await AuthToken.createToken(
      user._id,
      'EMAIL_VERIFICATION',
      24 // 24 hours
    );

    // Send verification email
    await sendVerificationEmail(user.email, verificationToken);

    res.status(201).json({
      success: true,
      message: 'Account created successfully. Please check your email to verify your account.'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/auth/verify-email?token=...
 * Verify email address
 */
router.get('/verify-email', async (req, res, next) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Verification token is required'
      });
    }

    // Verify and consume token
    const userId = await AuthToken.verifyAndConsume(token, 'EMAIL_VERIFICATION');

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token'
      });
    }

    // Update user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.isVerified = true;
    await user.save();

    res.json({
      success: true,
      message: 'Email verified successfully. You can now login.'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/auth/login
 * Authenticate user
 */
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate JWT
    const token = generateToken(user);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: user.toSafeObject()
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/auth/me
 * Get current user
 */
router.get('/me', authenticate, async (req, res, next) => {
  try {
    res.json({
      success: true,
      user: req.user.toSafeObject()
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/auth/forgot-password
 * Request password reset
 */
router.post('/forgot-password', async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Find user (don't reveal if email exists)
    const user = await User.findOne({ email: email.toLowerCase() });
    
    // Always return success to prevent email enumeration
    if (!user) {
      return res.json({
        success: true,
        message: 'If that email is registered, a password reset link has been sent.'
      });
    }

    // Create reset token (30 minutes)
    const resetToken = await AuthToken.createToken(
      user._id,
      'PASSWORD_RESET',
      0.5 // 0.5 hours = 30 minutes
    );

    // Send reset email
    await sendPasswordResetEmail(user.email, resetToken);

    res.json({
      success: true,
      message: 'If that email is registered, a password reset link has been sent.'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/auth/reset-password
 * Reset password with token
 */
router.post('/reset-password', async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Token and new password are required'
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters'
      });
    }

    // Verify and consume token
    const userId = await AuthToken.verifyAndConsume(token, 'PASSWORD_RESET');

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    // Update password
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.passwordHash = newPassword; // Will be hashed by pre-save hook
    await user.save();

    // Invalidate all other reset tokens for this user
    await AuthToken.updateMany(
      { userId: user._id, type: 'PASSWORD_RESET', used: false },
      { used: true }
    );

    res.json({
      success: true,
      message: 'Password reset successfully. You can now login with your new password.'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/auth/resend-verification
 * Resend verification email (rate-limited)
 */
router.post('/resend-verification', rateLimit, authenticate, async (req, res, next) => {
  try {
    const user = req.user;

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email is already verified'
      });
    }

    // Invalidate old unused verification tokens
    await AuthToken.updateMany(
      { userId: user._id, type: 'EMAIL_VERIFICATION', used: false },
      { used: true }
    );

    // Create new verification token
    const verificationToken = await AuthToken.createToken(
      user._id,
      'EMAIL_VERIFICATION',
      24
    );

    // Send verification email
    await sendVerificationEmail(user.email, verificationToken);

    res.json({
      success: true,
      message: 'Verification email sent. Please check your inbox.'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/auth/logout
 * Logout (client-side token deletion)
 */
router.post('/logout', authenticate, async (req, res, next) => {
  try {
    // In header-based JWT, logout is handled client-side
    // Backend can log the event or blacklist token if needed
    
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;