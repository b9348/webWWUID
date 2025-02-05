import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import postcssPxtorem from 'postcss-pxtorem'
import autoprefixer from 'autoprefixer'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
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