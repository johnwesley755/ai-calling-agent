const geminiService = require('../services/geminiService');

// Generate a call script using Gemini API
exports.generateScript = async (req, res) => {
  try {
    const { topic, tone, additionalInstructions } = req.body;
    
    if (!topic || !tone) {
      return res.status(400).json({ message: 'Topic and tone are required' });
    }
    
    // Create a prompt for Gemini that includes context and instructions
    const prompt = `
      You are an AI voice calling agent script writer. Create a natural, conversational script for a phone call about the following topic:
      
      Topic: ${topic}
      Tone: ${tone}
      ${additionalInstructions ? `Additional instructions: ${additionalInstructions}` : ''}
      
      The script should be concise, engaging, and sound natural when spoken by an AI voice agent.
      Only return the script text without any additional formatting or explanation.
    `;
    
    const result = await geminiService.model.generateContent(prompt);
    const scriptText = result.response.text().trim();
    
    res.json({ script: scriptText });
  } catch (error) {
    console.error('Script generation error:', error);
    res.status(500).json({ message: 'Failed to generate script' });
  }
};