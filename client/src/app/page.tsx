'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import EventCard from '@/components/EventCard'
import MyEvents from '@/components/MyEvents'
import { supabase } from '@/lib/supabase'

export default function Home() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [price, setPrice] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [user, setUser] = useState<any>(null)


  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const chicagoDate = new Date().toLocaleDateString('en-US', { timeZone: 'America/Chicago' })
    const chicagoMidnight = new Date(chicagoDate)

    const params = new URLSearchParams()
    if (category) params.set('category', category)
    params.set('limit', '350')
    params.set('radius_km', '100')
    params.set('start_date', chicagoMidnight.toISOString())

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events?${params}`)
      .then(res => res.json())
      .then(data => {
        setEvents(data.events || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [category])

  const filtered = events.filter((e: any) => {
    const matchesSearch = e.title.toLowerCase().includes(search.toLowerCase()) || 
    e.location_name?.toLowerCase().includes(search.toLowerCase()) ||
    e.description?.toLowerCase().includes(search.toLowerCase())
    
    const matchesPrice =
      price === '' ? true :
      price === 'free' ? e.is_free :
      e.price <= parseFloat(price)

    const matchesDate = (() => {
      if (!dateFilter || !e.date) return true
      const eventDate = new Date(e.date)
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const tomorrow = new Date(today)
      tomorrow.setDate(today.getDate() + 1)

      if (dateFilter === 'today') {
        return eventDate >= today && eventDate < tomorrow
      }
      if (dateFilter === 'weekend') {
        const day = today.getDay()
        const saturday = new Date(today)
        saturday.setDate(today.getDate() + (6 - day))
        const monday = new Date(saturday)
        monday.setDate(saturday.getDate() + 2)
        return eventDate >= saturday && eventDate < monday
      }
      if (dateFilter === 'week') {
        const nextWeek = new Date(today)
        nextWeek.setDate(today.getDate() + 7)
        return eventDate >= today && eventDate < nextWeek
      }
      if (dateFilter === 'month') {
        const nextMonth = new Date(today)
        nextMonth.setMonth(today.getMonth() + 1)
        return eventDate >= today && eventDate < nextMonth
      }
      return true
    })()

    return matchesSearch && matchesPrice && matchesDate
  })

  const deduplicated = Object.values(
  filtered.reduce((acc: any, event: any) => {
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

  return (
    <main className="min-h-screen" style={{ backgroundColor: '#F5F0E8' }}>
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

      <div className="max-w-7xl mx-auto px-4 pt-8 pb-4">
        <p style={{ color: '#6B6B6B' }} className="mt-1">Browse Chicago events by category, location, and price. Post your own.</p>
      </div>

      {/* My Events */}
      <MyEvents user={user} />

      <div className="max-w-7xl mx-auto px-4 py-4">
        <h2 className="text-2xl font-bold pb-3 border-b-2 border-gray-300 mb-4" style={{ color: '#1A1A2E', fontFamily: 'var(--font-playfair), serif' }}>Explore Events</h2>
        {loading ? (
          <p className="text-gray-400">Loading events...</p>
        ) : deduplicated.length === 0 ? (
          <p className="text-gray-400">No events found.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
            {(deduplicated as any[]).map((event: any) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}