const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: path.join(__dirname, '../../'),
  transpilePackages: ['@bis/ui', '@bis/shared-types', '@bis/api-client', '@bis/ai'],
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      '@bis/ui',
      '@radix-ui/react-tooltip',
      'recharts',
      'framer-motion'
    ]
  },
  async rewrites() {
    const rawApiUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
    const destination = rawApiUrl.endsWith('/:path*')
      ? rawApiUrl
      : `${rawApiUrl.replace(/\/$/, '')}/:path*`;

    return [
      {
        source: '/api/v1/:path*',
        destination
      }
    ];
  }
};

module.exports = nextConfig;
