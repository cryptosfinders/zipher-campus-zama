// next.config.mjs
import { createRequire } from 'module'
const require = createRequire(import.meta.url)

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.convex.cloud',
      },
    ],
  },

  webpack(config, { dev }) {
    // 🔥 Reduce memory usage in dev (CRITICAL for BlockNote)
    if (dev) {
      config.devtool = false
    }

    // 🔥 Fix Radix + use-sidecar + tslib resolution
    config.resolve.extensions.push('.mjs')

    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      tslib: require.resolve('tslib/tslib.es6.js'),
    }

    // Force Webpack to treat tslib as ESM
    config.module.rules.push({
      test: /tslib\.es6\.js$/,
      type: 'javascript/auto',
    })

    return config
  },
}

export default nextConfig
