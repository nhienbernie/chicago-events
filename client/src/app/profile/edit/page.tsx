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
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.push('/'); return }
      setUser(session.user)

      supabase
        .from('users')
        .select('username, org_url, avatar_url')
        .eq('id', session.user.id)
        .single()
        .then(({ data }) => {
          setProfile(data)
          if (data?.avatar_url) setAvatarPreview(data.avatar_url)
          setLoading(false)
        })
    })
  }, [router])

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  async function uploadAvatar(file: File): Promise<string> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload/presign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileType: file.type, uploadType: 'avatar' })
    })
    const { presignedUrl, publicUrl } = await res.json()
    await fetch(presignedUrl, {
      method: 'PUT',
      body: file,
      headers: { 'Content-Type': file.type }
    })
    return publicUrl
  }

  async function handleSubmit(username: string, orgUrl: string) {
    setUploading(true)
    let avatar_url = profile?.avatar_url || null

    if (avatarFile) {
      avatar_url = await uploadAvatar(avatarFile)
    }

    const { error } = await supabase
      .from('users')
      .update({ username, org_url: orgUrl || null, avatar_url })
      .eq('id', user.id)

    setUploading(false)
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

        {/* Avatar upload */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-full rounded-xl overflow-hidden mb-3 bg-gray-100" style={{ height: '300px' }}>
            {avatarPreview ? (
              <img src={avatarPreview} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-white bg-blue-500">
                {profile?.username?.charAt(0).toUpperCase() || '?'}
              </div>
            )}
          </div>
          <label className="cursor-pointer text-sm text-blue-500 hover:text-blue-700">
            Change photo
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </label>
        </div>

        <ProfileForm
          initialUsername={profile?.username || ''}
          initialOrgUrl={profile?.org_url || ''}
          onSubmit={handleSubmit}
          submitLabel={uploading ? 'Saving...' : 'Save Changes'}
        />
      </div>
    </div>
  )
}