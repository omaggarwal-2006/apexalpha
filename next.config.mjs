/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  async redirects() {
    return [
      {
        source: "/privacy-policy",
        destination: "/privacy",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    // Next.js Route Handlers (e.g. app/api/market/price/route.js) take
    // precedence over rewrites. Only unmatched /api/* paths proxy to Express.
    return {
      // beforeFiles rewrites run BEFORE the filesystem and App Router.
      // This makes /blog/:slug serve the pre-built static HTML file from
      // public/blog/:slug.html — guaranteeing real HTML in view-source.
      beforeFiles: [
        {
          source: '/blog/:slug',
          destination: '/blog/:slug.html',
        },
      ],
      afterFiles: [
        {
          source: '/api/:path*',
          destination: 'http://127.0.0.1:3001/api/:path*',
        },
        {
          source: '/socket.io/:path*',
          destination: 'http://127.0.0.1:3001/socket.io/:path*',
        },
      ],
      fallback: [],
    };
  },
};

export default nextConfig;
