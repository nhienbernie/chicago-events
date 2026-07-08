'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import ProfileHeader from '@/components/ProfileHeader'
import SavedEvents from '@/components/SavedEvents'
import MyEvents from '@/components/MyEvents'

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [price, setPrice] = useState('')
  const [dateFilter, setDateFilter] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.push('/'); return }
      setUser(session.user)

      supabase
        .from('users')
        .select('username, org_url, display_name, avatar_url')
        .eq('id', session.user.id)
        .single()
        .then(({ data }) => {
          setProfile(data)
          setLoading(false)
        })
    })
  }, [router])

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-400">Loading...</p>
    </div>
  )

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
        price={price}
        setPrice={setPrice}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
      />

      <div className="max-w-7xl mx-auto px-4 pt-6 pb-12 flex flex-col gap-6">
        <ProfileHeader
          username={profile?.username}
          displayName={profile?.display_name}
          orgUrl={profile?.org_url}
          avatarUrl={profile?.avatar_url}
          isOwnProfile={true}
        />

        <SavedEvents user={user} />

        <MyEvents user={user} />
      </div>
    </main>
  )
}