import React, { useEffect, useState } from "react";
import { getCallHistory } from "../services/callService";
import type { Call } from "../types";
import { toast } from "sonner";

const CallHistory: React.FC = () => {
  const [calls, setCalls] = useState<Call[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCall, setSelectedCall] = useState<Call | null>(null);

  useEffect(() => {
    fetchCallHistory();
  }, []);

  const fetchCallHistory = async () => {
    try {
      setLoading(true);
      const data = await getCallHistory();
      setCalls(data.calls);
    } catch (error: Error | unknown) {
      toast.error(
        (error as any)?.response?.data?.message ||
          "Failed to fetch call history"
      );
    } finally {
      setLoading(false);
    }
  };

  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment) {
      case "positive":
        return "text-green-600";
      case "negative":
        return "text-red-600";
      case "neutral":
      default:
        return "text-gray-600";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "pending":
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <h1 className="text-3xl font-bold mb-6">Call History</h1>

      {loading ? (
        <div className="text-center py-8">Loading call history...</div>
      ) : calls.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-lg shadow-md">
          <p className="text-gray-500">
            No call history found. Start making calls from the dashboard.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 bg-gray-50 border-b">
              <h2 className="font-semibold">Recent Calls</h2>
            </div>
            <div className="divide-y divide-gray-200 max-h-[70vh] overflow-y-auto">
              {calls.map((call) => (
                <div
                  key={call._id}
                  className={`p-4 cursor-pointer hover:bg-gray-50 ${
                    selectedCall?._id === call._id ? "bg-blue-50" : ""
                  }`}
                  onClick={() => setSelectedCall(call)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{call.phoneNumber}</p>
                      <p className="text-sm text-gray-500">
                        {formatDate(call.createdAt)}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                        call.status
                      )}`}
                    >
                      {call.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 bg-white rounded-lg shadow-md">
            {selectedCall ? (
              <div className="p-6">
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold mb-2">Call Details</h2>
                  <div className="flex items-center">
                    <p className="text-gray-600 mr-4">
                      Phone: {selectedCall.phoneNumber}
                    </p>
                    <p className="text-gray-600 mr-4">
                      Date: {formatDate(selectedCall.createdAt)}
                    </p>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                        selectedCall.status
                      )}`}
                    >
                      {selectedCall.status}
                    </span>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Script Used</h3>
                  <div className="p-3 bg-gray-50 rounded border">
                    {selectedCall.script}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Call Transcript</h3>
                  <div className="p-3 bg-gray-50 rounded border">
                    {selectedCall.transcript || "No transcript available"}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold mb-2">AI Response</h3>
                  <div className="p-3 bg-gray-50 rounded border">
                    {selectedCall.response || "No response generated"}
                  </div>
                </div>

                {selectedCall.sentiment && (
                  <div>
                    <h3 className="font-semibold mb-2">Sentiment Analysis</h3>
                    <div
                      className={`text-lg font-medium ${getSentimentColor(
                        selectedCall.sentiment
                      )}`}
                    >
                      {selectedCall.sentiment.charAt(0).toUpperCase() +
                        selectedCall.sentiment.slice(1)}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full p-8 text-gray-500">
                Select a call from the list to view details
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CallHistory;
