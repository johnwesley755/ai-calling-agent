const express = require('express');
const router = express.Router();
const callController = require('../controllers/callController');
const auth = require('../middleware/auth');
const multer = require('multer');

// Configure multer for file uploads
const upload = multer({ 
  dest: 'uploads/',
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// @route   POST /api/call/start
// @desc    Start a new call
// @access  Private
router.post('/start', auth, callController.startCall);

// @route   GET /api/call/history
// @desc    Get call history for a user
// @access  Private
router.get('/history', auth, callController.getCallHistory);

// @route   POST /api/call/upload-numbers
// @desc    Upload phone numbers from CSV
// @access  Private
router.post('/upload-numbers', auth, upload.single('file'), callController.uploadPhoneNumbers);

module.exports = router;