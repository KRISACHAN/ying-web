import { defineConfig } from 'vite'
import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import legacy from '@vitejs/plugin-legacy'

function pathResolve(dir) {
  return resolve(process.cwd(), '.', dir)
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    legacy({
      targets: ['Android >= 4.4', 'iOS >= 9', 'ie >= 11', 'Chrome>=30'],
      modernPolyfills: true,
    }),
  ],
  base: './',
  resolve: {
    alias: {
      '@': pathResolve('./src'),
    }
  },
  server: {
    host: true,
    port: 8080
  },
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // 打包时移除 console
        drop_debugger: true // 打包时移除 debugger
      }
    }
  }
})
