const express = require('express');
const router = express.Router();
const returnsController = require('../controllers/returnsController');

// Create a new return
router.post('/', returnsController.createReturn);

// Get all returns
router.get('/', returnsController.getAllReturns);

// Get a specific return by ID
router.get('/:id', returnsController.getReturnById);

// Update return status
router.patch('/:id/status', returnsController.updateReturnStatus);

// Delete a return
router.delete('/:id', returnsController.deleteReturn);

module.exports = router;
