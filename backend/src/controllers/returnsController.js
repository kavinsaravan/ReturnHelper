const Return = require('../models/Return');
const ReturnsProcessingService = require('../services/ReturnsProcessingService');

// In-memory storage fallback (if MongoDB is not connected)
let inMemoryReturns = [];

const isMongoConnected = () => {
  const mongoose = require('mongoose');
  return mongoose.connection.readyState === 1;
};

// Create a new return
exports.createReturn = async (req, res) => {
  try {
    const { orderDetails, instruction } = req.body;

    if (!orderDetails || !orderDetails.orderId || !orderDetails.retailer) {
      return res.status(400).json({
        error: 'Missing required fields: orderDetails with orderId and retailer'
      });
    }

    const returnData = {
      orderId: orderDetails.orderId,
      retailer: orderDetails.retailer,
      productName: orderDetails.productName,
      amount: orderDetails.amount,
      customerEmail: orderDetails.customerEmail,
      customerName: orderDetails.customerName,
      rawEmailContent: orderDetails.rawEmailContent,
      status: 'pending',
      progressSteps: [{
        title: 'Return Request Created',
        description: 'Your return request has been received',
        timestamp: new Date(),
        completed: true
      }]
    };

    let savedReturn;

    if (isMongoConnected()) {
      // Save to MongoDB
      const newReturn = new Return(returnData);
      savedReturn = await newReturn.save();
    } else {
      // Save to in-memory storage
      savedReturn = {
        _id: `RET-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        ...returnData,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      inMemoryReturns.push(savedReturn);
    }

    // Start processing asynchronously
    ReturnsProcessingService.processReturn(savedReturn, instruction)
      .catch(err => console.error('Error processing return:', err));

    res.status(201).json({
      success: true,
      data: savedReturn
    });
  } catch (error) {
    console.error('Create return error:', error);
    res.status(500).json({
      error: 'Failed to create return request',
      message: error.message
    });
  }
};

// Get all returns
exports.getAllReturns = async (req, res) => {
  try {
    let returns;

    if (isMongoConnected()) {
      returns = await Return.find().sort({ createdAt: -1 });
    } else {
      returns = inMemoryReturns.sort((a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
      );
    }

    res.status(200).json({
      success: true,
      count: returns.length,
      data: returns
    });
  } catch (error) {
    console.error('Get returns error:', error);
    res.status(500).json({
      error: 'Failed to fetch returns',
      message: error.message
    });
  }
};

// Get return by ID
exports.getReturnById = async (req, res) => {
  try {
    const { id } = req.params;
    let returnData;

    if (isMongoConnected()) {
      returnData = await Return.findById(id);
    } else {
      returnData = inMemoryReturns.find(r => r._id === id);
    }

    if (!returnData) {
      return res.status(404).json({
        error: 'Return not found'
      });
    }

    res.status(200).json({
      success: true,
      data: returnData
    });
  } catch (error) {
    console.error('Get return error:', error);
    res.status(500).json({
      error: 'Failed to fetch return',
      message: error.message
    });
  }
};

// Update return status
exports.updateReturnStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, progressStep } = req.body;

    let returnData;

    if (isMongoConnected()) {
      returnData = await Return.findById(id);
      if (!returnData) {
        return res.status(404).json({ error: 'Return not found' });
      }

      if (status) returnData.status = status;
      if (progressStep) returnData.progressSteps.push(progressStep);

      await returnData.save();
    } else {
      returnData = inMemoryReturns.find(r => r._id === id);
      if (!returnData) {
        return res.status(404).json({ error: 'Return not found' });
      }

      if (status) returnData.status = status;
      if (progressStep) returnData.progressSteps.push(progressStep);
      returnData.updatedAt = new Date();
    }

    res.status(200).json({
      success: true,
      data: returnData
    });
  } catch (error) {
    console.error('Update return error:', error);
    res.status(500).json({
      error: 'Failed to update return',
      message: error.message
    });
  }
};

// Delete return
exports.deleteReturn = async (req, res) => {
  try {
    const { id } = req.params;

    if (isMongoConnected()) {
      const result = await Return.findByIdAndDelete(id);
      if (!result) {
        return res.status(404).json({ error: 'Return not found' });
      }
    } else {
      const index = inMemoryReturns.findIndex(r => r._id === id);
      if (index === -1) {
        return res.status(404).json({ error: 'Return not found' });
      }
      inMemoryReturns.splice(index, 1);
    }

    res.status(200).json({
      success: true,
      message: 'Return deleted successfully'
    });
  } catch (error) {
    console.error('Delete return error:', error);
    res.status(500).json({
      error: 'Failed to delete return',
      message: error.message
    });
  }
};
