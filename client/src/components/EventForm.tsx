'use client'

import React, { useState } from 'react'

const CATEGORIES = [
  { value: 'music', label: '🎵 Music' },
  { value: 'theatre', label: '🎭 Theatre' },
  { value: 'sports', label: '⚽ Sports' },
  { value: 'arts', label: '🎨 Arts' },
  { value: 'film', label: '🎬 Cinema' },
  { value: 'other', label: '📅 Other' }
]

export interface EventFormValues {
  title: string
  category: string
  date: string
  time: string
  location_name: string
  price: string
  is_free: boolean
  description: string
  official_url: string
  contact_phone: string
  contact_whatsapp: string
  contact_social: string
  photo_url: string
  showtimes: string[]
}

export const defaultValues: EventFormValues = {
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
  contact_social: '',
  photo_url: '',
  showtimes: []
}

interface EventFormProps {
  initialValues?: EventFormValues
  onSubmit: (values: EventFormValues, photoFile: File | null) => Promise<void>
  onDelete?: () => Promise<void>
  submitLabel?: string
  error?: string
}

export default function EventForm({
  initialValues = defaultValues,
  onSubmit,
  onDelete,
  submitLabel = 'Post Event',
  error
}: EventFormProps) {
  const [form, setForm] = useState<EventFormValues>(initialValues)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(initialValues.photo_url || null)
  const [submitting, setSubmitting] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [localError, setLocalError] = useState('')

  function update(key: string, value: any) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setPhotoFile(file)
    setPhotoPreview(URL.createObjectURL(file))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    console.log('photoFile:', photoFile)
    setLocalError('')

    if (!form.official_url && !form.contact_phone && !form.contact_whatsapp && !form.contact_social) {
      setLocalError('Please provide at least one contact method or official URL')
      return
    }

    setSubmitting(true)
    try {
      await onSubmit(form, photoFile)
    } catch (err: any) {
      setLocalError(err.message || 'Something went wrong.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete() {
    if (!onDelete) return
    if (!confirm('Are you sure you want to delete this event? This cannot be undone.')) return
    setDeleting(true)
    try {
      await onDelete()
    } catch (err: any) {
      setLocalError(err.message || 'Failed to delete event.')
      setDeleting(false)
    }
  }

  const displayError = error || localError

  return (
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

      {/* Additional Showtimes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Additional Showtimes <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        {form.showtimes.map((showtime, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="datetime-local"
              value={showtime}
              onChange={e => {
                const updated = [...form.showtimes]
                updated[index] = e.target.value
                update('showtimes', updated)
              }}
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => {
                const updated = form.showtimes.filter((_, i) => i !== index)
                update('showtimes', updated)
              }}
              className="px-3 py-2 text-red-400 hover:text-red-600 text-sm"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => update('showtimes', [...form.showtimes, ''])}
          className="text-sm text-blue-500 hover:text-blue-700"
        >
          + Add showtime
        </button>
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

      {/* Photo */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Photo <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        {photoPreview && (
          <div className="mb-2 rounded-lg overflow-hidden" style={{ height: '200px' }}>
            <img src={photoPreview} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        )}
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handlePhotoChange}
          className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
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

      {displayError && (
        <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{displayError}</p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
      >
        {submitting ? 'Saving...' : submitLabel}
      </button>

      {onDelete && (
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className="w-full border border-red-200 text-red-500 py-2.5 rounded-lg font-medium hover:bg-red-50 transition-colors disabled:opacity-50"
        >
          {deleting ? 'Deleting...' : 'Delete Event'}
        </button>
      )}
    </form>
  )
}