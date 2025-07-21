import React, { useEffect, useState } from "react";
import { getCallHistory } from "../services/callService";
import type { Call } from "../types";
import { toast } from "sonner";

const CallHistory: React.FC = () => {
  const [calls, setCalls] = useState<Call[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCall, setSelectedCall] = useState<Call | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

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
        return "text-green-600 bg-green-50 border-green-200";
      case "negative":
        return "text-red-600 bg-red-50 border-red-200";
      case "neutral":
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300";
      case "failed":
        return "bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-red-300";
      case "in-progress":
        return "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-300";
      case "pending":
      default:
        return "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border-yellow-300";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return "✓";
      case "failed":
        return "✗";
      case "in-progress":
        return "⟳";
      case "pending":
      default:
        return "⏱";
    }
  };

  const getSentimentIcon = (sentiment?: string) => {
    switch (sentiment) {
      case "positive":
        return "😊";
      case "negative":
        return "😞";
      case "neutral":
      default:
        return "😐";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatDuration = (startTime?: string, endTime?: string) => {
    if (!startTime || !endTime) return "N/A";
    const duration =
      new Date(endTime).getTime() - new Date(startTime).getTime();
    const minutes = Math.floor(duration / 60000);
    const seconds = Math.floor((duration % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const filteredCalls = calls.filter((call) => {
    const matchesSearch =
      call.phoneNumber.includes(searchTerm) ||
      (call.transcript &&
        call.transcript.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus =
      statusFilter === "all" || call.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getCallStats = () => {
    const total = calls.length;
    const completed = calls.filter((c) => c.status === "completed").length;
    const failed = calls.filter((c) => c.status === "failed").length;
    const pending = calls.filter((c) => c.status === "pending").length;
    const inProgress = calls.filter((c) => c.status === "in-progress").length;

    return { total, completed, failed, pending, inProgress };
  };

  const stats = getCallStats();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 mt-16">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-xl font-medium text-gray-600">
              Loading call history...
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Please wait while we fetch your data
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-16 max-w-7xl">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Call History
            </h1>
            <p className="text-gray-600">
              Track and analyze your call performance
            </p>
          </div>
          <button
            onClick={fetchCallHistory}
            className="mt-4 md:mt-0 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Refresh
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200 shadow-sm">
            <div className="text-2xl font-bold text-blue-700">
              {stats.total}
            </div>
            <div className="text-sm text-blue-600">Total Calls</div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200 shadow-sm">
            <div className="text-2xl font-bold text-green-700">
              {stats.completed}
            </div>
            <div className="text-sm text-green-600">Completed</div>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-xl border border-red-200 shadow-sm">
            <div className="text-2xl font-bold text-red-700">
              {stats.failed}
            </div>
            <div className="text-sm text-red-600">Failed</div>
          </div>
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-xl border border-yellow-200 shadow-sm">
            <div className="text-2xl font-bold text-yellow-700">
              {stats.pending}
            </div>
            <div className="text-sm text-yellow-600">Pending</div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200 shadow-sm">
            <div className="text-2xl font-bold text-purple-700">
              {stats.inProgress}
            </div>
            <div className="text-sm text-purple-600">In Progress</div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl shadow-md border border-gray-200">
          <div className="flex-1">
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search by phone number or transcript..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="md:w-48">
            <select
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {calls.length === 0 ? (
        <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-lg border border-gray-200">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              No Call History Yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start making calls from the dashboard to see your call history and
              analytics here.
            </p>
            <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-1">
              Go to Dashboard
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Call List */}
          <div className="xl:col-span-1 bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
            <div className="p-6 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                Recent Calls ({filteredCalls.length})
              </h2>
            </div>
            <div className="divide-y divide-gray-100 max-h-[calc(100vh-300px)] overflow-y-auto">
              {filteredCalls.map((call) => (
                <div
                  key={call._id}
                  className={`p-4 cursor-pointer transition-all duration-200 hover:bg-gray-50 border-l-4 ${
                    selectedCall?._id === call._id
                      ? "bg-blue-50 border-l-blue-500 shadow-md"
                      : "border-l-transparent hover:border-l-gray-300"
                  }`}
                  onClick={() => setSelectedCall(call)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <svg
                          className="w-4 h-4 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                        <p className="font-semibold text-gray-900">
                          {call.phoneNumber}
                        </p>
                      </div>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {formatDate(call.createdAt)}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full border flex items-center gap-1 ${getStatusColor(
                          call.status
                        )}`}
                      >
                        <span>{getStatusIcon(call.status)}</span>
                        {call.status}
                      </span>
                      {call.sentiment && (
                        <span
                          className={`px-2 py-1 text-xs rounded-md border flex items-center gap-1 ${getSentimentColor(
                            call.sentiment
                          )}`}
                        >
                          <span>{getSentimentIcon(call.sentiment)}</span>
                          {call.sentiment}
                        </span>
                      )}
                    </div>
                  </div>
                  {call.transcript && (
                    <p className="text-xs text-gray-600 truncate bg-gray-50 px-2 py-1 rounded">
                      "{call.transcript.substring(0, 100)}..."
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Call Details */}
          <div className="xl:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-200">
            {selectedCall ? (
              <div className="p-8">
                {/* Header */}
                <div className="flex items-start justify-between mb-8 pb-6 border-b border-gray-200">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                      <svg
                        className="w-8 h-8 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      Call Details
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <svg
                          className="w-4 h-4 text-blue-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                        <strong>Phone:</strong> {selectedCall.phoneNumber}
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <svg
                          className="w-4 h-4 text-green-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <strong>Date:</strong>{" "}
                        {formatDate(selectedCall.createdAt)}
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-3 py-1 text-xs font-medium rounded-full border flex items-center gap-1 ${getStatusColor(
                            selectedCall.status
                          )}`}
                        >
                          <span>{getStatusIcon(selectedCall.status)}</span>
                          {selectedCall.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  {selectedCall.sentiment && (
                    <div
                      className={`px-4 py-2 rounded-xl border flex items-center gap-2 ${getSentimentColor(
                        selectedCall.sentiment
                      )}`}
                    >
                      <span className="text-lg">
                        {getSentimentIcon(selectedCall.sentiment)}
                      </span>
                      <div>
                        <div className="font-medium text-sm">Sentiment</div>
                        <div className="font-bold">
                          {selectedCall.sentiment.charAt(0).toUpperCase() +
                            selectedCall.sentiment.slice(1)}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Content Sections */}
                <div className="space-y-8">
                  {/* Script Section */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      Script Used
                    </h3>
                    <div className="bg-white p-4 rounded-lg border border-blue-200 shadow-sm">
                      <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                        {selectedCall.script}
                      </p>
                    </div>
                  </div>

                  {/* Transcript Section */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        />
                      </svg>
                      Call Transcript
                    </h3>
                    <div className="bg-white p-4 rounded-lg border border-green-200 shadow-sm">
                      <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                        {selectedCall.transcript || (
                          <span className="italic text-gray-500 flex items-center gap-2">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.08 14.5c-.77.833.192 2.5 1.732 2.5z"
                              />
                            </svg>
                            No transcript available
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* AI Response Section */}
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-purple-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                        />
                      </svg>
                      AI Response
                    </h3>
                    <div className="bg-white p-4 rounded-lg border border-purple-200 shadow-sm">
                      <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                        {selectedCall.response || (
                          <span className="italic text-gray-500 flex items-center gap-2">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.08 14.5c-.77.833.192 2.5 1.732 2.5z"
                              />
                            </svg>
                            No response generated
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full min-h-[600px] p-8">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-12 h-12 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    Select a Call
                  </h3>
                  <p className="text-gray-600 max-w-md">
                    Choose a call from the list on the left to view detailed
                    information, transcript, and analysis.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CallHistory;
