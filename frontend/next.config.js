/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // App Router activo por defecto en Next 13+
  // experimental: { appDir: true },
  images: {
    remotePatterns: [
      // Agrega dominios de imágenes externas si las usas
      // { protocol: 'https', hostname: 'images.example.com' }
    ]
  },
  // Útil si despliegas en Docker para un binario más pequeño
  // output: 'standalone',
}

module.exports = nextConfig