/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // Or 'export' if you want fully static
  trailingSlash: true, // Better compatibility with Netlify
  
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },

  typescript: {
    ignoreBuildErrors: true,
  },

 
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
};

module.exports = nextConfig;