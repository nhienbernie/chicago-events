'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import ProfileForm from '@/components/ProfileForm'

export default function ProfileEditPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.push('/'); return }
      setUser(session.user)

      supabase
        .from('users')
        .select('username, org_url')
        .eq('id', session.user.id)
        .single()
        .then(({ data }) => {
          setProfile(data)
          setLoading(false)
        })
    })
  }, [router])

  async function handleSubmit(username: string, orgUrl: string) {
    const { error } = await supabase
      .from('users')
      .update({ username, org_url: orgUrl || null })
      .eq('id', user.id)

    if (error) throw error
    router.push('/profile')
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-400">Loading...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-xl border border-gray-200 p-8 w-full max-w-md">
        <button
          onClick={() => router.back()}
          className="text-sm text-gray-500 hover:text-gray-700 mb-6 block"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Profile</h1>
        <ProfileForm
          initialUsername={profile?.username || ''}
          initialOrgUrl={profile?.org_url || ''}
          onSubmit={handleSubmit}
          submitLabel="Save Changes"
        />
      </div>
    </div>
  )
}