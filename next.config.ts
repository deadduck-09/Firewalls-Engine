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
    ignoreBuildErrors: true,
  },
  eslint: {
    // ⚠️ This will bypass pre-render linters forcing suspense boundaries
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;