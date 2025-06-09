'use client'

import { useEffect, useState } from 'react'
import { notFound } from 'next/navigation'

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

export default function AthletePage({ params }: { params: { slug: string } }) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Check if we're looking for test-player specifically
        const profileId = params.slug === 'test-player' ? '1' : params.slug;
        
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profiles/${profileId}`)
        
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
  }, [params.slug])

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
            <p className="mt-2 text-gray-600">The athlete profile you're looking for doesn't exist or has been removed.</p>
            <a href="/" className="mt-6 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Back to Home
            </a>
          </div>
        </div>
      </div>
    )
  }

  // Convert YouTube URL to embedded format if needed
  const getEmbeddedVideoUrl = (url: string) => {
    if (!url) return null
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1]?.split('&')[0]
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`
      }
    }
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0]
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`
      }
    }
    return url
  }

  // Placeholder for video URL (we would get this from the API in a real app)
  const videoUrl = getEmbeddedVideoUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center">
            <div className="w-32 h-32 bg-white rounded-full overflow-hidden border-4 border-white shadow-xl mb-6 md:mb-0 md:mr-8">
              {/* Profile Image Placeholder */}
              <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                <span className="text-3xl font-bold text-gray-500">{profile.fullName.charAt(0)}</span>
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold">{profile.fullName}</h1>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="inline-block bg-blue-800 bg-opacity-50 rounded-full px-3 py-1 text-sm">
                  {profile.primaryPosition}
                </span>
                <span className="inline-block bg-blue-800 bg-opacity-50 rounded-full px-3 py-1 text-sm">
                  {profile.highSchoolName}
                </span>
                <span className="inline-block bg-blue-800 bg-opacity-50 rounded-full px-3 py-1 text-sm">
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
          <div className="lg:col-span-2">
            {/* Highlight Video */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
              <div className="p-4 border-b">
                <h2 className="text-xl font-bold">Highlight Video</h2>
              </div>
              <div className="aspect-w-16 aspect-h-9">
                {videoUrl ? (
                  <iframe
                    src={videoUrl}
                    className="w-full h-full"
                    style={{ aspectRatio: '16/9' }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <p className="text-gray-500">No highlight video available</p>
                  </div>
                )}
              </div>
            </div>

            {/* Bio/Description */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
              <div className="p-4 border-b">
                <h2 className="text-xl font-bold">About {profile.fullName}</h2>
              </div>
              <div className="p-6">
                <p className="text-gray-700">
                  {/* Sample bio text - would come from API in real implementation */}
                  {profile.fullName} is a {profile.primaryPosition} at {profile.highSchoolName} and is set to graduate in {profile.graduationYear}. 
                  They are known for their exceptional athletic ability and academic excellence.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div>
            {/* Player Info Card */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
              <div className="p-4 border-b">
                <h2 className="text-xl font-bold">Player Information</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                    <p className="mt-1 text-base font-semibold">{profile.fullName}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Position</h3>
                    <p className="mt-1 text-base font-semibold">{profile.primaryPosition}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">School</h3>
                    <p className="mt-1 text-base font-semibold">{profile.highSchoolName}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Graduation Year</h3>
                    <p className="mt-1 text-base font-semibold">{profile.graduationYear}</p>
                  </div>
                  {/* More athlete details would go here */}
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 border-b">
                <h2 className="text-xl font-bold">Achievements</h2>
              </div>
              <div className="p-6">
                <ul className="space-y-2">
                  {/* Sample achievements - would come from API in real implementation */}
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Team Captain</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>All-State Selection</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Academic Honor Roll</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 