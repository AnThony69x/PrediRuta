/** @type {import('next').NextConfig} */
// Build timestamp: Updated to force Vercel rebuild
const nextConfig = {
  reactStrictMode: true,
  
  // Optimizaciones para producción
  swcMinify: true,
  
  // Configuración de imágenes
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'maps.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: 'tile.openstreetmap.org',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  
  // Headers de seguridad
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
        ],
      },
    ]
  },
  
  // Variables de entorno públicas
  env: {
    NEXT_PUBLIC_APP_NAME: 'PrediRuta',
    NEXT_PUBLIC_APP_VERSION: '1.0.0',
  },
  
  // Configuración de output para Vercel
  output: 'standalone',
};

module.exports = nextConfig;