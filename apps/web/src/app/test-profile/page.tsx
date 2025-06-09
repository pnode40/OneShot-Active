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
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face',
    highlights: 'https://youtube.com/watch?v=example2'
  }
]

export default function TestProfilePage() {
  const [selectedProfile, setSelectedProfile] = useState(testProfiles[0])

  const profileUrl = typeof window !== 'undefined' ? `${window.location.origin}/athlete/${selectedProfile.id}` : ''

  const generateVCard = () => {
    const vCard = `BEGIN:VCARD
VERSION:3.0
FN:${selectedProfile.fullName}
TEL:${selectedProfile.jerseyNumber ? `Jersey #${selectedProfile.jerseyNumber}` : ''}
EMAIL:${selectedProfile.fullName.toLowerCase().replace(' ', '.')}@example.com
ORG:${selectedProfile.school}
TITLE:${selectedProfile.position} - Class of ${selectedProfile.year}
URL:${profileUrl}
NOTE:Football Player Profile - OneShot Recruit
END:VCARD`

    const blob = new Blob([vCard], { type: 'text/vcard' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${selectedProfile.fullName.replace(' ', '_')}_contact.vcf`
    link.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">⚡ OneShot Team Testing</h1>
          <p className="text-lg text-gray-600">Quick athlete profile demo for the team</p>
        </div>

        {/* Profile Selector */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Select Test Profile:</h3>
          <div className="flex gap-4">
            {testProfiles.map(profile => (
              <button
                key={profile.id}
                onClick={() => setSelectedProfile(profile)}
                className={`px-4 py-2 rounded-md font-medium transition ${
                  selectedProfile.id === profile.id 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {profile.fullName}
              </button>
            ))}
          </div>
        </div>

        {/* Profile Display */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-8 text-center">
            <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden shadow-lg border-4 border-white">
              <Image 
                src={selectedProfile.photo} 
                alt={selectedProfile.fullName}
                width={128}
                height={128}
                className="w-full h-full object-cover"
              />
            </div>
            
            <h1 className="text-3xl font-bold mb-2">
              {selectedProfile.fullName} #{selectedProfile.jerseyNumber}
            </h1>
            <p className="text-xl mb-1">
              {selectedProfile.height} • {selectedProfile.weight} lbs • {selectedProfile.gpa} GPA
            </p>
            <p className="text-lg mb-1">
              Class of {selectedProfile.year} • {selectedProfile.position}
            </p>
            <p className="text-lg">
              {selectedProfile.school}
            </p>

            {/* QR Code Placeholder */}
            <div className="mt-6">
              <div className="bg-white text-blue-600 px-6 py-2 rounded-md font-medium inline-block">
                📱 QR Code (Coming Soon)
              </div>
              <p className="text-sm mt-2 opacity-75">QR functionality being optimized</p>
            </div>
          </div>

          {/* Performance Stats */}
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Performance Metrics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <h3 className="font-semibold text-gray-700">40-Yard Dash</h3>
                <p className="text-2xl font-bold text-blue-600">{selectedProfile.fortyTime}s</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <h3 className="font-semibold text-gray-700">Vertical Jump</h3>
                <p className="text-2xl font-bold text-green-600">{selectedProfile.verticalJump}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <h3 className="font-semibold text-gray-700">Bench Press</h3>
                <p className="text-2xl font-bold text-purple-600">{selectedProfile.benchPress}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-gray-50 p-6 border-t flex flex-wrap gap-4 justify-center">
            <button
              onClick={generateVCard}
              className="bg-green-600 text-white px-6 py-3 rounded-md font-medium hover:bg-green-700 transition"
            >
              📱 Download Contact Card
            </button>
            <a
              href={selectedProfile.highlights}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-red-600 text-white px-6 py-3 rounded-md font-medium hover:bg-red-700 transition"
            >
              🎥 View Highlights
            </a>
            <button
              onClick={() => navigator.share?.({
                title: `${selectedProfile.fullName} - Football Profile`,
                text: `Check out ${selectedProfile.fullName}'s football profile`,
                url: profileUrl
              })}
              className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition"
            >
              📤 Share Profile
            </button>
          </div>
        </div>

        {/* Testing Instructions */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">🧪 Testing Instructions</h3>
          <ul className="text-yellow-700 space-y-1">
            <li>• Switch between test profiles to see different data</li>
            <li>• Try downloading contact cards</li>
            <li>• Test sharing functionality</li>
            <li>• Check mobile responsiveness</li>
            <li>• QR codes will be added after initial testing</li>
          </ul>
        </div>
      </div>
    </div>
  )
} 