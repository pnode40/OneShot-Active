'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import QRCode from 'qrcode'

interface Profile {
  id: string
  fullName: string
  jerseyNumber?: string
  height: string
  weight: number
  gpa: number
  graduationYear: number
  primaryPosition: string
  secondaryPosition?: string
  highSchoolName: string
  state: string
  bio?: string
  email?: string
  phone?: string
  phoneNumber?: string
  twitterHandle?: string
  twitter?: string
  coachName?: string
  coachPhone?: string
  photo?: string
  transcriptPdf?: string
  highlightVideoUrl?: string
  hudlVideoUrl?: string
  fortyYardDashSeconds?: number
  performanceMetrics?: {
    speedAgility?: {
      verticalJump?: number
      broadJump?: string | number
      twentyYardShuttle?: number
      threeConeDrill?: number
      fortyYardDash?: number
    }
    strength?: {
      benchPress?: number
      squat?: number
      deadlift?: number
      powerClean?: number
    }
  }
  // Legacy fields for backwards compatibility
  vertical?: number
  broadJump?: number | string
  proAgility?: number
  benchPress?: number
  squat?: number
  deadlift?: number
  userId: string
  createdAt: string
  slug: string
}

interface ProfileResponse {
  profile: Profile
  hasGeneratedHtml: boolean
  htmlUrl: string | null
}

// Mock data matching comprehensive-profile.json structure
const mockProfile: Profile = {
  id: "jordan-davis",
  fullName: "Jordan Davis",
  jerseyNumber: "12",
  height: "6'2\"",
  weight: 185,
  primaryPosition: "Wide Receiver",
  secondaryPosition: "Safety",
  highSchoolName: "Lincoln High School",
  state: "CA",
  graduationYear: 2025,
  email: "jordan.davis@example.com",
  phone: "(555) 123-4567",
  gpa: 3.8,
  photo: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop&crop=face",
  bio: "Dedicated wide receiver with exceptional route-running ability and reliable hands. Known for clutch performances in high-pressure situations and strong academic achievement.",
  fortyYardDashSeconds: 4.4,
  performanceMetrics: {
    speedAgility: {
      verticalJump: 32,
      broadJump: "9'6\"",
      twentyYardShuttle: 4.32,
      threeConeDrill: 6.8,
      fortyYardDash: 4.4
    },
    strength: {
      benchPress: 225,
      squat: 315,
      deadlift: 405,
      powerClean: 185
    }
  },
  highlightVideoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  hudlVideoUrl: "https://hudl.com/video/example",
  twitterHandle: "@jordandavis12",
  coachName: "Coach Mike Thompson",
  coachPhone: "(555) 987-6543",
  transcriptPdf: "/uploads/transcripts/jordan-davis-transcript.pdf",
  userId: "1",
  createdAt: new Date().toISOString(),
  slug: "jordan-davis"
}

export default function AthletePage({ params }: { params: Promise<{ slug: string }> }) {
  return <AthletePageClientWrapper params={params} />
}

function AthletePageClientWrapper({ params }: { params: Promise<{ slug: string }> }) {
  const [slug, setSlug] = useState<string>('')
  
  useEffect(() => {
    params.then(({ slug }) => setSlug(slug))
  }, [params])
  
  if (!slug) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading...</p>
        </div>
      </div>
    )
  }
  
  return <AthletePageClient slug={slug} />
}

