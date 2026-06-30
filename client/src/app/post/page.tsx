'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const CATEGORIES = [
  { value: 'music', label: '🎵 Music' },
  { value: 'theatre', label: '🎭 Theatre' },
  { value: 'sports', label: '⚽ Sports' },
  { value: 'arts', label: '🎨 Arts' },
  { value: 'film', label: '🎬 Cinema' },
  { value: 'other', label: '📅 Other' }
]

export default function PostEventPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    title: '',
    category: 'other',
    date: '',
    time: '',
    location_name: '',
    price: '',
    is_free: false,
    description: '',
    official_url: '',
    contact_phone: '',
    contact_whatsapp: '',
    contact_social: ''
  })

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        alert('You must be signed in to post an event')
        router.push('/')
      }
      setUser(session?.user)
    })
  }, [router])

  function update(key: string, value: any) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!form.official_url && !form.contact_phone && !form.contact_whatsapp && !form.contact_social) {
      setError('Please provide at least one contact method or official URL')
      return
    }

    setSubmitting(true)

    try {

      /* geocoding call, requires a Mapbox token in .env.local */
      /*
      const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
      const geoRes = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(form.location_name + ' Chicago IL')}.json?access_token=${MAPBOX_TOKEN}&limit=1`
      )
      const geoData = await geoRes.json()
      const coords = geoData.features?.[0]?.center

      if (!coords) {
        setError("Couldn't find that address. Try being more specific.")
        setSubmitting(false)
        return
      }
        */

      const dateTime = form.time
        ? new Date(`${form.date}T${form.time}`).toISOString()
        : new Date(form.date).toISOString()

      const res = await fetch('http://localhost:4000/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          category: form.category,
          date: dateTime,
          location_name: form.location_name,
          lat: null,//coords[1],
          lng: null,//coords[0],
          price: form.is_free ? 0 : parseFloat(form.price) || 0,
          is_free: form.is_free,
          official_url: form.official_url || null,
          contact_phone: form.contact_phone || null,
          contact_whatsapp: form.contact_whatsapp || null,
          contact_social: form.contact_social || null,
          posted_by: user?.id
        })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      router.push(`/events/${data.event.id}`)
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 pt-6">
        <button
          onClick={() => router.back()}
          className="text-sm text-gray-500 hover:text-gray-700 mb-6"
        >
          ← Back
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-6">Post an Event</h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-5">

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Event name</label>
            <input
              type="text"
              required
              placeholder="What's happening?"
              value={form.title}
              onChange={e => update('title', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={form.category}
              onChange={e => update('category', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {CATEGORIES.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          {/* Date + Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                required
                value={form.date}
                onChange={e => update('date', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time (optional)</label>
              <input
                type="time"
                value={form.time}
                onChange={e => update('time', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              required
              placeholder="Address or venue name in Chicago"
              value={form.location_name}
              onChange={e => update('location_name', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Price */}
          <div>
            <label className="flex items-center gap-2 mb-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_free}
                onChange={e => update('is_free', e.target.checked)}
                className="accent-blue-600 w-4 h-4"
              />
              <span className="text-sm font-medium text-gray-700">This event is free</span>
            </label>
            {!form.is_free && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">$</span>
                <input
                  type="number"
                  min={0}
                  placeholder="0.00"
                  value={form.price}
                  onChange={e => update('price', e.target.value)}
                  className="w-32 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
            <textarea
              rows={3}
              placeholder="Tell people what to expect..."
              value={form.description}
              onChange={e => update('description', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Contact methods */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact / Tickets <span className="text-gray-400 font-normal">(at least one required)</span>
            </label>
            <div className="flex flex-col gap-2">
              <input
                type="url"
                placeholder="Official website or ticket link"
                value={form.official_url}
                onChange={e => update('official_url', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="tel"
                placeholder="Phone number (optional)"
                value={form.contact_phone}
                onChange={e => update('contact_phone', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="tel"
                placeholder="WhatsApp number (optional)"
                value={form.contact_whatsapp}
                onChange={e => update('contact_whatsapp', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="url"
                placeholder="Social media link (optional)"
                value={form.contact_social}
                onChange={e => update('contact_social', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {submitting ? 'Posting...' : 'Post Event'}
          </button>
        </form>
      </div>
    </div>
  )
}