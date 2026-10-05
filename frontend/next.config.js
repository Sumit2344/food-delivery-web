/** @type {import('next').NextConfig} */
const apiServerUrl = process.env.API_SERVER_URL
  || (process.env.VERCEL === '1' ? 'https://tomato-api-k3a1.onrender.com' : 'http://localhost:4000')

const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${apiServerUrl}/api/:path*`,
      },
    ]
  },
}

module.exports = nextConfig
