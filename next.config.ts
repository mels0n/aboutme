import type { NextConfig } from "next";
import packageJson from "./package.json";

const nextConfig: NextConfig = {
  images: {
    deviceSizes: [360, 480, 640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    formats: ['image/avif', 'image/webp'],
  },
  compress: true,
  env: {
    NEXT_PUBLIC_APP_VERSION: packageJson.version,
  },
  experimental: {
    /*
     * Inlines critical CSS into the HTML document, eliminating the two render-blocking
     * CSS chunk fetches (a99bda89a82bb308.css @ 17.5 KiB, 04a1fac94b695dae.css @ 1.9 KiB)
     * that Lighthouse reported as 212ms of critical path latency.
     * Requires the `critters` package.
     */
    optimizeCss: true,
    /*
     * Tree-shakes package exports so only used icons from lucide-react are bundled.
     * Directly reduces the 74 KiB of unused JS flagged in Lighthouse diagnostics.
     */
    optimizePackageImports: ['lucide-react'],
  },
};

export default nextConfig;
