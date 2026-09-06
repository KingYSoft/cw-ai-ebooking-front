import { createServer } from 'vite'
import config from '../vite.config.mts'

// 运行配置插件

const server = await createServer({
  ...config,
  server: {
    middlewareMode: true,
  },
  mode: 'development',
})

await server.pluginContainer.buildStart()

await server.close()
