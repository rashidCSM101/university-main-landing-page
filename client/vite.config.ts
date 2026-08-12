import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  // Custom domain base path (hex-byte.tech)
  base: '/',

  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    allowedHosts: true,

    // Dev proxy: frontend calls /api/... → Express on :5000
    // Prevents CORS issues in dev. In production, Nginx handles this.
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },

    // Security headers in dev (mirrors production Nginx config)
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
    },
  },

  build: {
    // Security: source maps off in production (no code exposure)
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // Hashed filenames prevent cache poisoning
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        manualChunks: {
          amcharts: ['@amcharts/amcharts5', '@amcharts/amcharts5/xy', '@amcharts/amcharts5/map'],
          animations: ['gsap', 'lenis'],
          vendor: ['react', 'react-dom', 'react-router-dom', 'lucide-react', 'react-helmet-async'],
        },
      },
    },
  },
})