function AthletePageClient({ slug }: { slug: string }) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('')

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Try to fetch from API first
        try {
          const res = await fetch(`http://localhost:5000/api/profiles/${slug}`)
          
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
          
          if (res.ok) {
            const data: ProfileResponse = await res.json()
            setProfile(data.profile)
            return
          }
        } catch (apiError) {
          console.log('API fetch failed, using mock data:', apiError)
        }
        
        // Fallback to mock data if API fails
        setProfile(mockProfile)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
        console.error('Error fetching profile:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [slug])

  useEffect(() => {
    // Generate QR code
    if (profile) {
      const profileUrl = typeof window !== 'undefined' ? `${window.location.origin}/athlete/${profile.id}` : ''
      QRCode.toDataURL(profileUrl, { width: 200, margin: 2 })
        .then(url => setQrCodeUrl(url))
        .catch(err => console.error('QR code generation failed:', err))
    }
  }, [profile])

  const generateVCard = () => {
    if (!profile) return

    const {
      fullName,
      jerseyNumber,
      phone,
      phoneNumber,
      email,
      twitterHandle,
      twitter,
      highSchoolName,
      primaryPosition,
      secondaryPosition,
      graduationYear,
      coachName,
      coachPhone,
      photo,
    } = profile

    const contactPhone = phone || phoneNumber
    const socialHandle = twitterHandle || twitter
    const positions = secondaryPosition 
      ? `${primaryPosition} / ${secondaryPosition}` 
      : primaryPosition
    const athleteNameWithJersey = jerseyNumber 
      ? `${fullName} #${jerseyNumber}` 
      : fullName
    const profileUrl = `${window.location.origin}/athlete/${slug}`

    const vCardContent = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${athleteNameWithJersey}`,
      `N:${fullName.split(' ').reverse().join(';')}`,
      contactPhone ? `TEL;TYPE=CELL:${contactPhone}` : null,
      email ? `EMAIL:${email}` : null,
      `ORG:${highSchoolName}`,
      `TITLE:${positions} - Class of ${graduationYear}`,
      socialHandle ? `X-TWITTER:${socialHandle}` : null,
      photo ? `PHOTO;VALUE=URL:${photo}` : null,
      `URL:${profileUrl}`,
      `X-ONESHOT-PROFILE:${profileUrl}`,
      coachName && coachPhone ? `NOTE:Head Coach: ${coachName} - ${coachPhone}` : null,
      'NOTE:Athlete profile powered by OneShot (https://oneshotrecruit.com)',
      'END:VCARD',
    ]
      .filter(line => line !== null)
      .join('\r\n')

    const blob = new Blob([vCardContent], { type: 'text/vcard' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${fullName.replace(/\s+/g, '-')}-contact.vcf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  const extractYouTubeId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
    return match ? match[1] : null
  }

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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h2 className="mt-4 text-xl font-semibold text-gray-900">Athlete Not Found</h2>
            <p className="mt-2 text-gray-600">
              {error || "We couldn't find the athlete profile you're looking for."}
            </p>
            <div className="mt-6">
              <Link
                href="/"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Return Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Extract performance data with fallbacks
  const verticalJump = profile.performanceMetrics?.speedAgility?.verticalJump || profile.vertical
  const broadJump = profile.performanceMetrics?.speedAgility?.broadJump || profile.broadJump
  const twentyYardShuttle = profile.performanceMetrics?.speedAgility?.twentyYardShuttle || profile.proAgility
  const benchPress = profile.performanceMetrics?.strength?.benchPress || profile.benchPress
  const squat = profile.performanceMetrics?.strength?.squat || profile.squat
  const deadlift = profile.performanceMetrics?.strength?.deadlift || profile.deadlift

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ✅ Section 1: Hero Section (Above the Fold) */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Profile Photo */}
            <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden shadow-lg">
              {profile.photo ? (
                <Image 
                  src={profile.photo} 
                  alt={profile.fullName}
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <span className="text-3xl font-bold text-white">
                    {profile.fullName.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            {/* Line 1: Name + Jersey */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              {profile.fullName}
              {profile.jerseyNumber && (
                <span className="text-blue-600"> #{profile.jerseyNumber}</span>
              )}
            </h1>

            {/* Line 2: Physical Stats */}
            <p className="text-lg text-gray-700 mb-2">
              {profile.height} • {profile.weight} lbs • {profile.gpa} GPA
            </p>

            {/* Line 3: Class + Position */}
            <p className="text-lg text-gray-700 mb-2">
              Class of {profile.graduationYear} • {profile.primaryPosition}
              {profile.secondaryPosition && ` / ${profile.secondaryPosition}`}
            </p>

            {/* Line 4: School + Transcript */}
            <div className="text-lg text-gray-700 mb-6 flex items-center justify-center gap-2 flex-wrap">
              <span>{profile.highSchoolName}, {profile.state}</span>
              {profile.transcriptPdf && (
                <>
                  <span>•</span>
                  <a 
                    href={profile.transcriptPdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    Academic Transcript
                  </a>
                </>
              )}
            </div>

            {/* Line 5: QR Code */}
            <div className="mx-auto mt-4">
              {qrCodeUrl ? (
                <div className="bg-white p-4 rounded-lg shadow-lg">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={qrCodeUrl} 
                    alt="Profile QR Code" 
                    className="w-32 h-32"
                    width={128}
                    height={128}
                  />
                  <p className="text-gray-600 text-sm mt-2">Scan to view profile</p>
                </div>
              ) : (
                <div className="bg-white p-4 rounded-lg shadow-lg w-40 h-40 flex items-center justify-center">
                  <p className="text-gray-600 text-sm">Loading QR...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 🎥 Section 2: Media */}
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Highlight Video */}
          {profile.highlightVideoUrl && (
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">🎥 Highlight Video</h2>
              </div>
              <div className="p-6">
                {extractYouTubeId(profile.highlightVideoUrl) ? (
                  <div className="aspect-video">
                    <iframe
                      className="w-full h-full rounded-lg"
                      src={`https://www.youtube.com/embed/${extractYouTubeId(profile.highlightVideoUrl)}`}
                      title="Highlight Video"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <svg className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <p className="text-gray-500 font-medium">Highlight video available</p>
                      <a 
                        href={profile.highlightVideoUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline text-sm"
                      >
                        View External Video
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Hudl Video */}
          {profile.hudlVideoUrl && (
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-900">🎬 Hudl Video</h3>
              </div>
              <div className="p-6">
                <div className="aspect-video bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg flex items-center justify-center border-2 border-dashed border-orange-200">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="h-10 w-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                    <p className="text-gray-700 font-medium mb-2">Hudl Game Film</p>
                    <a 
                      href={profile.hudlVideoUrl}
                      target="_blank"
                      rel="noopener noreferrer" 
                      className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                    >
                      Watch on Hudl
                      <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ⚡ Section 3: Performance Metrics */}
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">⚡ Performance Metrics</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column - Speed & Agility */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Speed & Agility</h3>
                <div className="space-y-4">
                  {profile.fortyYardDashSeconds && (
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-700">40-Yard Dash</span>
                      <span className="text-xl font-bold text-blue-600">{profile.fortyYardDashSeconds}s</span>
                    </div>
                  )}
                  {verticalJump && (
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-700">Vertical Jump</span>
                      <span className="text-xl font-bold text-blue-600">{verticalJump}&quot;</span>
                    </div>
                  )}
                  {broadJump && (
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-700">Broad Jump</span>
                      <span className="text-xl font-bold text-blue-600">{broadJump}</span>
                    </div>
                  )}
                  {twentyYardShuttle && (
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-700">20-Yard Shuttle</span>
                      <span className="text-xl font-bold text-blue-600">{twentyYardShuttle}s</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column - Strength & Power */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Strength & Power</h3>
                <div className="space-y-4">
                  {benchPress && (
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-700">Bench Press</span>
                      <span className="text-xl font-bold text-red-600">{benchPress} lbs</span>
                    </div>
                  )}
                  {squat && (
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-700">Squat</span>
                      <span className="text-xl font-bold text-red-600">{squat} lbs</span>
                    </div>
                  )}
                  {deadlift && (
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-700">Deadlift</span>
                      <span className="text-xl font-bold text-red-600">{deadlift} lbs</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 📇 Section 4: vCard Export */}
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">📇 Contact Information</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                {profile.email && (
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-gray-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                    <a href={`mailto:${profile.email}`} className="text-blue-600 hover:text-blue-800">
                      {profile.email}
                    </a>
                  </div>
                )}
                {(profile.phone || profile.phoneNumber) && (
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-gray-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="text-gray-700">{profile.phone || profile.phoneNumber}</span>
                  </div>
                )}
                {(profile.twitterHandle || profile.twitter) && (
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-gray-400 mr-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                    <a 
                      href={`https://twitter.com/${(profile.twitterHandle || profile.twitter)?.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {profile.twitterHandle || profile.twitter}
                    </a>
                  </div>
                )}
              </div>
              
              <div className="space-y-3">
                {profile.coachName && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Coach Contact</h4>
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-gray-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="text-gray-700">{profile.coachName}</span>
                    </div>
                    {profile.coachPhone && (
                      <div className="flex items-center mt-1">
                        <svg className="h-5 w-5 text-gray-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span className="text-gray-700">{profile.coachPhone}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
              <button
                onClick={generateVCard}
                className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
              >
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download vCard
              </button>
              <p className="text-sm text-gray-500 mt-2">
                Save contact info to your phone or recruiting database
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bio Section (if available) */}
      {profile.bio && (
        <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">📝 Player Bio</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-700 leading-relaxed text-lg">{profile.bio}</p>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center text-gray-500 text-sm">
          <p>Profile powered by <span className="font-semibold">OneShot</span></p>
          <div className="mt-2 space-x-4">
            <Link href="/dashboard" className="text-blue-600 hover:text-blue-800">
              Back to Dashboard
            </Link>
            <Link href="/" className="text-blue-600 hover:text-blue-800">
              OneShot Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 