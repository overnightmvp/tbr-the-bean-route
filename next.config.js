const { withPayload } = require('@payloadcms/next/withPayload')

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer, isEdge }) => {
    // Fix for Edge Runtime - externalize OpenTelemetry
    if (isEdge) {
      config.resolve = config.resolve || {}
      config.resolve.alias = {
        ...config.resolve.alias,
        '@opentelemetry/api': false,
        '@opentelemetry/sdk-node': false,
        '@opentelemetry/instrumentation': false,
        '@opentelemetry/resources': false,
      }
    }

    if (isServer && !isEdge) {
      // Fix for Payload CMS vendor chunks issue
      config.externals = [...(config.externals || []), {
        'date-fns': 'commonjs date-fns',
        '@opentelemetry/api': 'commonjs @opentelemetry/api',
        '@opentelemetry/sdk-node': 'commonjs @opentelemetry/sdk-node',
        '@opentelemetry/instrumentation': 'commonjs @opentelemetry/instrumentation',
        '@opentelemetry/resources': 'commonjs @opentelemetry/resources',
      }]
    }
    return config
  },
}

// Only enable Payload when DATABASE_URI is available
// This allows builds to succeed without database connection
if (process.env.DATABASE_URI) {
  module.exports = withPayload(nextConfig)
} else {
  console.warn('⚠️  DATABASE_URI not found - Payload CMS disabled')
  module.exports = nextConfig
}
