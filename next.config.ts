import type { NextConfig } from "next";
import packageJson from "./package.json";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: https:",
              "connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com",
              "frame-src https://www.youtube-nocookie.com https://www.youtube.com",
              "frame-ancestors 'none'",
            ].join('; '),
          },
        ],
      },
    ];
  },
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
