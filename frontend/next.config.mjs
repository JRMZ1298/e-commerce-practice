/** @type {import('next').NextConfig} */
const nextConfig = {
  output: process.env.NODE_ENV === 'production' && process.platform !== 'win32' ? 'standalone' : undefined,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.cloudfront.net',
      },
      {
        protocol: 'https',
        hostname: '*.s3.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: '*.s3.*.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
    ],
  },
}

export default nextConfig
