/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true
  },
  images: {
    domains: ["lh3.googleusercontent.com"]
  },
  eslint: {
    dirs: ["app", "components", "lib"]
  },
  typescript: {
    ignoreBuildErrors: false
  }
};

export default nextConfig;
