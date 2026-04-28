/** @type {import('next').NextConfig} */
const nextConfig = {
  // --- ADD THIS LINE HERE ---
  staticPageGenerationTimeout: 300, 
  // --------------------------

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
    forceSwcTransforms: false,
  },
  devIndicators: {
    buildActivity: false,
  },
};

export default nextConfig;