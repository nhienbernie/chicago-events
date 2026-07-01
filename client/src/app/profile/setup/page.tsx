'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function ProfileSetupPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [username, setUsername] = useState('')
  const [orgUrl, setOrgUrl] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.push('/')
      setUser(session?.user)
    })
  }, [router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    const { error } = await supabase
      .from('users')
      .update({ username, org_url: orgUrl || null })
      .eq('id', user.id)

    if (error) {
      if (error.message.includes('unique')) {
        setError('That username is already taken. Try another.')
      } else {
        setError(error.message)
      }
      setSubmitting(false)
      return
    }

    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-xl border border-gray-200 p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Set up your profile</h1>
        <p className="text-gray-500 text-sm mb-6">Choose a username so people know who posted your events.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
              <span className="px-3 py-2 bg-gray-50 text-gray-500 text-sm border-r border-gray-200">@</span>
              <input
                type="text"
                required
                placeholder="yourname"
                value={username}
                onChange={e => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                className="flex-1 px-3 py-2 text-sm focus:outline-none"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">Lowercase letters, numbers, underscores only</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Organization or website <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              type="url"
              placeholder="https://yourorg.com"
              value={orgUrl}
              onChange={e => setOrgUrl(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {submitting ? 'Saving...' : 'Save Profile'}
          </button>

          <button
            type="button"
            onClick={() => router.push('/')}
            className="text-sm text-gray-400 hover:text-gray-600 text-center"
          >
            Skip for now
          </button>
        </form>
      </div>
    </div>
  )
}