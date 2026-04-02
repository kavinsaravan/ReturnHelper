const mongoose = require('mongoose');

const progressStepSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  completed: { type: Boolean, default: false }
});

const returnSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    index: true
  },
  retailer: {
    type: String,
    required: true
  },
  productName: String,
  amount: Number,
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  trackingNumber: String,
  trackingUrl: String,
  carrier: String,
  shippingLabelUrl: String,
  pickupScheduled: Date,
  returnInstructions: String,
  errorMessage: String,
  progressSteps: [progressStepSchema],
  rawEmailContent: String,
  customerEmail: String,
  customerName: String
}, {
  timestamps: true
});

// Create indexes
returnSchema.index({ createdAt: -1 });
returnSchema.index({ status: 1 });
returnSchema.index({ retailer: 1 });

const Return = mongoose.model('Return', returnSchema);

module.exports = Return;
