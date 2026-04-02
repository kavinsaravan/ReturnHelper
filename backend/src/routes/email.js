const express = require('express');
const router = express.Router();
const emailController = require('../controllers/emailController');

// Parse order confirmation email
router.post('/parse', emailController.parseEmail);

module.exports = router;
