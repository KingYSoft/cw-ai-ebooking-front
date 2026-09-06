// Utilities
import type { Plugin, UserConfig } from 'vite'
import { mkdir, writeFile } from 'node:fs/promises'
import { isAbsolute, join, resolve } from 'node:path'
import { fileURLToPath, URL } from 'node:url'
import Vue from '@vitejs/plugin-vue'
import { visualizer } from 'rollup-plugin-visualizer'
// Plugins
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { VueRouterAutoImports } from 'unplugin-vue-router'
import VueRouter from 'unplugin-vue-router/vite'
import { defineConfig, mergeConfig } from 'vite'
import viteCompression from 'vite-plugin-compression'
import Layouts from 'vite-plugin-vue-layouts-next'
import Vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

function createBuildVersionPlugin(mode: string): Plugin {
  let outputDir = 'dist'

  return {
    name: 'generate-build-version',
    configResolved(config) {
      outputDir = isAbsolute(config.build.outDir)
        ? config.build.outDir
        : resolve(config.root, config.build.outDir)
    },
    async writeBundle() {
      const buildTime = new Date().toISOString()
      const version = buildTime.replace(/\D/g, '').slice(0, 14)
      const content = `${JSON.stringify({ version, buildTime, mode }, null, 2)}\n`

      await mkdir(outputDir, { recursive: true })
      await writeFile(join(outputDir, 'version.json'), content, 'utf8')
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig(async ({ mode }) => {
  const shareConfig: UserConfig = {
    plugins: [
      VueRouter({
        dts: 'src/typed-router.d.ts',
      }),
      Layouts(),
      Vue({
        template: { transformAssetUrls },
      }),
      // https://github.com/vuetifyjs/vuetify-loader/tree/master/packages/vite-plugin#readme
      Vuetify({
        autoImport: true,
        styles: {
          configFile: 'src/styles/settings.scss',
        },
      }),
      Components({
        dts: 'src/components.d.ts',
      }),
      // Fonts({
      //   // google: {
      //   //   families: [
      //   //     {
      //   //       name: 'Roboto',
      //   //       styles: 'wght@100;300;400;500;700;900',
      //   //     },
      //   //   ],
      //   // },
      //   google: {
      //     families: [
      //       {
      //         name: 'Inter',
      //         styles: 'wght@100;300;400;500;600;700;900',
      //       },
      //     ],
      //   },
      //   // fontsource: {
      //   //   families: [
      //   //     {
      //   //       name: 'Roboto',
      //   //       weights: [100, 300, 400, 500, 700, 900],
      //   //       styles: ['normal', 'italic'],
      //   //     },
      //   //   ],
      //   // },
      // }),
      AutoImport({
        imports: [
          'vue',
          VueRouterAutoImports,
          {
            pinia: ['defineStore', 'storeToRefs'],
          },
        ],
        dts: 'src/auto-imports.d.ts',
        eslintrc: {
          enabled: true,
        },
        vueTemplate: true,
      }),
      {
        name: 'remove-pure-annotations',
        enforce: 'pre',
        transform(code, id) {
          if (id.includes('node_modules/@microsoft/signalr')) {
            return code.replace(/\/\*#__PURE__\*\//g, '')
          }
        },
      },
      viteCompression({
        verbose: true,
        disable: false,
        threshold: 1024 * 10,
        algorithm: 'gzip',
        ext: '.gz',
      }),
      ...(mode === 'analyze'
        ? [
            visualizer({
              filename: 'dist/bundle-report.html',
              gzipSize: true,
              brotliSize: true,
              template: 'treemap',
            }),
          ]
        : []),
      createBuildVersionPlugin(mode),
    ],
    optimizeDeps: {
      exclude: [
        'vuetify',
        'vue-router',
        'unplugin-vue-router/runtime',
        'unplugin-vue-router/data-loaders',
        'unplugin-vue-router/data-loaders/basic',
        'apexcharts',
        'vue3-apexcharts',
        'axios',
        '@microsoft/signalr',
        'vue-i18n',
      ],
    },
    define: { 'process.env': {} },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('src', import.meta.url)),
      },
      extensions: ['.js', '.json', '.jsx', '.mjs', '.ts', '.tsx', '.vue'],
    },
    build: {
      rollupOptions: {
        // https://rollupjs.org/configuration-options/
        output: {
          manualChunks(id) {
            if (id.includes('/node_modules/vuetify/')) {
              return 'a'
            } else if (id.includes('/node_modules/axios/')) {
              return 'b'
            } else if (id.includes('/node_modules/vue-i18n/')) {
              return 'c'
            } else if (id.includes('/node_modules/@vue/')) {
              return 'd'
            } else if (id.includes('/node_modules/@intlify/')) {
              return 'e'
            } else if (
              id.includes('/node_modules/apexcharts/') ||
              id.includes('/node_modules/vue3-apexcharts/')
            ) {
              return 'f'
            } else if (id.includes('/node_modules/@microsoft/signalr/')) {
              return 'g'
            } else if (id.includes('/node_modules/ol/')) {
              return 'h'
            } else if (id.includes('/node_modules/')) {
              return 'z'
            }
          },
          entryFileNames: `assets/[name].[hash].js`,
          chunkFileNames: `assets/[name].[hash].js`,
          assetFileNames: `assets/[name].[hash].[ext]`,
        },
      },
      minify: 'esbuild',
      assetsInlineLimit: 4096, // 4KB 以下的转为 base64
      sourcemap: false,
      reportCompressedSize: true, // gzip 压缩
      cssCodeSplit: true,
    },
    esbuild: {
      drop:
        mode === 'test' || mode === 'sit' || mode === 'development' ? [] : ['console', 'debugger'],
    },
    server: {
      port: 3000,
    },
  }
  let localConfig: UserConfig = {}
  console.log(mode, 'mode')
  if (mode === 'test' || mode === 'development') {
    try {
      // @ts-ignore
      localConfig = (await import('./vite.config.local.mts')).default
    } catch {
      //
    }
  } else {
    //
  }

  // console.log(mode, localConfig, 'config')

  return mergeConfig(shareConfig, localConfig)
})
