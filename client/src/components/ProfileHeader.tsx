'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import UserAvatar from '@/components/UserAvatar'

interface ProfileHeaderProps {
  username?: string | null
  displayName?: string | null
  orgUrl?: string | null
  avatarUrl?: string | null
  isOwnProfile?: boolean
}

export default function ProfileHeader({ username, displayName, orgUrl, avatarUrl, isOwnProfile = false }: ProfileHeaderProps) {
  const router = useRouter()

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <UserAvatar username={username} displayName={displayName} avatarUrl={avatarUrl} size="lg" />
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            {displayName || username || 'Chicago Events User'}
          </h1>
          {username && (
            <p className="text-gray-500 text-sm">@{username}</p>
          )}
          {orgUrl && (
            <button
              onClick={() => window.open(orgUrl, '_blank')}
              className="text-blue-500 text-sm hover:underline mt-1"
            >
              {orgUrl.replace('https://', '').replace('http://', '')}
            </button>
          )}
        </div>
      </div>

      {isOwnProfile && (
        <button
          onClick={() => router.push('/profile/edit')}
          className="border border-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          Edit Profile
        </button>
      )}
    </div>
  )
}