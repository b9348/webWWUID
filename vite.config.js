import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import postcssPxtorem from 'postcss-pxtorem'
import autoprefixer from 'autoprefixer'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],  
  // eslint-disable-next-line no-undef
  base: process.env.VITE_BASE_PATH || '/',
  build: {
    // eslint-disable-next-line no-undef
    outDir: process.env.VITE_ENV === 'cf' ? 'dist-cf' : 'dist-gh',
  },
  css: {
    postcss: {
      plugins: [
        postcssPxtorem({
          rootValue: 16,
          unitPrecision: 5,
          propList: ['*'],
          selectorBlackList: [],
          replace: true,
          mediaQuery: false,
          minPixelValue: 0,
        }),
        autoprefixer({
          overrideBrowserslist: ['> 1%', 'last 2 versions', 'not dead', 'iOS >= 9'],
        }),
      ],
    },
  },
})