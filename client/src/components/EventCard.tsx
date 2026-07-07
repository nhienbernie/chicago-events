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

  const isExpired = event.date && new Date(event.date) < new Date()

  const mapsUrl = event?.location_name
    ? `https://maps.google.com/maps?q=${encodeURIComponent(event.location_name + ' Chicago IL')}`
    : null

  return (
  <div
    style={{ backgroundColor: '#FFFFFF', transition: 'all 300ms ease' }}
    className={`rounded-md border border-gray-100 overflow-hidden flex flex-col cursor-pointer ${isExpired ? 'opacity-50 grayscale' : ''}`}
    onClick={() => router.push(`/events/${event.id}`)}
    onMouseEnter={e => {
      (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(26,26,46,0.12)'
      ;(e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'
    }}
    onMouseLeave={e => {
      (e.currentTarget as HTMLElement).style.boxShadow = 'none'
      ;(e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
    }}
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
      <p style={{ color: '#E8A838', fontWeight: 600 }} className="text-xs uppercase tracking-wide">{event.category}</p>
      {isExpired && (
        <span className="text-xs text-red-400 font-medium">Expired</span>
      )}
      <h2 style={{ color: '#1A1A1A' }} className="font-semibold text-sm leading-snug">{event.title}</h2>
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