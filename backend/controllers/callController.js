const Call = require('../models/Call');
const blandService = require('../services/blandService');
const fs = require('fs');
const csv = require('csv-parser');

// Start a new call
exports.startCall = async (req, res) => {
  try {
    const { phoneNumbers, script } = req.body;
    const userId = req.user.id;
    
    if (!phoneNumbers || !phoneNumbers.length || !script) {
      return res.status(400).json({ message: 'Phone numbers and script are required' });
    }
    
    // Create call records and initiate calls
    const callPromises = phoneNumbers.map(async (phoneNumber) => {
      // Create call record in database
      const call = new Call({
        userId,
        phoneNumber,
        script,
        status: 'pending'
      });
      
      await call.save();
      
      // Initiate call with Bland.ai
      try {
        const blandResponse = await blandService.initiateCall(phoneNumber, script, call._id);
        
        // Update call with Bland.ai call ID
        call.blandCallId = blandResponse.call_id;
        call.status = 'in-progress';
        await call.save();
        
        return { success: true, callId: call._id, phoneNumber };
      } catch (error) {
        // Update call status to failed
        call.status = 'failed';
        await call.save();
        
        console.error(`Failed to initiate call to ${phoneNumber}:`, error);
        return { success: false, callId: call._id, phoneNumber, error: error.message };
      }
    });
    
    const results = await Promise.all(callPromises);
    
    res.json({
      message: 'Calls initiated',
      results
    });
  } catch (error) {
    console.error('Start call error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get call history for a user
exports.getCallHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const calls = await Call.find({ userId })
      .sort({ createdAt: -1 })
      .lean();
    
    res.json({ calls });
  } catch (error) {
    console.error('Get call history error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Upload phone numbers from CSV
exports.uploadPhoneNumbers = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    const phoneNumbers = [];
    
    // Process CSV file
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on('data', (row) => {
        // Extract phone number from the first column (assuming CSV has a header)
        const phoneNumber = Object.values(row)[0];
        if (phoneNumber && phoneNumber.trim()) {
          phoneNumbers.push(phoneNumber.trim());
        }
      })
      .on('end', () => {
        // Delete the temporary file
        fs.unlinkSync(req.file.path);
        
        if (phoneNumbers.length === 0) {
          return res.status(400).json({ message: 'No valid phone numbers found in CSV' });
        }
        
        res.json({ phoneNumbers });
      })
      .on('error', (error) => {
        console.error('CSV parsing error:', error);
        res.status(400).json({ message: 'Error parsing CSV file' });
      });
  } catch (error) {
    console.error('Upload phone numbers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};