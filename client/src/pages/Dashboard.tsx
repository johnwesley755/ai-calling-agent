import React, { useState, useRef } from "react";
import { toast } from "react-toastify";
import { startCall, uploadPhoneNumbers } from "../services/callService";
import { generateScript } from "../services/geminiService";
import type { ScriptGenerationRequest } from "../services/geminiService";

const Dashboard: React.FC = () => {
  const [phoneNumbers, setPhoneNumbers] = useState<string[]>([]);
  const [script, setScript] = useState("");
  const [manualNumber, setManualNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [scriptRequest, setScriptRequest] = useState<ScriptGenerationRequest>({
    topic: "",
    tone: "professional",
    additionalInstructions: "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    if (file.type !== "text/csv") {
      toast.error("Please upload a CSV file");
      return;
    }

    try {
      setIsLoading(true);
      const result = await uploadPhoneNumbers(file);
      setPhoneNumbers(result.phoneNumbers);
      toast.success(`Uploaded ${result.phoneNumbers.length} phone numbers`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to upload file");
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleAddManualNumber = () => {
    if (!manualNumber) return;

    // Basic phone number validation
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(manualNumber)) {
      toast.error("Please enter a valid phone number");
      return;
    }

    setPhoneNumbers([...phoneNumbers, manualNumber]);
    setManualNumber("");
  };

  const handleRemoveNumber = (index: number) => {
    const updatedNumbers = [...phoneNumbers];
    updatedNumbers.splice(index, 1);
    setPhoneNumbers(updatedNumbers);
  };

  const handleStartCall = async () => {
    if (phoneNumbers.length === 0) {
      toast.error("Please add at least one phone number");
      return;
    }

    if (!script.trim()) {
      toast.error("Please enter a script for the call");
      return;
    }

    try {
      setIsLoading(true);
      await startCall({ phoneNumbers, script });
      toast.success("Calls initiated successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to start calls");
    } finally {
      setIsLoading(false);
    }
  };

  const handleScriptRequestChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setScriptRequest({
      ...scriptRequest,
      [e.target.name]: e.target.value,
    });
  };

  const handleGenerateScript = async () => {
    if (!scriptRequest.topic) {
      toast.error("Please enter a topic for the script");
      return;
    }

    try {
      setIsGeneratingScript(true);
      const result = await generateScript(scriptRequest);
      setScript(result.script);
      toast.success("Script generated successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to generate script");
    } finally {
      setIsGeneratingScript(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100/40 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 -left-40 w-80 h-80 bg-indigo-100/40 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-40 right-1/3 w-80 h-80 bg-cyan-100/40 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative container mx-auto px-4 py-8 max-w-7xl">
        {/* Enhanced Header */}
        <div className="text-center mb-12 mt-20">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-2xl mb-6 shadow-2xl shadow-blue-500/25">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
              />
            </svg>
          </div>
          <h1 className="text-6xl font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4 tracking-tight">
            AI Call Dashboard
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Orchestrate intelligent automated calling campaigns with
            cutting-edge AI voice agents
          </p>
          <div className="flex justify-center mt-6">
            <div className="flex space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Enhanced Phone Numbers Section */}
          <div className="group bg-white/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-gray-200 hover:border-blue-300 hover:shadow-blue-500/20 transition-all duration-500 hover:transform hover:scale-[1.02]">
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mr-4 shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-all duration-300">
                <svg
                  className="w-7 h-7 text-white"
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
              <h2 className="text-2xl font-bold text-gray-800">
                Phone Numbers
              </h2>
            </div>

            {/* Enhanced File Upload */}
            <div className="mb-8">
              <label className="block text-gray-700 font-semibold mb-4">
                Upload CSV File
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  ref={fileInputRef}
                  className="w-full p-6 border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50/50 hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-300 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:bg-gradient-to-r file:from-blue-500 file:to-cyan-500 file:text-white file:font-semibold file:cursor-pointer file:shadow-lg hover:file:shadow-blue-500/25 file:transition-all file:duration-200"
                />
                {isLoading && (
                  <div className="absolute inset-0 bg-white/90 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-3 flex items-center">
                <svg
                  className="w-4 h-4 mr-2 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                CSV should contain a column with valid phone numbers
              </p>
            </div>

            {/* Enhanced Manual Input */}
            <div className="mb-8">
              <label className="block text-gray-700 font-semibold mb-4">
                Add Phone Number Manually
              </label>
              <div className="flex rounded-2xl overflow-hidden shadow-lg bg-white border border-gray-300">
                <input
                  type="text"
                  value={manualNumber}
                  onChange={(e) => setManualNumber(e.target.value)}
                  placeholder="+1234567890"
                  className="flex-1 p-5 border-0 bg-transparent text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  onKeyPress={(e) =>
                    e.key === "Enter" && handleAddManualNumber()
                  }
                />
                <button
                  onClick={handleAddManualNumber}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-5 hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 font-semibold shadow-lg hover:shadow-blue-500/25"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Enhanced Numbers List */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-gray-700">Active Numbers</h3>
                <div className="flex items-center space-x-2">
                  <span className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                    {phoneNumbers.length}
                  </span>
                  <span className="text-gray-500 text-sm">numbers</span>
                </div>
              </div>
              {phoneNumbers.length > 0 ? (
                <div className="max-h-80 overflow-y-auto border border-gray-200 rounded-2xl bg-gray-50/30 shadow-inner">
                  {phoneNumbers.map((number, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-5 border-b border-gray-200/50 last:border-b-0 hover:bg-blue-50/50 transition-all duration-200 group"
                    >
                      <span className="font-mono text-gray-700 bg-white/70 px-3 py-1 rounded-lg border border-gray-200">
                        {number}
                      </span>
                      <button
                        onClick={() => handleRemoveNumber(index)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 p-3 rounded-xl transition-all duration-200 opacity-0 group-hover:opacity-100"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 text-gray-500 bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-300">
                  <div className="w-16 h-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </div>
                  <p className="text-lg font-medium text-gray-600">
                    No phone numbers added yet
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    Upload a CSV or add numbers manually to get started
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Script Section */}
          <div className="group bg-white/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-gray-200 hover:border-purple-300 hover:shadow-purple-500/20 transition-all duration-500 hover:transform hover:scale-[1.02]">
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-4 shadow-lg shadow-purple-500/25 group-hover:shadow-purple-500/40 transition-all duration-300">
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Call Script</h2>
            </div>

            {/* Enhanced AI Script Generation */}
            <div className="mb-10 p-8 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-200/50 shadow-lg">
              <h3 className="font-bold text-gray-800 mb-6 flex items-center text-lg">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
                  <svg
                    className="w-5 h-5 text-white"
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
                </div>
                Generate Script with AI
              </h3>
              <div className="space-y-6 mb-8">
                <div>
                  <label className="block text-gray-700 font-semibold mb-3">
                    Topic
                  </label>
                  <input
                    type="text"
                    name="topic"
                    value={scriptRequest.topic}
                    onChange={handleScriptRequestChange}
                    placeholder="e.g., Product survey, Appointment reminder, Sales outreach"
                    className="w-full p-4 bg-white border border-gray-300 rounded-xl text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-3">
                    Tone
                  </label>
                  <select
                    name="tone"
                    value={scriptRequest.tone}
                    onChange={handleScriptRequestChange}
                    className="w-full p-4 bg-white border border-gray-300 rounded-xl text-gray-800 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="professional">Professional</option>
                    <option value="friendly">Friendly</option>
                    <option value="casual">Casual</option>
                    <option value="formal">Formal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-3">
                    Additional Instructions (Optional)
                  </label>
                  <textarea
                    name="additionalInstructions"
                    value={scriptRequest.additionalInstructions}
                    onChange={handleScriptRequestChange}
                    placeholder="Any specific points to include, style preferences, or call objectives"
                    className="w-full p-4 bg-white border border-gray-300 rounded-xl text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
                    rows={4}
                  />
                </div>

                <button
                  onClick={handleGenerateScript}
                  disabled={isGeneratingScript || !scriptRequest.topic}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-5 rounded-2xl hover:from-purple-600 hover:to-pink-600 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-300 font-bold text-lg flex items-center justify-center shadow-2xl hover:shadow-purple-500/25"
                >
                  {isGeneratingScript ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                      Generating Magic...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-6 h-6 mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                      Generate Script
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Enhanced Manual Script Input */}
            <div className="mb-8">
              <label className="block text-gray-700 font-semibold mb-4">
                Script for AI Voice Agent
              </label>
              <textarea
                value={script}
                onChange={(e) => setScript(e.target.value)}
                placeholder="Enter your custom script or generate one with AI above..."
                className="w-full p-6 bg-white border-2 border-gray-300 rounded-2xl h-56 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 resize-none shadow-inner"
                rows={10}
              />
              <p className="text-sm text-gray-500 mt-4 flex items-center">
                <svg
                  className="w-4 h-4 mr-2 text-purple-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Craft a natural, conversational script that your AI agent will
                use during calls
              </p>
            </div>

            {/* Enhanced Start Calls Button */}
            <button
              onClick={handleStartCall}
              disabled={
                isLoading || phoneNumbers.length === 0 || !script.trim()
              }
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-6 rounded-2xl hover:from-green-600 hover:to-emerald-600 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-300 font-black text-xl flex items-center justify-center shadow-2xl hover:shadow-green-500/25 hover:transform hover:scale-105"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mr-4"></div>
                  Launching Campaign...
                </>
              ) : (
                <>
                  <svg
                    className="w-8 h-8 mr-4"
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
                  Launch Campaign
                </>
              )}
            </button>
          </div>
        </div>

        {/* Enhanced Active Calls Section */}
        <div className="bg-white/80 backdrop-blur-xl p-10 rounded-2xl shadow-2xl border border-gray-200 hover:border-green-300 transition-all duration-500">
          <div className="flex items-center mb-8">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center mr-4 shadow-lg shadow-green-500/25">
              <svg
                className="w-7 h-7 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              Campaign Monitor
            </h2>
          </div>
          <div className="text-center py-20">
            <div className="relative w-24 h-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded-3xl mx-auto mb-6 flex items-center justify-center">
              <svg
                className="w-12 h-12 text-gray-500"
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
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-green-400 to-teal-400 rounded-full animate-ping"></div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-green-500 to-teal-500 rounded-full"></div>
            </div>
            <p className="text-gray-700 text-xl font-semibold mb-2">
              Ready for Real-Time Monitoring
            </p>
            <p className="text-gray-500 text-base mb-6">
              Live campaign analytics and call progress will appear here once
              your campaign launches
            </p>
            <div className="flex justify-center space-x-6 text-sm text-gray-400">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                <span>Queue Status</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span>Active Calls</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                <span>Success Rate</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
