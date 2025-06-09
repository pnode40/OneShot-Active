'use client'

import { useState } from 'react'
import Image from 'next/image'

const testProfiles = [
  {
    id: '1',
    fullName: 'Test Player 1',
    jerseyNumber: '12',
    height: '6\'2"',
    weight: 185,
    position: 'WR',
    school: 'Lincoln High',
    year: '2025',
    gpa: '3.8',
    fortyTime: '4.45',
    verticalJump: '32"',
    benchPress: '225 lbs',
    photo: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop&crop=face',
    highlights: 'https://youtube.com/watch?v=example1'
  },
  {
    id: '2', 
    fullName: 'Test Player 2',
    jerseyNumber: '24',
    height: '5\'11"',
    weight: 175,
    position: 'DB',
    school: 'Central High',
    year: '2026',
    gpa: '3.9',
    fortyTime: '4.38',
    verticalJump: '34"',
    benchPress: '205 lbs',
    photo: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop&crop=face',
    highlights: 'https://youtube.com/watch?v=example2'
  }
]

export default function TestProfilePage() {
  const [selectedProfile, setSelectedProfile] = useState(testProfiles[0])

  const generateVCard = (profile: typeof testProfiles[0]) => {
    const vCard = `BEGIN:VCARD
VERSION:3.0
FN:${profile.fullName}
ORG:${profile.school}
TITLE:${profile.position} #${profile.jerseyNumber}
NOTE:Height: ${profile.height}, Weight: ${profile.weight}lbs, 40-yard: ${profile.fortyTime}s, Vertical: ${profile.verticalJump}, Bench: ${profile.benchPress}, GPA: ${profile.gpa}, Class of ${profile.year}
URL:${profile.highlights}
END:VCARD`

    const blob = new Blob([vCard], { type: 'text/vcard' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${profile.fullName.replace(/\s+/g, '_')}_football_profile.vcf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  const shareProfile = () => {
    if (navigator.share) {
      navigator.share({
        title: `${selectedProfile.fullName} - Football Profile`,
        text: `Check out ${selectedProfile.fullName}'s football profile - ${selectedProfile.position} #${selectedProfile.jerseyNumber} from ${selectedProfile.school}`,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Profile link copied to clipboard!')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">OneShot Team Testing</h1>
          <p className="text-gray-600">Football recruitment profiles for testing</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Player Selector */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Select Test Player</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {testProfiles.map((profile) => (
              <button
                key={profile.id}
                onClick={() => setSelectedProfile(profile)}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  selectedProfile.id === profile.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-semibold">{profile.fullName}</div>
                <div className="text-sm text-gray-600">
                  {profile.position} #{profile.jerseyNumber} • {profile.school}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Profile Display */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white p-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg flex-shrink-0">
                <Image
                  src={selectedProfile.photo}
                  alt={selectedProfile.fullName}
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-3xl font-bold">{selectedProfile.fullName}</h1>
                <div className="text-xl opacity-90">#{selectedProfile.jerseyNumber} • {selectedProfile.position}</div>
                <div className="text-lg opacity-80">{selectedProfile.school} • Class of {selectedProfile.year}</div>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Performance Metrics</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg text-center">
                <div className="text-sm text-gray-600">Height</div>
                <div className="font-semibold">{selectedProfile.height}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg text-center">
                <div className="text-sm text-gray-600">Weight</div>
                <div className="font-semibold">{selectedProfile.weight} lbs</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg text-center">
                <div className="text-sm text-gray-600">40-Yard</div>
                <div className="font-semibold">{selectedProfile.fortyTime}s</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg text-center">
                <div className="text-sm text-gray-600">Vertical</div>
                <div className="font-semibold">{selectedProfile.verticalJump}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg text-center">
                <div className="text-sm text-gray-600">Bench</div>
                <div className="font-semibold">{selectedProfile.benchPress}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg text-center">
                <div className="text-sm text-gray-600">GPA</div>
                <div className="font-semibold">{selectedProfile.gpa}</div>
              </div>
            </div>
          </div>

          {/* Actions Section */}
          <div className="p-6 bg-gray-50 border-t">
            <h2 className="text-xl font-semibold mb-4">Actions</h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => generateVCard(selectedProfile)}
                className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                📱 Download Contact Card
              </button>
              <button
                onClick={shareProfile}
                className="flex-1 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                🔗 Share Profile
              </button>
              <a
                href={selectedProfile.highlights}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium text-center"
              >
                🎥 Watch Highlights
              </a>
            </div>
          </div>
        </div>

        {/* Testing Notes */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-800 mb-2">🏈 Team Testing Instructions</h3>
          <ul className="text-yellow-700 space-y-1 text-sm">
            <li>• Test profile switching between players</li>
            <li>• Download contact cards on mobile devices</li>
            <li>• Test share functionality</li>
            <li>• Check mobile responsiveness</li>
            <li>• Report any issues or feedback</li>
          </ul>
        </div>
      </div>
    </div>
  )
} 