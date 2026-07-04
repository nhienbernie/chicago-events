const express = require('express')
const router = express.Router()
const supabase = require('../lib/supabase')

// GET /api/events
router.get('/', async (req, res) => {
  try {
    const {
      category,
      lat = 41.8781,
      lng = -87.6298,
      radius_km = 10,
      max_price,
      is_free,
      start_date,
      limit = 50,
      offset = 0
    } = req.query

    let { data, error } = await supabase.rpc('get_events_within_radius', {
      user_lat: parseFloat(lat),
      user_lng: parseFloat(lng),
      radius_meters: parseFloat(radius_km) * 1000,
      result_limit: parseInt(limit),
      result_offset: parseInt(offset)
    })

    if (error) throw error

    // Also get user-generated events with no location
    const { data: userEvents, error: userError } = await supabase
      .from('events')
      .select('*')
      .eq('is_user_generated', true)
      .is('lat', null)

    if (!userError && userEvents) {
      data = [...data, ...userEvents]
    }

    // Apply additional filters
    if (category) data = data.filter(e => e.category === category)
    if (is_free === 'true') data = data.filter(e => e.is_free)
    if (max_price) data = data.filter(e => e.price <= parseFloat(max_price))
      if (start_date) data = data.filter(e => e.date && new Date(e.date) >= new Date(start_date))

    res.json({ events: data, count: data.length })
  } catch (err) {
    console.error('GET /api/events error:', err.message)
    res.status(500).json({ error: 'Failed to fetch events' })
  }
})

// GET /api/events/:id
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', req.params.id)
      .single()

    //if (error) throw error
    if (error && error.code !== 'PGRST116') throw error
    if (!data) return res.status(404).json({ error: 'This event may have expired or no longer exists.' })

    res.json({ event: data })
  } catch (err) {
    console.error('GET /api/events/:id error:', err.message)
    res.status(500).json({ error: 'Failed to fetch event' })
  }
})

// POST /api/events
router.post('/', async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      date,
      location_name,
      lat,
      lng,
      price,
      is_free,
      photo_url,
      official_url,
      contact_phone,
      contact_whatsapp,
      contact_social,
      posted_by,
      showtimes
    } = req.body

    console.log('showtimes received:', showtimes)


    // Validate required fields
    if (!title || !category /*|| !lat || !lng*/) {
      return res.status(400).json({ error: 'Missing required fields: title, category, location' })
    }

    // Validate at least one contact method
    if (!official_url && !contact_phone && !contact_whatsapp && !contact_social) {
      return res.status(400).json({ error: 'At least one contact method is required' })
    }

    const { data, error } = await supabase
      .from('events')
      .insert({
        title,
        description,
        category,
        date,
        location_name,
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        price: is_free ? 0 : parseFloat(price) || 0,
        is_free: Boolean(is_free),
        photo_url,
        official_url,
        contact_phone,
        contact_whatsapp,
        contact_social,
        posted_by,
        source: 'user',
        is_user_generated: true,
        showtimes: showtimes || null
      })
      .select()
      .single()

    if (error) throw error

    res.status(201).json({ event: data })
  } catch (err) {
    console.error('POST /api/events error:', err.message)
    res.status(500).json({ error: 'Failed to create event' })
  }
})

// GET /api/events/my/:userId
router.get('/my/:userId', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('posted_by', req.params.userId)
      .order('created_at', { ascending: false })

    if (error) throw error

    res.json({ events: data })
  } catch (err) {
    console.error('GET /api/events/my/:userId error:', err.message)
    res.status(500).json({ error: 'Failed to fetch your events' })
  }
})


module.exports = router