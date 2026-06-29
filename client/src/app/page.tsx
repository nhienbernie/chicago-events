'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import EventCard from '@/components/EventCard'

export default function Home() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [price, setPrice] = useState('')

  useEffect(() => {
    const params = new URLSearchParams()
    if (category) params.set('category', category)
    params.set('limit', '20')
    params.set('radius_km', '50')

    fetch(`http://localhost:4000/api/events?${params}`)
      .then(res => res.json())
      .then(data => {
        setEvents(data.events || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [category])

  const filtered = events.filter((e: any) => {
    const matchesSearch = e.title.toLowerCase().includes(search.toLowerCase())
    const matchesPrice =
      price === '' ? true :
      price === 'free' ? e.is_free :
      e.price <= parseFloat(price)
    return matchesSearch && matchesPrice
  })

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
        price={price}
        setPrice={setPrice}
      />

      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 pt-8 pb-4">
        <h1 className="text-4xl font-bold text-gray-900">Chicago Events</h1>
        <p className="text-gray-500 mt-1">Browse Chicago events by category, location, and price. Post your own.</p>
      </div>

      {/* Event Grid */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        {loading ? (
          <p className="text-gray-400">Loading events...</p>
        ) : filtered.length === 0 ? (
          <p className="text-gray-400">No events found.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem' }}>
            {filtered.map((event: any) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}