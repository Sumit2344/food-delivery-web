/** @type {import('next').NextConfig} */
if (process.env.VERCEL === '1' && !process.env.API_SERVER_URL) {
  throw new Error('API_SERVER_URL must point to the deployed Express API on Vercel.');
}

const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.API_SERVER_URL || 'http://localhost:4000'}/api/:path*`,
      },
    ]
  },
}

module.exports = nextConfig
