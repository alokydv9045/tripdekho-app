/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
  },
  poweredByHeader: false,
  turbopack: {},
  images: {
    unoptimized: true,
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 86400, // 24 hours
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self' 'unsafe-eval' 'unsafe-inline' http: https: data: blob:; script-src 'self' 'unsafe-eval' 'unsafe-inline' http: https:; sandbox allow-scripts allow-same-origin allow-forms allow-popups;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      }
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ]
  },
  async redirects() {
    return [
      {
        source: '/dashboard',
        destination: '/profile',
        permanent: true,
      },
    ]
  },
  async rewrites() {
    // next.config.js is evaluated at BUILD time.
    // We use the public IP since Next.js evaluates this during docker build where host IPs can vary
    const isProd = process.env.NODE_ENV === 'production';
    const minioUrl = process.env.MINIO_INTERNAL_URL || (isProd ? 'http://93.127.194.87:9000' : 'http://localhost:9000');
    const apiUrl = process.env.INTERNAL_API_URL || (isProd ? 'http://backend:3000' : 'http://127.0.0.1:3000');
    return [
      {
        // Proxy API requests to backend
        source: '/api/v2/:path*',
        destination: `${apiUrl}/api/v2/:path*`,
      },
      {
        // Proxy /storage/tripdekho-media/... to MinIO
        source: '/storage/:path*',
        destination: `${minioUrl}/:path*`,
      },
    ]
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.externals.push({
      'utf-8-validate': 'commonjs utf-8-validate',
      'bufferutil': 'commonjs bufferutil',
    })
    return config
  },
}

module.exports = nextConfig