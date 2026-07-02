'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import EventForm, { defaultValues, EventFormValues } from '@/components/EventForm'

export default function PostEventPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        alert('You must be signed in to post an event')
        router.push('/')
        return
      }
      setUser(session.user)
    })
  }, [router])

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
    let photo_url = null
    if (photoFile) photo_url = await uploadPhoto(photoFile)

    const dateTime = values.time
      ? new Date(`${values.date}T${values.time}`).toISOString()
      : new Date(values.date).toISOString()

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: values.title,
        description: values.description,
        category: values.category,
        date: dateTime,
        location_name: values.location_name,
        lat: 41.8781,
        lng: -87.6298,
        price: values.is_free ? 0 : parseFloat(values.price) || 0,
        is_free: values.is_free,
        official_url: values.official_url || null,
        contact_phone: values.contact_phone || null,
        contact_whatsapp: values.contact_whatsapp || null,
        contact_social: values.contact_social || null,
        photo_url,
        posted_by: user?.id
      })
    })

    const data = await res.json()
    if (!res.ok) throw new Error(data.error)
    //router.push(`/events/${data.event.id}`)
    router.push(`/`)

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
        <EventForm
          initialValues={defaultValues}
          onSubmit={handleSubmit}
          submitLabel="Post Event"
        />
      </div>
    </div>
  )
}