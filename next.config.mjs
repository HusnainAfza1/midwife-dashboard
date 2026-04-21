/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/api/public/:path*', // Apply CORS headers to all API routes
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: 'https://project-hebammen.vercel.app', // Put * here (adjusted for localhost)
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, PATCH, OPTIONS', // Specify allowed methods
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-Custom-Header, Content-Type', // Specify allowed headers
          },
        ],
      },
      {
        source: '/api/public/:path*', // Apply CORS headers to all API routes
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: 'https://www.xn--hebammenbro-1hb.de/',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, PATCH, OPTIONS', // Specify allowed methods
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-Custom-Header, Content-Type', // Specify allowed headers
          },
        ],
      },
      {
        source: '/api/public/:path*', // Apply CORS headers to all API routes
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, PATCH, OPTIONS', // Specify allowed methods
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-Custom-Header, Content-Type', // Specify allowed headers
          },
        ],
      },
      {
        source: '/api/places/:path*', // Apply CORS headers to all API routes
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS', // Specify allowed methods
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-Custom-Header, Content-Type', // Specify allowed headers
          },
        ],
      },
      {
        source: '/api/client/:path*', // Apply CORS headers to all API routes
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS', // Specify allowed methods
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-Custom-Header, Content-Type', // Specify allowed headers
          },
        ],
      },
      {
        source: '/api/midwife/:path*', // Apply CORS headers to all API routes
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS', // Specify allowed methods
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-Custom-Header, Content-Type', // Specify allowed headers
          },
        ],
      },
      {
        source: '/api/getMidwifebyId/:path*', // Apply CORS headers to all API routes
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS', // Specify allowed methods
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-Custom-Header, Content-Type', // Specify allowed headers
          },
        ],
      },
      {
        source: '/api/midwives/:path*', // Apply CORS headers to all API routes
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS', // Specify allowed methods
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-Custom-Header, Content-Type', // Specify allowed headers
          },
        ],
      },

    ];
  },
};

export default nextConfig;