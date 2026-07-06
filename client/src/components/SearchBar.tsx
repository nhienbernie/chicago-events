'use client'

import { useState, useRef, useEffect } from 'react'

interface SearchBarProps {
  search: string
  setSearch: (v: string) => void
  category: string
  setCategory: (v: string) => void
  price: string
  setPrice: (v: string) => void
  dateFilter: string
  setDateFilter: (v: string) => void
}

const DATE_OPTIONS = [
  { value: '', label: 'All Dates' },
  { value: 'today', label: 'Today' },
  { value: 'weekend', label: 'This Weekend' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
]

export default function SearchBar({
  search, setSearch,
  category, setCategory,
  price, setPrice,
  dateFilter, setDateFilter
}: SearchBarProps) {
  const [dateOpen, setDateOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDateOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const activeDateLabel = DATE_OPTIONS.find(o => o.value === dateFilter)?.label || 'All Dates'

  return (
    <div className="flex items-center gap-2 flex-1">

      {/* Search input */}
      <input
        type="text"
        placeholder="Search events, venues, or categories..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="border border-gray-200 rounded-lg px-4 py-2 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
      />

      {/* Category */}
      <select
        value={category}
        onChange={e => setCategory(e.target.value)}
        className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">All Categories</option>
        <option value="music">🎵 Music</option>
        <option value="theatre">🎭 Theatre</option>
        <option value="sports">⚽ Sports</option>
        <option value="arts">🎨 Arts</option>
        <option value="cinema">🎬 Cinema</option>
        <option value="other">📅 Other</option>
      </select>

      {/* Price */}
      <select
        value={price}
        onChange={e => setPrice(e.target.value)}
        className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Any Price</option>
        <option value="free">Free</option>
        <option value="10">Under $10</option>
        <option value="25">Under $25</option>
        <option value="50">Under $50</option>
      </select>

      {/* Date dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDateOpen(!dateOpen)}
          className={`border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-1 ${
            dateFilter ? 'border-blue-500 text-blue-600' : 'border-gray-200 text-gray-700'
          }`}
        >
          {activeDateLabel}
          <span className="text-xs">▾</span>
        </button>

        {dateOpen && (
          <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
            {DATE_OPTIONS.map(option => (
              <button
                key={option.value}
                onClick={() => {
                  setDateFilter(option.value)
                  setDateOpen(false)
                }}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                  dateFilter === option.value ? 'text-blue-600 font-medium bg-blue-50' : 'text-gray-700'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}