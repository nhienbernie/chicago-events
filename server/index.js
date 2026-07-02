require('dotenv').config()
const { syncAllEvents } = require('./jobs/syncEvents')
const express = require('express')
const cors = require('cors')
const cron = require('node-cron')

const eventsRouter = require('./routes/events')
const uploadRouter = require('./routes/upload')

const app = express()
const PORT = process.env.PORT || 4000

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://chicago-events-psi.vercel.app'
  ]
}))
app.use(express.json())

// Routes
app.use('/api/events', eventsRouter)
app.use('/api/upload', uploadRouter)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// cron schedule
// Sync events every 24 hours
cron.schedule('0 0 * * *', async () => {
  console.log('Running scheduled event sync...')
  await syncAllEvents()
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

module.exports = app
//const { syncAllEvents } = require('./jobs/syncEvents')