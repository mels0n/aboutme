import type { NextConfig } from "next";
import packageJson from "./package.json";

const nextConfig: NextConfig = {
  images: {
    deviceSizes: [360, 480, 640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    formats: ['image/avif', 'image/webp'],
  },
  compress: true,
  // Removes X-Powered-By response header to reduce server fingerprinting surface.
  poweredByHeader: false,
  // Enables source maps in production bundles to satisfy the Lighthouse Best
  // Practices "Missing source maps for large first-party JavaScript" audit.
  // Source maps are served but not loaded unless DevTools is open, so there
  // is no measurable performance impact on real users.
  productionBrowserSourceMaps: true,
  env: {
    NEXT_PUBLIC_APP_VERSION: packageJson.version,
  },
};

export default nextConfig;
