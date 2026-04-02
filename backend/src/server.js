require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const returnsRoutes = require('./routes/returns');
const emailRoutes = require('./routes/email');
const healthRoutes = require('./routes/health');
const mockRoutes = require('./routes/mock');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/returns', returnsRoutes);
app.use('/api/email', emailRoutes);
app.use('/mock', mockRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal server error',
      status: err.status || 500
    }
  });
});

// Database connection (MongoDB)
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/returnsrunner';
    await mongoose.connect(mongoURI);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.log('⚠️  MongoDB connection failed (app will run without database):', error.message);
    console.log('   Running in demo mode with in-memory storage');
  }
};

// Start server
const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log('');
    console.log('🚀 ReturnsRunner Backend Server');
    console.log('================================');
    console.log(`✅ Server running on: http://localhost:${PORT}`);
    console.log(`✅ API endpoint: http://localhost:${PORT}/api`);
    console.log(`✅ Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log('');
    console.log('Available endpoints:');
    console.log(`   GET  /api/health - Health check`);
    console.log(`   POST /api/returns - Create new return`);
    console.log(`   GET  /api/returns - Get all returns`);
    console.log(`   GET  /api/returns/:id - Get return by ID`);
    console.log(`   POST /api/email/parse - Parse order email`);
    console.log('');
  });
};

startServer();

module.exports = app;
