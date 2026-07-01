'use client'

import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import EventCard from '@/components/EventCard'

export default function MyEvents({ user }: { user: any }) {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    fetch(`http://localhost:4000/api/events/my/${user.id}`)
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
      <h2 className="text-lg font-semibold text-gray-900 mb-3">My Events</h2>
      <div className="bg-blue-50 rounded-l p-4">
        <div className="grid grid-cols-5 gap-4">
          {events.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </div>
  )
}