// SQLite 数据库初始化脚本
import { initDatabaseTables } from '../src/lib/database';

async function main() {
  try {
    console.log('🚀 开始初始化 SQLite 数据库...');
    await initDatabaseTables();
    console.log('✅ SQLite 数据库初始化完成');
    process.exit(0);
  } catch (error) {
    console.error('❌ 数据库初始化失败:', error);
    process.exit(1);
  }
}

main(); 