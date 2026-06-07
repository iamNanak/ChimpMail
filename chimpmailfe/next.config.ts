import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/send',
        destination: 'http://localhost:8081/api/send',
      },
      {
        source: '/api/templates',
        destination: 'http://localhost:8081/api/templates',
      },
    ];
  },
};

export default nextConfig;
