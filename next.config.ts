import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
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
  devIndicators: {
    buildActivity: false,
  },
  // The following is a workaround for a development-only bug when running inside a container.
  experimental: {
    // This is needed to DEV but not for build
    serverComponentsExternalPackages: ['@whatwg-node/fetch'],
    // This is needed to run the dev server in a container
    outputFileTracingRoot: process.env.NEXT_PUBLIC_VERCEL_ENV
      ? undefined
      : require('path').join(__dirname, '../../'),
  },
};

export default nextConfig;
