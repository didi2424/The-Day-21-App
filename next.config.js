/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    topLevelAwait: true,
  },
  serverExternalPackages: ["mongoose"], // moved from experimental
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
  webpack: (config) => { // Fixed type error by explicitly declaring parameter
    config.experiments = {
      ...config.experiments,
      topLevelAwait: true,
    }
    return config
  }
}

module.exports = nextConfig
