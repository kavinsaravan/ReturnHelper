const express = require('express');
const router = express.Router();
const path = require('path');

/**
 * Mock Pages Routes
 * Serves mock retailer return pages for testing the browser automation
 */

// Amazon mock returns page
router.get('/amazon-returns.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../mock-pages/amazon-returns.html'));
});

// Target mock returns page
router.get('/target-returns.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../mock-pages/target-returns.html'));
});

// Walmart mock returns page
router.get('/walmart-returns.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../mock-pages/walmart-returns.html'));
});

// Mock label downloads (return a simple PDF placeholder)
router.get('/labels/:filename', (req, res) => {
  const { filename } = req.params;

  // In a real scenario, this would return an actual PDF
  // For now, just return a text response
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.send(`Mock shipping label for ${filename}`);
});

module.exports = router;
