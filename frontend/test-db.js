// 简单的数据库测试脚本
import BetterSqlite3 from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dbPath = path.join(process.cwd(), 'data', 'astro_demo.db');

try {
  console.log('🔍 检查数据库文件...');
  console.log('数据库路径:', dbPath);
  
  if (fs.existsSync(dbPath)) {
    console.log('✅ 数据库文件存在');
    
    // 连接数据库
    const db = new BetterSqlite3(dbPath);
    console.log('✅ 数据库连接成功');
    
    // 检查表是否存在
    const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
    console.log('📋 数据库表:', tables.map(t => t.name));
    
    // 检查用户表数据
    try {
      const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get();
      console.log('👥 用户数量:', userCount.count);
    } catch (e) {
      console.log('⚠️ 用户表可能不存在或为空');
    }
    
    // 检查任务表数据
    try {
      const taskCount = db.prepare('SELECT COUNT(*) as count FROM tasks').get();
      console.log('📋 任务数量:', taskCount.count);
    } catch (e) {
      console.log('⚠️ 任务表可能不存在或为空');
    }
    
    // 插入测试数据
    try {
      console.log('🧪 插入测试用户...');
      const insertUser = db.prepare(`
        INSERT INTO users (username, email, password_hash, role) 
        VALUES (?, ?, ?, ?)
      `);
      
      const result = insertUser.run('testuser', 'test@example.com', 'hashedpassword', 'user');
      console.log('✅ 测试用户插入成功，ID:', result.lastInsertRowid);
      
      // 查询测试用户
      const user = db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid);
      console.log('👤 查询到的用户:', user);
      
    } catch (e) {
      console.log('⚠️ 插入测试数据失败:', e.message);
    }
    
    db.close();
    console.log('✅ 数据库测试完成');
    
  } else {
    console.log('❌ 数据库文件不存在，请先运行 npm run init-db');
  }
  
} catch (error) {
  console.error('❌ 数据库测试失败:', error);
} 