import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * 根据环境加载对应的环境变量文件
 * @param {string} env - 环境名称 (development, test, production)
 */
export function loadEnvConfig(env = 'development') {
  const envFile = resolve(__dirname, `../env.${env}`);
  
  try {
    const result = config({ path: envFile });
    if (result.error) {
      console.warn(`警告: 无法加载环境文件 ${envFile}:`, result.error.message);
    } else {
      console.log(`✅ 已加载环境配置: ${envFile}`);
    }
    return result;
  } catch (error) {
    console.error(`错误: 加载环境配置失败:`, error.message);
    return { error };
  }
}

/**
 * 获取当前环境
 */
export function getCurrentEnv() {
  return process.env.BUILD_ENV || process.env.NODE_ENV || 'development';
}

/**
 * 获取环境特定的配置
 */
export function getEnvConfig(env) {
  const configs = {
    development: {
      outDir: './dist/dev',
      base: '/',
      mode: 'development'
    },
    test: {
      outDir: './dist/test',
      base: '/',
      mode: 'production'
    },
    production: {
      outDir: './dist/prod',
      base: '/',
      mode: 'production'
    }
  };
  
  return configs[env] || configs.development;
} 