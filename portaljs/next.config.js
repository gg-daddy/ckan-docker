/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,

  // Server-side runtime configuration
  serverRuntimeConfig: {
    ckanApiUrl: process.env.CKAN_API_URL || 'http://ckan:5000',
  },

  // Public runtime configuration (available on both server and client)
  publicRuntimeConfig: {
    ckanUrl: process.env.NEXT_PUBLIC_CKAN_URL || 'https://localhost:8443',
    siteTitle: process.env.NEXT_PUBLIC_SITE_TITLE || 'Data Portal',
  },

  // Image optimization
  images: {
    domains: ['localhost', 'ckan'],
    unoptimized: process.env.NODE_ENV === 'development',
  },

  // Transpile packages if needed
  transpilePackages: [],

  // Webpack configuration
  webpack: (config, { isServer }) => {
    // Handle fs module for client-side
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
