'use client'

import React from 'react'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function EventDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [event, setEvent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [poster, setPoster] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events/${id}`)
      .then(res => res.json())
      .then(data => {
        setEvent(data.event)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [id])

  useEffect(() => {
    if (!user || !event) return
    supabase
      .from('saved_events')
      .select('id')
      .eq('user_id', user.id)
      .eq('event_id', event.id)
      .single()
      .then(({ data }) => setSaved(!!data))
  }, [user, event])
  
  useEffect(() => {
    if (!event?.posted_by) return
    supabase
      .from('users')
      .select('username, org_url')
      .eq('id', event.posted_by)
      .single()
      .then(({ data }) => setPoster(data))
  }, [event])

  async function handleSave() {
    if (!user) {
      alert('Sign in to save events')
      return
    }
    setSaving(true)
    if (saved) {
      await supabase
        .from('saved_events')
        .delete()
        .eq('user_id', user.id)
        .eq('event_id', event.id)
      setSaved(false)
    } else {
      await supabase
        .from('saved_events')
        .insert({ user_id: user.id, event_id: event.id, status: 'interested' })
      setSaved(true)
    }
    setSaving(false)
  }

  const mapsUrl = event?.location_name
    ? `https://maps.google.com/maps?q=${encodeURIComponent(event.location_name + ' Chicago IL')}`
    : null

  const formattedDate = event?.date
    ? new Date(event.date).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      })
    : 'Recurring'

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-400">Loading event...</p>
    </div>
  )

  if (!event) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-400">Event not found.</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Back button */}
      <div className="max-w-4xl mx-auto px-4 pt-6">
        <button
          onClick={() => router.back()}
          className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
        >
          ← Back to events
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">

        {/* Photo + pencil icon */}
        <div className="relative w-full rounded-xl overflow-hidden mb-6" style={{ height: '360px' }}>
          {event.photo_url ? (
            <img
              src={event.photo_url}
              alt={event.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <span style={{ fontSize: '4rem' }}>📅</span>
            </div>
          )}

          {user && event.posted_by === user.id && (
            <button
              onClick={() => router.push(`/events/${event.id}/edit`)}
              className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md hover:bg-gray-50 transition-colors"
            >
              ✏️
            </button>
          )}
        </div>

        {/* Title + Save */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">{event.category}</p>
            <h1 className="text-3xl font-bold text-gray-900">{event.title}</h1>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className={`shrink-0 px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
              saved
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {saving ? '...' : saved ? '✓ Saved' : 'Save'}
          </button>
        </div>

        {/* Event info */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-gray-700">
            <span>📅</span>
            <span>{formattedDate}</span>
          </div>

          <div className="flex items-center gap-2">
            <span>📍</span>
            {mapsUrl ? (
              <button
                onClick={() => window.open(mapsUrl, '_blank')}
                className="text-blue-500 hover:underline text-left"
              >
                {event.location_name}
              </button>
            ) : (
              <span className="text-gray-700">{event.location_name}</span>
            )}
          </div>

          <div className="flex items-center gap-2 text-gray-700">
            <span>💰</span>
            <span className={event.is_free ? 'text-green-600 font-medium' : ''}>
              {event.is_free ? 'Free' : event.price ? `From $${event.price}` : 'See event'}
            </span>
          </div>
        </div>

        {/* Poster attribution */}
      {event.is_user_generated && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <p className="text-sm text-gray-500">Posted by</p>
          {poster?.org_url ? (
            <button
              onClick={() => window.open(poster.org_url, '_blank')}
              className="text-blue-500 font-medium hover:underline"
            >
              {poster?.username ? `@${poster.username}` : 'Community'}
            </button>
          ) : (
            <p className="font-medium text-gray-900">
              {poster?.username ? `@${poster.username}` : 'Community'}
            </p>
          )}
        </div>
      )}

        {/* Description */}
        {event.description && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <h2 className="font-semibold text-gray-900 mb-2">About this event</h2>
            <p className="text-gray-600 text-sm leading-relaxed">{event.description}</p>
          </div>
        )}

        {/* Contact / Tickets */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Get tickets / Contact</h2>
          <div className="flex flex-wrap gap-3">
            {event.official_url && (
              <button
                onClick={() => window.open(event.official_url, '_blank')}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Get Tickets →
              </button>
            )}
            {event.contact_phone && (
              <button
                onClick={() => window.open(`tel:${event.contact_phone}`)}
                className="border border-gray-200 text-gray-700 px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-50"
              >
                📞 Call
              </button>
            )}
            {event.contact_whatsapp && (
              <button
                onClick={() => window.open(`https://wa.me/${event.contact_whatsapp}`, '_blank')}
                className="border border-gray-200 text-gray-700 px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-50"
              >
                💬 WhatsApp
              </button>
            )}
            {event.contact_social && (
              <button
                onClick={() => window.open(event.contact_social, '_blank')}
                className="border border-gray-200 text-gray-700 px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-50"
              >
                📱 Social
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}