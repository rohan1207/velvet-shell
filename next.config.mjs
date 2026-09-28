/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@google/model-viewer'],
  images: {
    qualities: [75, 90, 100],
  },
};

export default nextConfig;
