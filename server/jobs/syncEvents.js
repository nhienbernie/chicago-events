require('dotenv').config()
const axios = require('axios')
const supabase = require('../lib/supabase')

async function fetchTicketmaster() {
  const categories = [
    { name: 'music', keyword: 'music' },
    { name: 'theatre', keyword: 'theatre' },
    { name: 'sports', keyword: 'sports' },
    { name: 'arts', keyword: 'arts' }
  ]

  const events = []

  for (const cat of categories) {
    try {
      const res = await axios.get(
        'https://app.ticketmaster.com/discovery/v2/events.json',
        {
          params: {
            apikey: process.env.TICKETMASTER_API_KEY,
            city: 'Chicago',
            stateCode: 'IL',
            classificationName: cat.keyword,
            radius: 35,
            unit: 'miles',
            size: 100,
            sort: 'date,asc'
          }
        }
      )

      const raw = res.data?._embedded?.events || []

      raw.forEach(e => {
        const venue = e._embedded?.venues?.[0]
        const lat = parseFloat(venue?.location?.latitude)
        const lng = parseFloat(venue?.location?.longitude)

        if (!lat || !lng) return

        events.push({
          external_id: `tm_${e.id}`,
          title: e.name,
          description: e.info || null,
          category: cat.name,
          date: e.dates?.start?.dateTime || null,
          location_name: venue?.name || null,
          lat,
          lng,
          price: e.priceRanges?.[0]?.min || null,
          price_max: e.priceRanges?.[0]?.max || null,
          is_free: e.priceRanges ? false: null,
          photo_url: e.images?.[0]?.url || null,
          official_url: e.url || null,
          source: 'ticketmaster',
          is_user_generated: false
        })
      })

      console.log(`Ticketmaster: ${raw.length} ${cat.name} events fetched`)
    } catch (err) {
      console.error(`Ticketmaster error for ${cat.name}:`, err.message)
    }
  }

  return events
}


async function syncAllEvents() {
  console.log('Starting sync...')

  console.log('Starting sync...')

  const events = await fetchTicketmaster()

  if (events.length === 0) {
    console.log('No events to sync.')
    return
  }

  // Deduplicate by external_id before upserting
  const seen = new Set()
  const unique = events.filter(e => {
    if (seen.has(e.external_id)) return false
    seen.add(e.external_id)
    return true
  })

  const { error } = await supabase
    .from('events')
    .upsert(unique, { onConflict: 'external_id' })

  if (error) {
    console.error('Supabase upsert error:', error.message)
    return
  }

  console.log(`Sync complete. ${events.length} events upserted.`)
}


// Run directly: node jobs/syncEvents.js
if (require.main === module) {
  syncAllEvents().then(() => process.exit(0))
}

module.exports = { syncAllEvents }