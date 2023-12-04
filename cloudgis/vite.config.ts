import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// import cesium from "vite-plugin-cesium";
// const path = require('path')

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],

  // // 别名
  // resolve: {
  //   alias: {
  //     //设置别名
  //     '@': path.resolve(__dirname, './src')
  //   }
  // }
})
