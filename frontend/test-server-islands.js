// 测试服务器群岛配置
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🏝️ 测试服务器群岛配置...\n');

// 检查配置文件
try {
  const configPath = join(__dirname, 'astro.config.mjs');
  const configContent = readFileSync(configPath, 'utf-8');
  
  console.log('✅ astro.config.mjs 文件存在');
  
  // 检查关键配置
  const hasNodeAdapter = configContent.includes('@astrojs/node');
  const hasServerOutput = configContent.includes("output: 'server'");
  const hasServerIslandsExperimental = configContent.includes('serverIslands: true');
  
  console.log(`${hasNodeAdapter ? '✅' : '❌'} Node.js 适配器配置`);
  console.log(`${hasServerOutput ? '✅' : '❌'} 服务器输出模式`);
  
  if (hasServerIslandsExperimental) {
    console.log('⚠️  检测到实验性 serverIslands 配置 - 在 Astro 5.0 中已不需要');
  } else {
    console.log('✅ 服务器群岛配置正确 (Astro 5.0 正式功能)');
  }
  
} catch (error) {
  console.log('❌ 配置文件读取失败:', error.message);
}

// 检查组件文件
const components = [
  'src/components/ServerIslandDemo.astro',
  'src/components/InteractiveServerIsland.tsx',
  'src/pages/server-islands.astro',
  'src/pages/api/server-data.ts'
];

console.log('\n📁 检查组件文件:');
components.forEach(component => {
  try {
    const componentPath = join(__dirname, component);
    readFileSync(componentPath, 'utf-8');
    console.log(`✅ ${component}`);
  } catch (error) {
    console.log(`❌ ${component} - ${error.message}`);
  }
});

// 检查页面中的 server:defer 指令
console.log('\n🏝️ 检查服务器群岛指令:');
try {
  const pagePath = join(__dirname, 'src/pages/server-islands.astro');
  const pageContent = readFileSync(pagePath, 'utf-8');
  
  const hasServerDefer = pageContent.includes('server:defer');
  const hasFallbackSlot = pageContent.includes('slot="fallback"');
  
  console.log(`${hasServerDefer ? '✅' : '❌'} server:defer 指令`);
  console.log(`${hasFallbackSlot ? '✅' : '❌'} fallback 插槽`);
  
} catch (error) {
  console.log('❌ 页面文件检查失败:', error.message);
}

// 检查依赖
console.log('\n📦 检查依赖:');
try {
  const packagePath = join(__dirname, 'package.json');
  const packageContent = JSON.parse(readFileSync(packagePath, 'utf-8'));
  
  const hasNodeDep = packageContent.dependencies?.['@astrojs/node'];
  const hasReact = packageContent.dependencies?.['@astrojs/react'];
  const hasAstro = packageContent.dependencies?.['astro'];
  
  console.log(`${hasNodeDep ? '✅' : '❌'} @astrojs/node: ${hasNodeDep || '未安装'}`);
  console.log(`${hasReact ? '✅' : '❌'} @astrojs/react: ${hasReact || '未安装'}`);
  console.log(`${hasAstro ? '✅' : '❌'} astro: ${hasAstro || '未安装'}`);
  
} catch (error) {
  console.log('❌ package.json 读取失败:', error.message);
}

console.log('\n🚀 配置检查完成!');
console.log('\n📖 使用说明:');
console.log('1. 运行 npm run dev 启动开发服务器');
console.log('2. 访问 http://localhost:3000/server-islands 查看示例');
console.log('3. 尝试添加 ?userId=123 参数测试动态数据');
console.log('4. 观察 server:defer 组件的加载过程和 fallback 内容');
console.log('\n📚 更多信息请查看 SERVER-ISLANDS-README.md'); 