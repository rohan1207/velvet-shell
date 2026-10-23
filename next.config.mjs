/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@google/model-viewer'],
  images: {
    qualities: [75, 90, 100],
    // Replaced public/ assets share the same path; keep TTL low and allow ?v=
    // so withAssetVersion() can bust the optimizer cache.
    minimumCacheTTL: 60,
    localPatterns: [
      {
        pathname: '/**',
        // omit `search` → any ?v=… query is allowed
      },
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.r2.dev',
        pathname: '/**',
      },
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
      {
        protocol: 'https',
        hostname: '**.r2.cloudflarestorage.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
