'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import EventCard from '@/components/EventCard'
import SearchBar from '@/components/SearchBar'

export default function Home() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')

  useEffect(() => {
    const params = new URLSearchParams()
    if (category) params.set('category', category)
    params.set('limit', '20')

    fetch(`http://localhost:4000/api/events?${params}`)
      .then(res => res.json())
      .then(data => {
        setEvents(data.events || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [category])

  const filtered = events.filter((e: any) =>
    e.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 pt-8 pb-4">
        <h1 className="text-4xl font-bold text-gray-900">Chicago Events</h1>
        <p className="text-gray-500 mt-1">Browse Chicago events by category, location, and price. Post your own.</p>
      </div>

      
      {/* Search + Filters */}
      {/*<div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search events..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border border-gray-200 rounded-lg px-4 py-2 text-sm flex-1 min-w-[200px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        />
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="border border-gray-200 rounded-lg px-4 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Categories</option>
          <option value="music">🎵 Music</option>
          <option value="theatre">🎭 Theatre</option>
          <option value="sports">⚽ Sports</option>
          <option value="arts">🎨 Arts</option>
          <option value="thrifting">🛍️ Thrifting</option>
          <option value="film">🎬 Film</option>
        </select>
      </div>
      */}

      <SearchBar
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
      />

      {/* Event Grid */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        {loading ? (
          <p className="text-gray-400">Loading events...</p>
        ) : filtered.length === 0 ? (
          <p className="text-gray-400">No events found.</p>
        ) : (
          <div className="grid grid-cols-5 gap-4">
            {filtered.map((event: any) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}