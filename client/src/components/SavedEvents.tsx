'use client'

import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import EventCard from '@/components/EventCard'

export default function SavedEvents({ user }: { user: any }) {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    supabase
      .from('saved_events')
      .select('event_id, events(*)')
      .eq('user_id', user.id)
      .then(({ data, error }) => {
        if (error) { setLoading(false); return }
        const saved = data?.map((row: any) => row.events).filter(Boolean) || []
        setEvents(saved)
        setLoading(false)
      })
  }, [user])

  if (!user) return null
  if (loading) return null

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <h2 className="text-lg font-semibold text-gray-900 pb-2  border-b-2 border-gray-200 mb-3">Saved Events</h2>
      {events.length === 0 ? (
        <div className="bg-gray-50 rounded-xl p-8 text-center">
          <p className="text-gray-400">No saved events yet.</p>
          <p className="text-gray-400 text-sm mt-1">Browse events and hit Save to see them here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-5 gap-4">
          {events.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  )
}