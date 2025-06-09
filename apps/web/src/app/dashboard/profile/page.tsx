'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth, withAuth } from '@/lib/auth-context'
import Image from 'next/image'

// Zod validation schema
const athleteProfileSchema = z.object({
  // Identity & Academic Info
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  jerseyNumber: z.string().optional(),
  height: z.string().regex(/^\d+'(\d+")$/, 'Height must be in format: 6\'2"'),
  weight: z.number().min(50, 'Weight must be at least 50 lbs').max(500, 'Weight must be less than 500 lbs'),
  gpa: z.number().min(0.0).max(4.0, 'GPA must be between 0.0 and 4.0'),
  graduationYear: z.number().min(2024).max(2030, 'Graduation year must be between 2024 and 2030'),
  highSchoolName: z.string().min(2, 'High school name is required'),
  state: z.string().length(2, 'State must be 2-letter code (e.g., TX)'),
  
  // Positions
  primaryPosition: z.string().min(1, 'Primary position is required'),
  secondaryPosition: z.string().optional(),
  
  // Performance Metrics
  fortyYardDashSeconds: z.number().min(3.0).max(8.0).optional(),
  verticalJumpInches: z.number().min(10).max(60).optional(),
  broadJumpInches: z.number().min(50).max(200).optional(),
  benchPressLbs: z.number().min(50).max(800).optional(),
  squatLbs: z.number().min(50).max(1000).optional(),
  deadliftLbs: z.number().min(50).max(1000).optional(),
  
  // Media
  highlightVideoUrl: z.string().url().optional().or(z.literal('')),
  hudlVideoUrl: z.string().url().optional().or(z.literal('')),
  
  // Contact
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().regex(/^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/, 'Invalid phone number format'),
  twitterHandle: z.string().optional(),
  coachName: z.string().optional(),
  coachPhone: z.string().regex(/^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/, 'Invalid phone number format').optional().or(z.literal('')),
})

type AthleteProfileForm = z.infer<typeof athleteProfileSchema>

interface AthleteProfile extends AthleteProfileForm {
  id?: string
  profilePhoto?: string
  transcriptPdf?: string
}

// Football positions
const FOOTBALL_POSITIONS = [
  'QB', 'RB', 'WR', 'TE', 'OL', 'C', 'OG', 'OT',
  'DL', 'DE', 'DT', 'LB', 'ILB', 'OLB', 'DB', 'CB', 'S', 'FS', 'SS',
  'K', 'P', 'LS'
]

const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
]

