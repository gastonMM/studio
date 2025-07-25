import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/projects',
        permanent: true,
      },
    ]
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // The following is a workaround for a development-only bug when running inside a container.
  experimental: {
    // This is needed to DEV but not for build
    // This is needed to run the dev server in a container
  },
  serverExternalPackages: ['@whatwg-node/fetch'],
  outputFileTracingRoot: process.env.NEXT_PUBLIC_VERCEL_ENV
      ? undefined
      : require('path').join(__dirname, '../../'),
};

export default nextConfig;
