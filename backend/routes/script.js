const express = require('express');
const router = express.Router();
const scriptController = require('../controllers/scriptController');
const auth = require('../middleware/auth');

// @route   POST /api/script/generate
// @desc    Generate a call script using Gemini API
// @access  Private
router.post('/generate', auth, scriptController.generateScript);

module.exports = router;