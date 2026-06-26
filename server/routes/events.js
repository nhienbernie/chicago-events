const express = require('express')
const router = express.Router()

// Placeholder — real queries come after Supabase is set up
router.get('/', (req, res) => {
  res.json({ events: [], message: 'Events route working' })
})

module.exports = router