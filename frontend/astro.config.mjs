import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import vue from '@astrojs/vue';
import node from '@astrojs/node';
import { loadEnvConfig, getCurrentEnv, getEnvConfig } from './config/env.config.js';

// 获取当前环境
const currentEnv = getCurrentEnv();

// 加载对应环境的配置文件
loadEnvConfig(currentEnv);

// 获取环境特定的配置
const envConfig = getEnvConfig(currentEnv);

console.log(`🚀 构建环境: ${currentEnv}`);
console.log(`📁 输出目录: ${envConfig.outDir}`);

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), react(), vue()],
  adapter: node({
    mode: "standalone"
  }),
  server: {
    port: 3000,
  },
  output: 'server',
  outDir: envConfig.outDir,
  base: envConfig.base,
  build: {
    assets: 'assets',
  },
  vite: {
    define: {
      // 将环境变量注入到客户端代码中
      __APP_ENV__: JSON.stringify(currentEnv),
      __API_URL__: JSON.stringify(process.env.PUBLIC_API_URL),
      __DEBUG__: JSON.stringify(process.env.PUBLIC_DEBUG === 'true'),
    },
    build: {
      // 简化构建配置，避免环境差异导致的问题
      minify: currentEnv === 'development' ? false : 'esbuild',
      sourcemap: currentEnv === 'development',
    }
  }
}); 