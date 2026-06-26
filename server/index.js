require('dotenv').config()
const express = require('express')
const cors = require('cors')
const cron = require('node-cron')

const eventsRouter = require('./routes/events')
const uploadRouter = require('./routes/upload')

const app = express()
const PORT = process.env.PORT || 4000

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL }))
app.use(express.json())

// Routes
app.use('/api/events', eventsRouter)
app.use('/api/upload', uploadRouter)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

module.exports = app