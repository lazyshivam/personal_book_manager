import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
   async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://personal-book-manager-backend-1.onrender.com/v1/:path*',
      },
    ];
  },
};

export default nextConfig;
