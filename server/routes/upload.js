const express = require('express')
const router = express.Router()

// Placeholder — S3 logic comes later
router.post('/presign', (req, res) => {
  res.json({ message: 'Upload route working' })
})

module.exports = router