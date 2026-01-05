const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// POST /api/contact - (Already working, saves both Contact and Reports)
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message, isReport } = req.body;

    const newMessage = new Message({
      name,
      email,
      subject,
      message,
      isReport: isReport || false // Correctly flags 'true' if coming from /report
    });

    await newMessage.save();

    res.status(201).json({ 
      success: true, 
      message: isReport ? 'Report submitted successfully.' : 'Message sent successfully!' 
    });
  } catch (error) {
    console.error('Contact API Error:', error);
    res.status(500).json({ success: false, message: 'Server error, please try again later.' });
  }
});

// GET /api/contact - (NEW: Allows Admin to read messages and reports)
router.get('/', async (req, res) => {
  try {
    // Fetches all messages, newest first
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Could not fetch messages' });
  }
});

module.exports = router;