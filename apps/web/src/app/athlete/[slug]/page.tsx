'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Profile {
  id: string
  fullName: string
  primaryPosition: string
  highSchoolName: string
  graduationYear: number
  userId: string
  createdAt: string
  slug: string
  // Add more fields as needed
}

interface ProfileResponse {
  profile: Profile
  hasGeneratedHtml: boolean
  htmlUrl: string | null
}

interface QRCodeResult {
  message: string
  profile: {
    id: string
    name: string
    slug: string
  }
  qrCode: {
    dataURL: string
    profileUrl: string
    format: string
    size: string
    downloadUrl: string
  }
  usage: {
    description: string
    instructions: string
  }
}

export default function AthletePage({ params }: { params: Promise<{ slug: string }> }) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [qrCode, setQrCode] = useState<QRCodeResult | null>(null)
  const [qrLoading, setQrLoading] = useState(false)
  const [slug, setSlug] = useState<string>('')

  const generateQRCode = async (profileId: string) => {
    setQrLoading(true)
    try {
      const response = await fetch(`http://localhost:5000/api/profiles/${profileId}/qr`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const qrData = await response.json()
      setQrCode(qrData)
    } catch (err) {
      setError(err instanceof Error ? `QR Generation Error: ${err.message}` : 'Failed to generate QR code')
    } finally {
      setQrLoading(false)
    }
  }

  useEffect(() => {
    const initParams = async () => {
      const resolvedParams = await params
      setSlug(resolvedParams.slug)
    }
    initParams()
  }, [params])

  useEffect(() => {
    if (!slug) return
    
    const fetchProfile = async () => {
      try {
        // Try to fetch by ID first, then by slug if that fails
        const res = await fetch(`http://localhost:5000/api/profiles/${slug}`)
        
        // If fetching by ID/slug fails and it's not a number, try to find by slug in all profiles
        if (!res.ok && isNaN(Number(slug))) {
          const allProfilesRes = await fetch('http://localhost:5000/api/profiles')
          if (allProfilesRes.ok) {
            const allData = await allProfilesRes.json()
            const matchingProfile = allData.profiles.find((p: Profile) => p.slug === slug)
            if (matchingProfile) {
              setProfile(matchingProfile)
              return
            }
          }
        }
        
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error('Profile not found')
          }
          throw new Error('Failed to fetch profile')
        }
        
        const data: ProfileResponse = await res.json()
        setProfile(data.profile)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
        console.error('Error fetching profile:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading athlete profile...</p>
        </div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
          <div className="text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="mt-4 text-xl font-bold text-gray-900">Profile Not Found</h2>
            <p className="mt-2 text-gray-600">The athlete profile you&apos;re looking for doesn&apos;t exist or has been removed.</p>
            <div className="mt-6 space-x-4">
              <Link href="/api-test" className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Create New Profile
              </Link>
              <Link href="/" className="inline-block px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link href="/api-test" className="text-blue-600 hover:text-blue-800 font-medium">
              ← Back to API Test
            </Link>
            <div className="text-sm text-gray-500">
              Profile ID: {profile.id} • Created: {new Date(profile.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center">
            <div className="w-32 h-32 bg-white rounded-full overflow-hidden border-4 border-white shadow-xl mb-6 md:mb-0 md:mr-8">
              {/* Profile Image Placeholder */}
              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <span className="text-3xl font-bold text-white">{profile.fullName.charAt(0)}</span>
              </div>
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-4xl font-bold mb-3">{profile.fullName}</h1>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <span className="inline-block bg-blue-800 bg-opacity-50 rounded-full px-4 py-2 text-sm font-medium">
                  {profile.primaryPosition}
                </span>
                <span className="inline-block bg-blue-800 bg-opacity-50 rounded-full px-4 py-2 text-sm font-medium">
                  {profile.highSchoolName}
                </span>
                <span className="inline-block bg-blue-800 bg-opacity-50 rounded-full px-4 py-2 text-sm font-medium">
                  Class of {profile.graduationYear}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Highlight Video */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">Highlight Video</h2>
              </div>
              <div className="p-6">
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <svg className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <p className="text-gray-500 font-medium">Highlight video coming soon</p>
                    <p className="text-sm text-gray-400 mt-1">Video content will be available once uploaded</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bio/Description */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">About {profile.fullName}</h2>
              </div>
              <div className="p-6">
                <p className="text-gray-700 leading-relaxed">
                  {profile.fullName} is a standout {profile.primaryPosition} at {profile.highSchoolName}, set to graduate in {profile.graduationYear}. 
                  Known for exceptional athletic ability and strong academic performance, {profile.fullName.split(' ')[0]} brings dedication and 
                  leadership both on and off the field. This profile showcases their achievements and potential for the next level.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Player Info Card */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Player Information</h2>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Full Name</h3>
                    <p className="mt-1 text-lg font-semibold text-gray-900">{profile.fullName}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Position</h3>
                    <p className="mt-1 text-lg font-semibold text-gray-900">{profile.primaryPosition}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">School</h3>
                    <p className="mt-1 text-lg font-semibold text-gray-900">{profile.highSchoolName}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Graduation Year</h3>
                    <p className="mt-1 text-lg font-semibold text-gray-900">{profile.graduationYear}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Profile Created</h3>
                    <p className="mt-1 text-lg font-semibold text-gray-900">{new Date(profile.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* QR Code Sharing */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">📱 Share Profile</h2>
              </div>
              <div className="p-6">
                {!qrCode ? (
                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 16h4.01M12 16h4.01M16 20h4.01M12 20h4.01M8 16h4.01M4 12h4.01M4 16h4.01M4 20h4.01" />
                      </svg>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">Generate a QR code to easily share this profile</p>
                    <button 
                      onClick={() => generateQRCode(profile.id)}
                      disabled={qrLoading}
                      className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition disabled:bg-gray-400 font-medium"
                    >
                      {qrLoading ? 'Generating...' : 'Generate QR Code'}
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <img 
                      src={qrCode.qrCode.dataURL} 
                      alt={`QR Code for ${qrCode.profile.name}`}
                      className="w-32 h-32 mx-auto border-2 border-gray-300 rounded-lg mb-4"
                    />
                    <p className="text-sm font-medium text-gray-800 mb-2">{qrCode.usage.description}</p>
                    <p className="text-xs text-gray-500 mb-4">{qrCode.usage.instructions}</p>
                    <div className="space-y-2">
                      <a 
                        href={`http://localhost:5000${qrCode.qrCode.downloadUrl}`}
                        download
                        className="block w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition text-sm font-medium"
                      >
                        Download QR Code
                      </a>
                      <button 
                        onClick={() => setQrCode(null)}
                        className="block w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition text-sm font-medium"
                      >
                        Generate New QR
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Achievements & Recognition</h2>
              </div>
              <div className="p-6">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">Team Captain & Leadership Role</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">All-Conference Selection</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">Academic Honor Roll</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">Varsity Letter Recipient</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Contact/Action Button */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Interested in recruiting {profile.fullName.split(' ')[0]}?</h3>
              <p className="text-blue-700 text-sm mb-4">
                Get in touch to learn more about this exceptional student-athlete.
              </p>
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 font-medium">
                Request More Information
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 