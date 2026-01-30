import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
import compression from 'vite-plugin-compression2'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    vue(),
    tailwindcss(),
    // Only enable devtools in development mode
    mode === 'development' ? vueDevTools() : null,
    // Gzip compression
    compression({
      algorithms: ['gzip'],
      threshold: 1024, // Only compress files > 1KB
    }),
    // Brotli compression
    compression({
      algorithms: ['brotliCompress'],
      threshold: 1024,
    }),
  ].filter(Boolean),

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  // Build optimizations
  build: {
    target: 'es2020',
    minify: 'esbuild', // Fast and effective
    cssMinify: 'lightningcss',
    chunkSizeWarningLimit: 500,
    sourcemap: mode === 'development', // Only in development
    assetsInlineLimit: 4096, // Inline assets < 4KB as base64
    rollupOptions: {
      output: {
        // Manual chunk splitting for better caching
        manualChunks: {
          // Vendor chunks
          'vue-vendor': ['vue', 'vue-router'],
          'ui-vendor': ['lucide-vue-next'],
          // Table logic chunks
          'table-composables': [
            './src/components/table/composables/useTableFiltering',
            './src/components/table/composables/useTableSorting',
            './src/components/table/composables/useTablePagination',
            './src/components/table/composables/useTableUrlState',
          ],
        },
        // Organize output files
        assetFileNames: 'assets/[name].[hash][extname]',
        chunkFileNames: 'js/[name].[hash].js',
        entryFileNames: 'js/[name].[hash].js',
      },
    },
  },

  // CSS optimizations
  css: {
    devSourcemap: false,
  },

  // Dependency optimization
  optimizeDeps: {
    include: ['vue', 'vue-router', '@vueuse/router'],
    exclude: ['vite-plugin-vue-devtools'],
  },

  // Development server optimization
  server: {
    fs: {
      strict: true,
    },
    warmup: {
      clientFiles: ['./src/views/*.vue', './src/components/**/*.vue'],
    },
  },
}))
