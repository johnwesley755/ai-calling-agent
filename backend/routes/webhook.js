const express = require('express');
const router = express.Router();
const webhookController = require('../controllers/webhookController');

// @route   POST /api/webhook/bland
// @desc    Handle Bland.ai webhook
// @access  Public
router.post('/bland', webhookController.handleBlandWebhook);

module.exports = router;