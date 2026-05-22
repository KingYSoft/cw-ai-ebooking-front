// vite.config.local.example.mts（提交到Git，作为模板）
import type { UserConfig } from 'vite'

// 本地个性化配置（复制此文件为vite.config.local.mts，修改后使用）
const localConfig: UserConfig = {
  server: {
    port: 3000, // 开发者自定义端口（避免和其他项目冲突）
    // open: true, // 本地启动自动打开浏览器
    // // 本地代理配置（不同开发者可能对接不同的后端环境）
    // proxy: {
    //   '/api': {
    //     target: 'http://192.168.1.100:8080', // 开发者本地后端地址
    //     changeOrigin: true,
    //     rewrite: path => path.replace(/^\/api/, '')
    //   }
    // }
  },
  // 本地自定义构建配置（可选）
  build: {
    sourcemap: true, // 本地打包时生成sourcemap（方便调试）
  },
}

export default localConfig
