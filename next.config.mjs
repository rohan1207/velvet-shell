/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@google/model-viewer'],
  images: {
    qualities: [75, 90, 100],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.r2.dev',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'pub-0389e1de118b4372bc8e3672b0b59760.r2.dev',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
