const { GoogleGenerativeAI } = require("@google/generative-ai");

// Load Gemini API key from environment variables
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Update to use a currently supported model
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// Export the model
exports.model = model;

// Generate a call script
exports.generateScript = async (topic) => {
  try {
    const prompt = `
      You are a professional scriptwriter for AI voice agents.
      Generate a short, professional, and friendly call script for the following topic: "${topic}".

      Keep it concise, around 4 to 6 lines, and make it sound like a natural conversation.
      Do not include any formatting like titles or bullet points.
      Only return the script text.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response.text();

    return response.trim();
  } catch (error) {
    console.error("Error generating script with Gemini API:", error);
    throw new Error("Failed to generate script");
  }
};

// Analyze and respond to transcript from recipient
exports.processTranscript = async (transcript, originalScript) => {
  try {
    const prompt = `
      You are an AI calling agent. Here’s the original script and the recipient's response:

      Original Script: ${originalScript}
      Recipient's Response: ${transcript}

      Please analyze and respond with:
      1. A polite, conversational reply to their response
      2. The sentiment of their response (positive, neutral, or negative)

      Format your output strictly as JSON like:
      {
        "response": "Thank you! I'll send more info.",
        "sentiment": "positive"
      }
    `;

    const result = await model.generateContent(prompt);
    const responseText = await result.response.text();

    try {
      const parsed = JSON.parse(responseText);
      return {
        response: parsed.response || "Thank you for your input.",
        sentiment: (parsed.sentiment || "neutral").toLowerCase(),
      };
    } catch (parseError) {
      // Fallback regex parsing
      const responseMatch = responseText.match(/"response"\s*:\s*"([^"]+)"/i);
      const sentimentMatch = responseText.match(/"sentiment"\s*:\s*"([^"]+)"/i);

      return {
        response: responseMatch
          ? responseMatch[1]
          : "Thanks for your response. Let me know if you have any questions.",
        sentiment: sentimentMatch ? sentimentMatch[1].toLowerCase() : "neutral",
      };
    }
  } catch (error) {
    console.error("Error processing transcript:", error);
    return {
      response: "Thank you for your response. I’ll make a note of that.",
      sentiment: "neutral",
    };
  }
};
