import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'th.wallhaven.cc',
      },
      {
        protocol: 'https',
        hostname: 'w.wallhaven.cc',
      },
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
      },
    ],
  },
  typescript: {
    // ⚠️ This tells Next.js to ignore the type error and finish building your site
    ignoreBuildErrors: true,
  },
};

export default nextConfig;