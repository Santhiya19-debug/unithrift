require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products'); 
const adminRoutes = require('./routes/admin'); // 1. IMPORT ADMIN ROUTES
const errorHandler = require('./middleware/errorHandler');
const wishlistRoutes = require('./routes/wishlist');
const contactRoutes = require('./routes/contact');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));

// Body Parsers (Already sized for Cloudinary images)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Health check route
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'UniThrift API is running',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes); 
app.use('/api/admin', adminRoutes); // 2. MOUNT ADMIN ROUTES HERE
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/contact', contactRoutes);
// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});
// 2. Mount it
app.use('/api/wishlist', wishlistRoutes);

// Error handler (must be last)
app.use(errorHandler);

// Start server only after DB connection
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start server
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`🚀 API active at: http://localhost:${PORT}/api/products`);
      console.log(`🛡️  Admin API active at: http://localhost:${PORT}/api/admin`);
      console.log(`💻 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();