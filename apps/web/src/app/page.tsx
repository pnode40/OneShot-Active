'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '../lib/auth-context'
import Link from 'next/link'

export default function Home() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const { isAuthenticated, user, logout } = useAuth()

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/health`)
        if (res.ok) {
          setStatus('success')
        } else {
          setStatus('error')
        }
      } catch {
        setStatus('error')
      }
    }

    checkHealth()
  }, [])

  const handleLogout = () => {
    logout()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">OneShot</span>
            </div>
            
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <span className="text-sm text-gray-600">Welcome, {user?.email}</span>
                  <Link
                    href="/dashboard"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-gray-600 hover:text-gray-900 text-sm font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-gray-600 hover:text-gray-900 text-sm font-medium"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Showcase Your Athletic
            <span className="text-blue-600"> Journey</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Create professional athlete profiles with QR codes. Share your stats, achievements, 
            and highlights with coaches, scouts, and fans instantly.
          </p>
          
          {isAuthenticated ? (
            <div className="space-x-4">
              <Link
                href="/dashboard"
                className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition"
              >
                Go to Dashboard
              </Link>
              <Link
                href="/athlete/create"
                className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-green-700 transition"
              >
                Create Profile
              </Link>
            </div>
          ) : (
            <div className="space-x-4">
              <Link
                href="/register"
                className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition"
              >
                Get Started Free
              </Link>
              <Link
                href="/login"
                className="inline-block border border-gray-300 text-gray-700 px-8 py-3 rounded-lg text-lg font-medium hover:bg-gray-50 transition"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>

        {/* API Status */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-lg shadow-sm p-6 max-w-md mx-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-4">System Status</h3>
            {status === 'loading' && (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-500 mr-2"></div>
                <span className="text-gray-600">Checking API status...</span>
              </div>
            )}
            {status === 'success' && (
              <div className="flex items-center justify-center text-green-600">
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>API Connected Successfully!</span>
              </div>
            )}
            {status === 'error' && (
              <div className="text-red-600">
                <div className="flex items-center justify-center mb-2">
                  <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>Failed to reach API</span>
                </div>
                <code className="bg-gray-100 text-gray-800 px-2 py-1 text-sm rounded">
                  {process.env.NEXT_PUBLIC_API_URL}/health
                </code>
              </div>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Professional Profiles</h3>
            <p className="text-gray-600">Create stunning athlete profiles with photos, stats, and achievements.</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V6a1 1 0 00-1-1H5a1 1 0 00-1 1v1a1 1 0 001 1z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">QR Code Sharing</h3>
            <p className="text-gray-600">Generate QR codes that link directly to your profile for instant sharing.</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Track Performance</h3>
            <p className="text-gray-600">Monitor profile views, connections, and engagement analytics.</p>
          </div>
        </div>
      </main>
    </div>
  )
}
