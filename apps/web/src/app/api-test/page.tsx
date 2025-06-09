'use client';

import React, { useState } from 'react';

interface ApiResult {
  message: string;
  profile: {
    id: string;
    fullName: string;
    primaryPosition: string;
    highSchoolName: string;
    graduationYear: number;
    userId: string;
    createdAt: string;
    slug: string;
  };
}

export default function APITestPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    primaryPosition: '',
    highSchoolName: '',
    graduationYear: 2024,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ApiResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'graduationYear' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      // Using the correct API port 4000
      const response = await fetch('http://localhost:5000/api/profiles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">API Test Page</h1>
      <p className="mb-6 text-gray-600">Test profile creation API endpoint</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Create New Profile</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. John Smith"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Primary Position
              </label>
              <select
                name="primaryPosition"
                value={formData.primaryPosition}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Position</option>
                <option value="Quarterback">Quarterback</option>
                <option value="Running Back">Running Back</option>
                <option value="Wide Receiver">Wide Receiver</option>
                <option value="Tight End">Tight End</option>
                <option value="Offensive Line">Offensive Line</option>
                <option value="Defensive Line">Defensive Line</option>
                <option value="Linebacker">Linebacker</option>
                <option value="Cornerback">Cornerback</option>
                <option value="Safety">Safety</option>
                <option value="Kicker">Kicker</option>
                <option value="Punter">Punter</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                High School Name
              </label>
              <input
                type="text"
                name="highSchoolName"
                value={formData.highSchoolName}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Lincoln High School"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Graduation Year
              </label>
              <input
                type="number"
                name="graduationYear"
                value={formData.graduationYear}
                onChange={handleChange}
                required
                min="2020"
                max="2030"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating...' : 'Create Profile'}
            </button>
          </form>
        </div>

        {/* Results */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Results</h2>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <strong>Error:</strong> {error}
            </div>
          )}

          {result && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              <strong>Success!</strong> Profile created successfully.
              <pre className="mt-2 text-sm overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}

          <div className="text-sm text-gray-600 space-y-2">
            <h3 className="font-medium">API Reference:</h3>
            <p><strong>Endpoint:</strong> POST /api/profiles</p>
                          <p><strong>Base URL:</strong> http://localhost:5000</p>
            <p><strong>Expected Response:</strong> Profile object with ID</p>
          </div>
        </div>
      </div>
    </main>
  );
}