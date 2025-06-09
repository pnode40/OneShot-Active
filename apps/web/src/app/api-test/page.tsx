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

interface QRCodeResult {
  message: string;
  profile: {
    id: string;
    name: string;
    slug: string;
  };
  qrCode: {
    dataURL: string;
    profileUrl: string;
    format: string;
    size: string;
    downloadUrl: string;
  };
  usage: {
    description: string;
    instructions: string;
  };
}

export default function APITestPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    primaryPosition: '',
    highSchoolName: '',
    graduationYear: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ApiResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<QRCodeResult | null>(null);
  const [qrLoading, setQrLoading] = useState(false);

  // Calculate completeness percentage
  const calculateCompleteness = () => {
    const fields = [
      formData.fullName.trim(),
      formData.primaryPosition,
      formData.highSchoolName.trim(),
      formData.graduationYear ? formData.graduationYear.toString() : ''
    ];
    
    const filledFields = fields.filter(field => field !== '' && field !== '0').length;
    return Math.round((filledFields / fields.length) * 100);
  };

  const completeness = calculateCompleteness();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'graduationYear' ? (value ? parseInt(value) : '') : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResult(null);
    setQrCode(null);

    try {
      // Prepare form data with proper types
      const submitData = {
        ...formData,
        graduationYear: formData.graduationYear ? parseInt(formData.graduationYear.toString()) : 2024
      };

      const response = await fetch('http://localhost:5000/api/profiles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
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

  const generateQRCode = async (profileId: string) => {
    setQrLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/profiles/${profileId}/qr`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const qrData = await response.json();
      setQrCode(qrData);
    } catch (err) {
      setError(err instanceof Error ? `QR Generation Error: ${err.message}` : 'Failed to generate QR code');
    } finally {
      setQrLoading(false);
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
          
          {/* Completeness Meter */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Profile Completeness</span>
              <span className="text-sm font-bold text-blue-600">{completeness}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className={`h-3 rounded-full transition-all duration-300 ease-out ${
                  completeness < 25 ? 'bg-red-500' :
                  completeness < 50 ? 'bg-orange-500' :
                  completeness < 75 ? 'bg-yellow-500' :
                  completeness < 100 ? 'bg-blue-500' :
                  'bg-green-500'
                }`}
                style={{ width: `${completeness}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {completeness === 100 ? (
                <span className="text-green-600 font-medium">✅ Profile complete! Ready to submit.</span>
              ) : completeness >= 75 ? (
                <span className="text-blue-600">Almost there! Just a few more fields.</span>
              ) : completeness >= 50 ? (
                <span className="text-yellow-600">Good progress! Keep filling out your profile.</span>
              ) : completeness >= 25 ? (
                <span className="text-orange-600">Getting started! Fill out more details to increase visibility.</span>
              ) : (
                <span className="text-red-600">Start here! Complete your profile to improve recruiting chances.</span>
              )}
            </p>
          </div>

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
                placeholder="e.g. 2024"
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
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between bg-white bg-opacity-50 rounded p-2">
                  <span className="font-medium">Profile ID: {result.profile.id}</span>
                  <a 
                    href={`/athlete/${result.profile.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition"
                  >
                    View Profile →
                  </a>
                </div>
                <div className="flex items-center justify-between bg-white bg-opacity-50 rounded p-2">
                  <span className="font-medium">Slug: {result.profile.slug}</span>
                  <a 
                    href={`/athlete/${result.profile.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition"
                  >
                    View by Slug →
                  </a>
                </div>
                <div className="flex items-center justify-between bg-white bg-opacity-50 rounded p-2">
                  <span className="font-medium">📱 QR Code</span>
                  <button 
                    onClick={() => generateQRCode(result.profile.id)}
                    disabled={qrLoading}
                    className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700 transition disabled:bg-gray-400"
                  >
                    {qrLoading ? 'Generating...' : 'Generate QR →'}
                  </button>
                </div>
              </div>
              <details className="mt-3">
                <summary className="cursor-pointer text-sm font-medium">Show JSON Response</summary>
                <pre className="mt-2 text-xs overflow-auto bg-white bg-opacity-50 p-2 rounded">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </details>
            </div>
          )}

          {qrCode && (
            <div className="bg-purple-100 border border-purple-400 text-purple-700 px-4 py-3 rounded mb-4">
              <strong>🎯 QR Code Generated!</strong>
              <div className="mt-3 bg-white rounded-lg p-4">
                <div className="flex flex-col items-center space-y-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={qrCode.qrCode.dataURL} 
                    alt={`QR Code for ${qrCode.profile.name}`}
                    className="border-2 border-gray-300 rounded-lg"
                    width={200}
                    height={200}
                  />
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-800">{qrCode.profile.name}</p>
                    <p className="text-xs text-gray-600">{qrCode.usage.description}</p>
                    <p className="text-xs text-purple-600 mt-1">{qrCode.qrCode.profileUrl}</p>
                  </div>
                  <div className="flex space-x-2">
                    <a 
                      href={qrCode.qrCode.profileUrl}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition"
                    >
                      Test Link →
                    </a>
                    <a 
                      href={`http://localhost:5000${qrCode.qrCode.downloadUrl}`}
                      download
                      className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition"
                    >
                      Download QR ↓
                    </a>
                  </div>
                </div>
                <div className="mt-3 text-xs text-gray-500 border-t pt-2">
                  <strong>Usage:</strong> {qrCode.usage.instructions}
                </div>
              </div>
            </div>
          )}

          <div className="text-sm text-gray-600 space-y-2">
            <h3 className="font-medium">API Reference:</h3>
            <p><strong>Endpoint:</strong> POST /api/profiles</p>
            <p><strong>Base URL:</strong> http://localhost:5000</p>
            <p><strong>Expected Response:</strong> Profile object with ID</p>
            
            <div className="mt-4 pt-4 border-t border-gray-300">
              <h3 className="font-medium mb-2">Existing Test Profiles:</h3>
              <div className="space-y-1">
                <a 
                  href="/athlete/1" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block text-blue-600 hover:text-blue-800 underline"
                >
                  Jordan Davis (ID: 1) →
                </a>
                <a 
                  href="/athlete/2" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block text-blue-600 hover:text-blue-800 underline"
                >
                  Riley Smith (ID: 2) →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}