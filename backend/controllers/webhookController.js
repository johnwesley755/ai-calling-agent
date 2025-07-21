const Call = require('../models/Call');
const blandService = require('../services/blandService');
const geminiService = require('../services/geminiService');

// Handle Bland.ai webhook
exports.handleBlandWebhook = async (req, res) => {
  try {
    const webhookData = req.body;
    
    // Verify webhook signature (implementation depends on Bland.ai's webhook security)
    // This is a placeholder for actual verification logic
    // const isValid = blandService.verifyWebhookSignature(req.headers, req.body);
    // if (!isValid) return res.status(401).json({ message: 'Invalid webhook signature' });
    
    // Extract call ID and metadata from webhook
    const { call_id, event_type, transcript, call_status } = webhookData;
    
    // Find the call in our database using metadata (which contains our call ID)
    const metadata = webhookData.metadata || {};
    const callId = metadata.call_id;
    
    if (!callId) {
      console.error('No call ID found in webhook metadata');
      return res.status(400).json({ message: 'Missing call ID in metadata' });
    }
    
    const call = await Call.findById(callId);
    if (!call) {
      console.error(`Call not found with ID: ${callId}`);
      return res.status(404).json({ message: 'Call not found' });
    }
    
    // Update call based on event type
    switch (event_type) {
      case 'call.transcription':
        // Update transcript
        if (transcript) {
          call.transcript = transcript;
          
          // Process transcript with Gemini API
          try {
            const geminiResponse = await geminiService.processTranscript(transcript, call.script);
            
            // Update call with Gemini response
            call.response = geminiResponse.response;
            call.sentiment = geminiResponse.sentiment;
            
            // Send response back to caller via Bland.ai
            await blandService.sendResponse(call_id, geminiResponse.response);
          } catch (error) {
            console.error('Error processing transcript with Gemini:', error);
          }
        }
        break;
        
      case 'call.completed':
        // Update call status
        call.status = 'completed';
        break;
        
      case 'call.failed':
        // Update call status
        call.status = 'failed';
        break;
    }
    
    // Save updated call
    call.updatedAt = Date.now();
    await call.save();
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Webhook handling error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};