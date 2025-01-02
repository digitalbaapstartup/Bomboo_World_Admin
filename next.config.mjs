/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
      return [
        {
          source: '/api/:path*',
          destination: 'https://api.yourlab.in/api/:path*', // Proxy to Backend
        },
      ];
    },
  };
  // console.log
  export default nextConfig;
  
