/** @type {import('next').NextConfig} */
const storefront = process.env.STOREFRONT_ORIGIN || 'http://localhost:3000';

const nextConfig = {
  images: {
    unoptimized: true,
  },
  async rewrites() {
    // Resolve relative catalog/media paths against the storefront in local/dev.
    return [
      { source: '/bracelets/:path*', destination: `${storefront}/bracelets/:path*` },
      { source: '/brooch/:path*', destination: `${storefront}/brooch/:path*` },
      { source: '/categories/:path*', destination: `${storefront}/categories/:path*` },
      { source: '/chains/:path*', destination: `${storefront}/chains/:path*` },
      { source: '/earrings/:path*', destination: `${storefront}/earrings/:path*` },
      { source: '/frames/:path*', destination: `${storefront}/frames/:path*` },
      { source: '/hero/:path*', destination: `${storefront}/hero/:path*` },
      { source: '/images/:path*', destination: `${storefront}/images/:path*` },
      { source: '/necklace/:path*', destination: `${storefront}/necklace/:path*` },
      { source: '/rings/:path*', destination: `${storefront}/rings/:path*` },
    ];
  },
};

export default nextConfig;
