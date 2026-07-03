'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import ProfileForm from '@/components/ProfileForm'

export default function ProfileSetupPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.push('/')
      setUser(session?.user)
    })
  }, [router])

  async function handleSubmit(username: string, orgUrl: string) {
    const { error } = await supabase
      .from('users')
      .update({ username, org_url: orgUrl || null })
      .eq('id', user.id)

    if (error) throw error
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-xl border border-gray-200 p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Set up your profile</h1>
        <p className="text-gray-500 text-sm mb-6">Choose a username so people know who posted your events.</p>
        <ProfileForm
          onSubmit={handleSubmit}
          submitLabel="Save Profile"
          showSkip={true}
          onSkip={() => router.push('/')}
        />
      </div>
    </div>
  )
}