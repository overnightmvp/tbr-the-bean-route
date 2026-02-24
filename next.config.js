const { withPayload } = require('@payloadcms/next/withPayload')

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your existing Next.js config options
}

// Only enable Payload when DATABASE_URI is available
// This allows builds to succeed without database connection
if (process.env.DATABASE_URI) {
  module.exports = withPayload(nextConfig)
} else {
  console.warn('⚠️  DATABASE_URI not found - Payload CMS disabled')
  module.exports = nextConfig
}
