import { useRouter } from 'next/navigation'

export default function EventCard({ event }: { event: any }) {
  const router = useRouter()
  const formattedDate = event.date
    ? new Date(event.date).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      })
    : 'Recurring'

  const priceLabel = event.is_free === true
    ? 'Free'
    : event.price && event.price_max && event.price !== event.price_max
    ? `$${event.price}–$${event.price_max}`
    : event.price
    ? `From $${event.price}`
    : 'See tickets'

  const mapsUrl = event?.location_name
    ? `https://maps.google.com/maps?q=${encodeURIComponent(event.location_name + ' Chicago IL')}`
    : null

  return (
  <div
    className="bg-white rounded-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col cursor-pointer"
    onClick={() => router.push(`/events/${event.id}`)}
  >
    {/* Thumbnail */}
    <div className="w-full bg-gray-100 flex items-center justify-center" style={{ height: '180px', overflow: 'hidden' }}>
      {event.photo_url
        ? <img src={event.photo_url} alt={event.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        : <span style={{ fontSize: '3rem' }}>📅</span>
      }
    </div>

    {/* Info */}
    <div className="p-4 flex flex-col gap-2 flex-1">
      <p className="text-xs text-gray-400 uppercase tracking-wide">{event.category}</p>
      <h2 className="font-semibold text-gray-900 text-sm leading-snug">{event.title}</h2>
      {event.showCount > 1 && (
        <p className="text-xs text-blue-500 font-medium">{event.showCount} showtimes available</p>
      )}
      
      <p className="text-sm text-gray-500">📅 {formattedDate}</p>
      {event.showtimes && event.showtimes.length > 1 && (
        <p className="text-xs text-blue-500 font-medium">+{event.showtimes.length - 1} more showtimes</p>
      )}

      <p className="text-sm text-gray-500">📍 {event.location_name || 'Chicago'}</p>
      <div className="mt-auto pt-2 flex items-center justify-between">
        <span className={`text-sm font-semibold ${event.is_free ? 'text-green-600' : 'text-gray-700'}`}>
          {priceLabel}
        </span>
      </div>
    </div>
  </div>
  )
}