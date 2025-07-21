const axios = require("axios");

// Debug log to confirm environment variable is loaded
console.log("BLAND_API_KEY:", process.env.BLAND_API_KEY);
console.log("API_URL:", process.env.API_URL);

// Initialize Bland.ai API client
const blandApi = axios.create({
  baseURL: "https://api.bland.ai",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.BLAND_API_KEY}`,
  },
});

// Initiate a call with Bland.ai
exports.initiateCall = async (phoneNumber, script, callId) => {
  try {
    const response = await blandApi.post("/v1/calls", {
      phone_number: phoneNumber,
      task: script,
      voice: "923ef241-cffc-4b6d-a59a-9c3ec3614d53", // You can choose different voices like 'nova', 'samantha', etc.
      reduce_latency: true,
      webhook_url: `${process.env.API_URL}/api/webhook/bland`,
      metadata: {
        call_id: callId.toString(), // Useful to track calls from your end
      },
    });

    return response.data;
  } catch (error) {
    console.error("Bland.ai API error:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || "Failed to initiate call with Bland.ai"
    );
  }
};

// Send response to the ongoing call
exports.sendResponse = async (blandCallId, responseText) => {
  try {
    const res = await blandApi.post(`/v1/calls/${blandCallId}/actions`, {
      action: "respond",
      response: responseText,
    });

    return res.data;
  } catch (error) {
    console.error(
      "Bland.ai response error:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to send response via Bland.ai"
    );
  }
};

// (Optional) Verify webhook signature - implement if Bland.ai provides secret key checking
exports.verifyWebhookSignature = (headers, body) => {
  // Placeholder logic for webhook security
  // Implement actual HMAC verification if needed
  return true;
};
