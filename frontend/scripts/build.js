#!/usr/bin/env node

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * 执行构建命令
 * @param {string} env - 环境名称
 * @param {string} command - 要执行的命令 (build, dev, preview)
 */
function runBuild(env, command = 'build') {
  console.log(`🚀 开始${command === 'build' ? '构建' : command === 'dev' ? '开发' : '预览'} - 环境: ${env}`);
  
  const astroCommand = command === 'build' ? 'astro build' : 
                      command === 'dev' ? 'astro dev' : 'astro preview';
  
  // 设置环境变量
  const env_vars = {
    ...process.env,
    BUILD_ENV: env,
    NODE_ENV: env === 'development' ? 'development' : 'production'
  };
  
  // 在Windows上使用cmd，在其他系统上使用sh
  const isWindows = process.platform === 'win32';
  const shell = isWindows ? 'cmd' : 'sh';
  const shellFlag = isWindows ? '/c' : '-c';
  
  const child = spawn(shell, [shellFlag, astroCommand], {
    cwd: resolve(__dirname, '..'),
    env: env_vars,
    stdio: 'inherit'
  });
  
  child.on('close', (code) => {
    if (code === 0) {
      console.log(`✅ ${command === 'build' ? '构建' : command === 'dev' ? '开发服务器启动' : '预览'}完成 - 环境: ${env}`);
    } else {
      console.error(`❌ ${command === 'build' ? '构建' : command}失败 - 退出代码: ${code}`);
      process.exit(code);
    }
  });
  
  child.on('error', (error) => {
    console.error(`❌ 执行命令时出错:`, error);
    process.exit(1);
  });
}

// 解析命令行参数
const args = process.argv.slice(2);
const env = args[0] || 'development';
const command = args[1] || 'build';

// 验证环境参数
const validEnvs = ['development', 'test', 'production'];
if (!validEnvs.includes(env)) {
  console.error(`❌ 无效的环境: ${env}`);
  console.log(`可用的环境: ${validEnvs.join(', ')}`);
  process.exit(1);
}

// 验证命令参数
const validCommands = ['build', 'dev', 'preview'];
if (!validCommands.includes(command)) {
  console.error(`❌ 无效的命令: ${command}`);
  console.log(`可用的命令: ${validCommands.join(', ')}`);
  process.exit(1);
}

runBuild(env, command); 