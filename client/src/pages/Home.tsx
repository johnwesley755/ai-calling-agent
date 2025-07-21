import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">
            AI-Powered Voice Calling Agent
          </h1>
          <p className="text-xl mb-8">
            Automate your calls with AI voice technology
          </p>

          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition duration-300"
            >
              Go to Dashboard
            </Link>
          ) : (
            <div className="flex justify-center space-x-4">
              <Link
                to="/login"
                className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition duration-300"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-gray-600 text-white px-6 py-3 rounded-md font-medium hover:bg-gray-700 transition duration-300"
              >
                Register
              </Link>
            </div>
          )}
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Automated Calling</h2>
            <p>
              Make multiple calls simultaneously with AI-powered voice
              technology
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">
              Natural Conversations
            </h2>
            <p>
              Our AI understands context and responds naturally to customer
              queries
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Detailed Analytics</h2>
            <p>
              Get insights from call transcripts, sentiment analysis, and more
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
