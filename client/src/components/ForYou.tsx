'use client'

import React, { useState, useEffect } from 'react'
import EventCard from '@/components/EventCard'

export default function ForYou({ user }: { user: any }) {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [source, setSource] = useState<string>('')

  useEffect(() => {
    console.log('ForYou user:', user)
    if (!user) { setLoading(false); return }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events/recommendations/${user.id}`)
      .then(res => res.json())
      .then(data => {
        const deduplicated = Object.values(
          (data.events || []).reduce((acc: any, event: any) => {
            const key = `${event.title}_${event.location_name}`
            if (!acc[key]) {
              acc[key] = { ...event, showCount: 1 }
            } else {
              acc[key].showCount++
              if (event.date && new Date(event.date) < new Date(acc[key].date)) {
                acc[key] = { ...event, showCount: acc[key].showCount }
              }
            }
            return acc
          }, {})
        )
        setEvents(deduplicated as any[])
        setSource(data.source || '')
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [user])

  if (!user) return null
  if (loading) return null
  if (events.length === 0) return null

  const label = source === 'popular'
    ? 'Popular in Chicago'
    : source === 'behavioral'
    ? 'For You'
    : 'Recommended'

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <h2
        className="text-2xl font-bold pb-3 border-b-2 border-gray-300 mb-4"
        style={{ color: '#1A1A2E', fontFamily: 'var(--font-playfair), serif' }}
      >
        {label}
      </h2>
      <div className="grid grid-cols-4 gap-6">
        {events.map(event => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  )
  
  
}
