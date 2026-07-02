'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import EventForm, { EventFormValues } from '@/components/EventForm'

export default function EditEventPage() {
  const { id } = useParams()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [initialValues, setInitialValues] = useState<EventFormValues | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.push('/'); return }
      setUser(session.user)
    })
  }, [router])

  useEffect(() => {
    if (!id) return
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events/${id}`)
      .then(res => res.json())
      .then(({ event }) => {
        if (!event) { router.push('/'); return }
        const eventDate = event.date ? new Date(event.date) : null
        setInitialValues({
          title: event.title || '',
          category: event.category || 'other',
          date: eventDate ? eventDate.toISOString().split('T')[0] : '',
          time: eventDate ? eventDate.toTimeString().slice(0, 5) : '',
          location_name: event.location_name || '',
          price: event.price?.toString() || '',
          is_free: event.is_free || false,
          description: event.description || '',
          official_url: event.official_url || '',
          contact_phone: event.contact_phone || '',
          contact_whatsapp: event.contact_whatsapp || '',
          contact_social: event.contact_social || '',
          photo_url: event.photo_url || ''
        })
        setLoading(false)
      })
      .catch(() => router.push('/'))
  }, [id, router])

  async function uploadPhoto(file: File): Promise<string> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload/presign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileType: file.type })
    })
    const { presignedUrl, publicUrl } = await res.json()
    await fetch(presignedUrl, {
      method: 'PUT',
      body: file,
      headers: { 'Content-Type': file.type }
    })
    return publicUrl
  }

  async function handleSubmit(values: EventFormValues, photoFile: File | null) {
    let photo_url = values.photo_url
    if (photoFile) photo_url = await uploadPhoto(photoFile)

    const dateTime = values.time
      ? new Date(`${values.date}T${values.time}`).toISOString()
      : new Date(values.date).toISOString()

    const { error } = await supabase
      .from('events')
      .update({
        title: values.title,
        category: values.category,
        date: dateTime,
        location_name: values.location_name,
        price: values.is_free ? 0 : parseFloat(values.price) || 0,
        is_free: values.is_free,
        description: values.description,
        official_url: values.official_url || null,
        contact_phone: values.contact_phone || null,
        contact_whatsapp: values.contact_whatsapp || null,
        contact_social: values.contact_social || null,
        photo_url: photo_url || null
      })
      .eq('id', id)
      .eq('posted_by', user.id)

    if (error) throw error
    router.push(`/events/${id}`)
  }

  async function handleDelete() {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id)
      .eq('posted_by', user.id)

    if (error) throw error
    router.push('/')
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-400">Loading...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 pt-6">
        <button
          onClick={() => router.back()}
          className="text-sm text-gray-500 hover:text-gray-700 mb-6"
        >
          ← Back
        </button>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Event</h1>
        {initialValues && (
          <EventForm
            initialValues={initialValues}
            onSubmit={handleSubmit}
            onDelete={handleDelete}
            submitLabel="Save Changes"
          />
        )}
      </div>
    </div>
  )
}