// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// export default defineConfig({
//   plugins: [react()],
//   // GitHub Pages - repo name as base path
//   base: '/university-main-landing-page/',
//   server: {
//     port: 3000,
//     headers: {
//       'X-Content-Type-Options': 'nosniff',
//       'X-Frame-Options': 'DENY',
//       'X-XSS-Protection': '1; mode=block',
//       'Referrer-Policy': 'strict-origin-when-cross-origin',
//       'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
//       'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
//     },
//   },
//   build: {
//     // Source maps off in production for security
//     sourcemap: false,
//     rollupOptions: {
//       output: {
//         // Hashed filenames to prevent cache poisoning
//         entryFileNames: 'assets/[name]-[hash].js',
//         chunkFileNames: 'assets/[name]-[hash].js',
//         assetFileNames: 'assets/[name]-[hash].[ext]',
//       },
//     },
//   },
// })
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  // GitHub Pages - repo name as base path
  base: '/university-main-landing-page/',

  server: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: true, // <-- Add this

    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    },
  },

  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
  },
})