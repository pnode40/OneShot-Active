'use client';

import { useAuth, withAuth } from '../../lib/auth-context';
import Link from 'next/link';

function DashboardPage() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h1 className="ml-3 text-2xl font-bold text-gray-900">OneShot Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Welcome, <span className="font-medium">{user?.email}</span>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          
          {/* User Profile Card */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Profile</h3>
                <p className="text-sm text-gray-600">{user?.email}</p>
              </div>
            </div>
            <div className="mt-6">
              <p className="text-sm text-gray-500">
                Account created: {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                User ID: {user?.id}
              </p>
            </div>
            <div className="mt-6">
              <Link
                href="/dashboard/profile"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 transition"
              >
                Manage Profile
              </Link>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link
                href="/dashboard/profile"
                className="block w-full bg-green-600 text-white text-center px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition"
              >
                Athlete Profile
              </Link>
              <Link
                href="/athlete"
                className="block w-full bg-blue-600 text-white text-center px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition"
              >
                View Public Profile
              </Link>
              <Link
                href="/api-test"
                className="block w-full bg-purple-600 text-white text-center px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700 transition"
              >
                API Test Tools
              </Link>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="text-sm text-gray-600">
                <div className="flex items-center justify-between">
                  <span>Account created</span>
                  <span className="text-gray-400">
                    {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <div className="flex items-center justify-between">
                  <span>Last login</span>
                  <span className="text-gray-400">Today</span>
                </div>
              </div>
              <div className="border-t pt-3">
                <p className="text-sm text-gray-500">
                  More activity tracking coming soon...
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-blue-500 rounded-md flex items-center justify-center">
                  <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Profiles</p>
                <p className="text-2xl font-semibold text-gray-900">0</p>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-green-500 rounded-md flex items-center justify-center">
                  <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Profile Views</p>
                <p className="text-2xl font-semibold text-gray-900">0</p>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-purple-500 rounded-md flex items-center justify-center">
                  <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V6a1 1 0 00-1-1H5a1 1 0 00-1 1v1a1 1 0 001 1z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">QR Scans</p>
                <p className="text-2xl font-semibold text-gray-900">0</p>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-yellow-500 rounded-md flex items-center justify-center">
                  <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Connections</p>
                <p className="text-2xl font-semibold text-gray-900">0</p>
              </div>
            </div>
          </div>
        </div>

        {/* Getting Started */}
        <div className="mt-8 bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Getting Started</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <h4 className="text-md font-medium text-gray-900 mb-2">Create Your Profile</h4>
              <p className="text-sm text-gray-600 mb-3">
                Set up your athlete profile with photos, stats, and achievements.
              </p>
              <Link
                href="/athlete/create"
                className="text-blue-600 text-sm font-medium hover:text-blue-500"
              >
                Create Profile →
              </Link>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                <span className="text-green-600 font-bold">2</span>
              </div>
              <h4 className="text-md font-medium text-gray-900 mb-2">Generate QR Code</h4>
              <p className="text-sm text-gray-600 mb-3">
                Create a QR code that links directly to your profile.
              </p>
              <Link
                href="/qr-codes"
                className="text-green-600 text-sm font-medium hover:text-green-500"
              >
                Generate QR →
              </Link>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="h-8 w-8 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                <span className="text-purple-600 font-bold">3</span>
              </div>
              <h4 className="text-md font-medium text-gray-900 mb-2">Share & Connect</h4>
              <p className="text-sm text-gray-600 mb-3">
                Share your profile with coaches, scouts, and teammates.
              </p>
              <Link
                href="/share"
                className="text-purple-600 text-sm font-medium hover:text-purple-500"
              >
                Learn More →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAuth(DashboardPage);