export default withAuth(function AthleteProfilePage() {
  const { user, token } = useAuth()
  const [profile, setProfile] = useState<AthleteProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string | null>(null)
  const [profilePhotoFile, setProfilePhotoFile] = useState<File | null>(null)
  const [transcriptFile, setTranscriptFile] = useState<File | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<AthleteProfileForm>({
    resolver: zodResolver(athleteProfileSchema),
    defaultValues: {
      weight: 0,
      gpa: 0,
      graduationYear: new Date().getFullYear() + 1,
    }
  })

  // Fetch existing profile on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user || !token) return

      try {
        const response = await fetch('http://localhost:5000/api/athlete-profiles/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })

        if (response.ok) {
          const profileData = await response.json()
          setProfile(profileData)
          setIsEditMode(true)
          
          // Pre-fill form with existing data
          reset({
            fullName: profileData.fullName || '',
            jerseyNumber: profileData.jerseyNumber || '',
            height: profileData.height || '',
            weight: profileData.weight || 0,
            gpa: profileData.gpa || 0,
            graduationYear: profileData.graduationYear || new Date().getFullYear() + 1,
            highSchoolName: profileData.highSchoolName || '',
            state: profileData.state || '',
            primaryPosition: profileData.primaryPosition || '',
            secondaryPosition: profileData.secondaryPosition || '',
            fortyYardDashSeconds: profileData.fortyYardDashSeconds || undefined,
            verticalJumpInches: profileData.verticalJumpInches || undefined,
            broadJumpInches: profileData.broadJumpInches || undefined,
            benchPressLbs: profileData.benchPressLbs || undefined,
            squatLbs: profileData.squatLbs || undefined,
            deadliftLbs: profileData.deadliftLbs || undefined,
            highlightVideoUrl: profileData.highlightVideoUrl || '',
            hudlVideoUrl: profileData.hudlVideoUrl || '',
            email: profileData.email || user.email || '',
            phoneNumber: profileData.phoneNumber || '',
            twitterHandle: profileData.twitterHandle || '',
            coachName: profileData.coachName || '',
            coachPhone: profileData.coachPhone || '',
          })

          if (profileData.profilePhoto) {
            setProfilePhotoPreview(profileData.profilePhoto)
          }
        } else if (response.status === 404) {
          // No profile exists, show create form
          setIsEditMode(false)
          reset({
            email: user.email || '',
            graduationYear: new Date().getFullYear() + 1,
            weight: 150,
            gpa: 3.0,
          })
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
        setIsEditMode(false)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [user, token, reset])

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Profile photo must be less than 5MB')
        return
      }
      
      setProfilePhotoFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfilePhotoPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleTranscriptChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Transcript must be less than 5MB')
        return
      }
      if (file.type !== 'application/pdf') {
        alert('Transcript must be a PDF file')
        return
      }
      setTranscriptFile(file)
    }
  }

  const onSubmit = async (data: AthleteProfileForm) => {
    if (!user || !token) return

    setSaving(true)
    try {
      // Create FormData for file uploads
      const formData = new FormData()
      
      // Add all form fields
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          formData.append(key, value.toString())
        }
      })

      // Add files if present
      if (profilePhotoFile) {
        formData.append('profilePhoto', profilePhotoFile)
      }
      if (transcriptFile) {
        formData.append('transcriptPdf', transcriptFile)
      }

      const url = isEditMode 
        ? `http://localhost:5000/api/athlete-profiles/${profile?.id}`
        : 'http://localhost:5000/api/athlete-profiles'
      
      const method = isEditMode ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      })

      if (response.ok) {
        const savedProfile = await response.json()
        setProfile(savedProfile)
        setIsEditMode(true)
        alert(isEditMode ? 'Profile updated successfully!' : 'Profile created successfully!')
      } else {
        const errorData = await response.json()
        alert(`Error: ${errorData.message || 'Failed to save profile'}`)
      }
    } catch (error) {
      console.error('Error saving profile:', error)
      alert('Failed to save profile. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditMode ? 'Edit Your Profile' : 'Create Your Profile'}
            </h1>
            <p className="text-gray-600 mt-1">
              {isEditMode 
                ? 'Update your athlete profile information'
                : 'Fill out your athlete profile to get discovered by recruiters'
              }
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-8">
            {/* Profile Photo Section */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Photo</h2>
              <div className="flex items-center space-x-6">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-300">
                  {profilePhotoPreview ? (
                    <Image
                      src={profilePhotoPreview}
                      alt="Profile preview"
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block">
                    <span className="sr-only">Choose profile photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                </div>
              </div>
            </div>

            {/* Identity & Academic Info */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Identity & Academic Info</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    {...register('fullName')}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="John Doe"
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Jersey Number
                  </label>
                  <input
                    {...register('jerseyNumber')}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="12"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Height *
                  </label>
                  <input
                    {...register('height')}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="6'2&quot;"
                  />
                  {errors.height && (
                    <p className="text-red-500 text-sm mt-1">{errors.height.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Weight (lbs) *
                  </label>
                  <input
                    {...register('weight', { valueAsNumber: true })}
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="185"
                  />
                  {errors.weight && (
                    <p className="text-red-500 text-sm mt-1">{errors.weight.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    GPA *
                  </label>
                  <input
                    {...register('gpa', { valueAsNumber: true })}
                    type="number"
                    step="0.1"
                    min="0"
                    max="4.0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="3.5"
                  />
                  {errors.gpa && (
                    <p className="text-red-500 text-sm mt-1">{errors.gpa.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Graduation Year *
                  </label>
                  <input
                    {...register('graduationYear', { valueAsNumber: true })}
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="2025"
                  />
                  {errors.graduationYear && (
                    <p className="text-red-500 text-sm mt-1">{errors.graduationYear.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    High School Name *
                  </label>
                  <input
                    {...register('highSchoolName')}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Central High School"
                  />
                  {errors.highSchoolName && (
                    <p className="text-red-500 text-sm mt-1">{errors.highSchoolName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State *
                  </label>
                  <select
                    {...register('state')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select State</option>
                    {US_STATES.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                  {errors.state && (
                    <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>
                  )}
                </div>
              </div>

              {/* Transcript Upload */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Academic Transcript (PDF)
                </label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleTranscriptChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <p className="text-xs text-gray-500 mt-1">PDF files up to 5MB</p>
                {profile?.transcriptPdf && !transcriptFile && (
                  <p className="text-sm text-green-600 mt-1">
                    ✓ Current transcript on file
                  </p>
                )}
              </div>
            </div>

            {/* Positions */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Positions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Primary Position *
                  </label>
                  <select
                    {...register('primaryPosition')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Position</option>
                    {FOOTBALL_POSITIONS.map(position => (
                      <option key={position} value={position}>{position}</option>
                    ))}
                  </select>
                  {errors.primaryPosition && (
                    <p className="text-red-500 text-sm mt-1">{errors.primaryPosition.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Secondary Position
                  </label>
                  <select
                    {...register('secondaryPosition')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Position (Optional)</option>
                    {FOOTBALL_POSITIONS.map(position => (
                      <option key={position} value={position}>{position}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    40-Yard Dash (seconds)
                  </label>
                  <input
                    {...register('fortyYardDashSeconds', { valueAsNumber: true })}
                    type="number"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="4.5"
                  />
                  {errors.fortyYardDashSeconds && (
                    <p className="text-red-500 text-sm mt-1">{errors.fortyYardDashSeconds.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vertical Jump (inches)
                  </label>
                  <input
                    {...register('verticalJumpInches', { valueAsNumber: true })}
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="32"
                  />
                  {errors.verticalJumpInches && (
                    <p className="text-red-500 text-sm mt-1">{errors.verticalJumpInches.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Broad Jump (inches)
                  </label>
                  <input
                    {...register('broadJumpInches', { valueAsNumber: true })}
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="108"
                  />
                  {errors.broadJumpInches && (
                    <p className="text-red-500 text-sm mt-1">{errors.broadJumpInches.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bench Press (lbs)
                  </label>
                  <input
                    {...register('benchPressLbs', { valueAsNumber: true })}
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="225"
                  />
                  {errors.benchPressLbs && (
                    <p className="text-red-500 text-sm mt-1">{errors.benchPressLbs.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Squat (lbs)
                  </label>
                  <input
                    {...register('squatLbs', { valueAsNumber: true })}
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="315"
                  />
                  {errors.squatLbs && (
                    <p className="text-red-500 text-sm mt-1">{errors.squatLbs.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Deadlift (lbs)
                  </label>
                  <input
                    {...register('deadliftLbs', { valueAsNumber: true })}
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="405"
                  />
                  {errors.deadliftLbs && (
                    <p className="text-red-500 text-sm mt-1">{errors.deadliftLbs.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Media */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Media</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Highlight Video URL
                  </label>
                  <input
                    {...register('highlightVideoUrl')}
                    type="url"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://youtube.com/watch?v=..."
                  />
                  {errors.highlightVideoUrl && (
                    <p className="text-red-500 text-sm mt-1">{errors.highlightVideoUrl.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hudl Video URL
                  </label>
                  <input
                    {...register('hudlVideoUrl')}
                    type="url"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://hudl.com/video/..."
                  />
                  {errors.hudlVideoUrl && (
                    <p className="text-red-500 text-sm mt-1">{errors.hudlVideoUrl.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    {...register('email')}
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="john@example.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    {...register('phoneNumber')}
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="(555) 123-4567"
                  />
                  {errors.phoneNumber && (
                    <p className="text-red-500 text-sm mt-1">{errors.phoneNumber.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Twitter Handle
                  </label>
                  <input
                    {...register('twitterHandle')}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="@johndoe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Coach Name
                  </label>
                  <input
                    {...register('coachName')}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Coach Smith"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Coach Phone
                  </label>
                  <input
                    {...register('coachPhone')}
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="(555) 987-6543"
                  />
                  {errors.coachPhone && (
                    <p className="text-red-500 text-sm mt-1">{errors.coachPhone.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    {isEditMode ? 'Update Profile' : 'Create Profile'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}) 