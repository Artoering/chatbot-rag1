/** @type {import('next').NextConfig} */
const nextConfig = {
  // Konfigurasi API proxy
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:8000/api/:path*",
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.smart-it.co.id",
        pathname: "/id/wp-content/uploads/**",
      },
    ],
  },
  experimental: {
    allowedDevOrigins: ["localhost", ".localhost", "127.0.0.1"],
  },
};

module.exports = nextConfig;
