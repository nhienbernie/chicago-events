'use client'

import React from 'react'
import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'

export default function Home() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('http://localhost:4000/api/events')
      .then(res => res.json())
      .then(data => {
        setEvents(data.events || [])
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to fetch events:', err)
        setLoading(false)
      })
  }, [])

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-gray-900">Chicago Events</h1>
        <p className="text-gray-500 mt-1">
          Browse Chicago events by category, location, and price. Post your own.
        </p>

        <div className="mt-6">
          {loading ? (
            <p className="text-gray-400">Loading events...</p>
          ) : events.length === 0 ? (
            <p className="text-gray-400">No events found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {events.map(event => (
                <div
                  key={event.id}
                  className="bg-white rounded-xl border border-gray-200 p-4"
                >
                  <p className="text-xs text-gray-400 uppercase mb-1">{event.category}</p>
                  <h2 className="font-semibold text-gray-900 mb-1">{event.title}</h2>
                  <p className="text-sm text-gray-500">
                    {event.date ? new Date(event.date).toLocaleDateString('en-US', {
                      weekday: 'short', month: 'short', day: 'numeric'
                    }) : 'Recurring'}
                  </p>
                  <p className="text-sm text-gray-500">{event.location_name}</p>
                  <p className="text-sm font-medium mt-2 text-green-600">
                    {event.is_free ? 'Free' : event.price ? `$${event.price}` : 'See event'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}