'use client'

import { useEffect, useState } from 'react'

export default function Home() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')

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

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white text-black">
      <h1 className="text-4xl font-bold mb-6">OneShot MVP Health Check</h1>

      {status === 'loading' && <p className="text-lg">⏳ Checking API status...</p>}
      {status === 'success' && <p className="text-green-600 text-xl">✅ API Connected Successfully!</p>}
      {status === 'error' && (
        <p className="text-red-600 text-xl">
          ❌ Failed to reach API at:
          <br />
          <code className="bg-gray-100 px-2 py-1 mt-2 block">
            {process.env.NEXT_PUBLIC_API_URL}/health
          </code>
        </p>
      )}
    </main>
  )
}
