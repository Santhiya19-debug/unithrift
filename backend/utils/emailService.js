const nodemailer = require('nodemailer');

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

/**
 * Send verification email
 */
const sendVerificationEmail = async (email, token) => {
  const verificationUrl = `${FRONTEND_URL}/verify-email?token=${token}`;

  const mailOptions = {
    from: `"UniThrift" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Verify Your UniThrift Account',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #5F6F52;">Welcome to UniThrift!</h2>
        <p>Thank you for signing up. Please verify your email address to activate your account.</p>
        <p>Click the button below to verify your email:</p>
        <a href="${verificationUrl}" 
           style="display: inline-block; padding: 12px 24px; background-color: #5F6F52; color: white; text-decoration: none; border-radius: 8px; margin: 20px 0;">
          Verify Email
        </a>
        <p style="color: #666; font-size: 14px;">Or copy and paste this link in your browser:</p>
        <p style="color: #666; font-size: 14px; word-break: break-all;">${verificationUrl}</p>
        <p style="color: #666; font-size: 14px;">This link will expire in 24 hours.</p>
        <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 30px 0;">
        <p style="color: #666; font-size: 12px;">If you didn't create an account, please ignore this email.</p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

/**
 * Send password reset email
 */
const sendPasswordResetEmail = async (email, token) => {
  const resetUrl = `${FRONTEND_URL}/reset-password?token=${token}`;

  const mailOptions = {
    from: `"UniThrift" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Reset Your UniThrift Password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #5F6F52;">Reset Your Password</h2>
        <p>You requested to reset your password for your UniThrift account.</p>
        <p>Click the button below to reset your password:</p>
        <a href="${resetUrl}" 
           style="display: inline-block; padding: 12px 24px; background-color: #5F6F52; color: white; text-decoration: none; border-radius: 8px; margin: 20px 0;">
          Reset Password
        </a>
        <p style="color: #666; font-size: 14px;">Or copy and paste this link in your browser:</p>
        <p style="color: #666; font-size: 14px; word-break: break-all;">${resetUrl}</p>
        <p style="color: #666; font-size: 14px;">This link will expire in 30 minutes.</p>
        <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 30px 0;">
        <p style="color: #666; font-size: 12px;">If you didn't request a password reset, please ignore this email or contact support if you're concerned.</p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail
};