const express = require('express')
const router = express.Router()
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3')
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner')
const { randomUUID } = require('crypto')

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  },
  requestChecksumCalculation: 'WHEN_REQUIRED',
  responseChecksumValidation: 'WHEN_REQUIRED'
})

// POST /api/upload/presign
router.post('/presign', async (req, res) => {
  try {
    const { fileType } = req.body

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(fileType)) {
      return res.status(400).json({ error: 'Only JPEG, PNG and WebP images are allowed' })
    }

    const extension = fileType.split('/')[1]
    const key = `events/${randomUUID()}.${extension}`

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
      ContentType: fileType
    })

    const presignedUrl = await getSignedUrl(s3, command, { expiresIn: 300 })
    const publicUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`

    res.json({ presignedUrl, publicUrl })
  } catch (err) {
    console.error('POST /api/upload/presign error:', err.message)
    res.status(500).json({ error: 'Failed to generate upload URL' })
  }
})

module.exports = router