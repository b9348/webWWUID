import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import postcssPxtorem from 'postcss-pxtorem'
import autoprefixer from 'autoprefixer'

export default defineConfig(() => { // 移除command参数，改用环境变量
  const base = process.env.VITE_BASE_PATH || '/'; // 从环境变量读取

  return {
    plugins: [react()],
    base, // 动态设置base路径
    build: {
      outDir: 'dist'
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
  }
})
