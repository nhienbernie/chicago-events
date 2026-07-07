'use client'

import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import EventCard from '@/components/EventCard'

export default function MyEvents({ user }: { user: any }) {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events/my/${user.id}`)
      .then(res => res.json())
      .then(data => {
        setEvents(data.events || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [user])

  if (!user) return null
  if (loading) return null
  if (events.length === 0) return null

  return (
  <div className="max-w-7xl mx-auto px-4 py-4">
    <div>
      <h2 className="text-2xl font-bold pb-3 border-b-2 border-gray-300 mb-4" style={{ color: '#1A1A2E', fontFamily: 'var(--font-playfair), serif' }}>My Events</h2>
      <div className="grid grid-cols-5 gap-6">
        {events.map(event => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  </div>
  )
}