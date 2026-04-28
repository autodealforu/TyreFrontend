/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    // Improve stability during development
    forceSwcTransforms: false,
  },
  // Ensure proper handling of authentication during development
  devIndicators: {
    buildActivity: false,
  },
};

export default nextConfig;
