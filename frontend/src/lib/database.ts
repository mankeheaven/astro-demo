// SQLite 数据库连接配置
import BetterSqlite3 from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// 数据库文件路径
const dbPath = path.join(process.cwd(), 'data', 'astro_demo.db');

// 创建数据库连接
let db: BetterSqlite3.Database | null = null;

// 初始化数据库连接
function initDatabase(): BetterSqlite3.Database {
  if (!db) {
    try {
      // 确保数据目录存在
      const dataDir = path.dirname(dbPath);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      db = new BetterSqlite3(dbPath);
      db.pragma('journal_mode = WAL'); // 启用 WAL 模式提高性能
      db.pragma('foreign_keys = ON'); // 启用外键约束
      console.log('✅ SQLite 数据库连接已创建');
    } catch (error) {
      console.error('❌ 创建 SQLite 数据库连接失败:', error);
      throw error;
    }
  }
  return db;
}

// 获取数据库连接
function getDatabase(): BetterSqlite3.Database {
  if (!db) {
    return initDatabase();
  }
  return db;
}

// 数据库工具函数
export class Database {
  static query<T = any>(sql: string, params?: any[]): T[] {
    try {
      const database = getDatabase();
      const stmt = database.prepare(sql);
      
      if (sql.trim().toLowerCase().startsWith('select')) {
        return stmt.all(params || []) as T[];
      } else {
        const result = stmt.run(params || []);
        return [result] as any;
      }
    } catch (error) {
      console.error('数据库查询错误:', error);
      // 如果是连接错误，返回空数组而不是抛出错误
      if (error instanceof Error && error.message.includes('database')) {
        console.warn('⚠️ 数据库连接失败，返回空结果');
        return [];
      }
      throw new Error('数据库操作失败');
    }
  }

  static queryOne<T = any>(sql: string, params?: any[]): T | null {
    try {
      const database = getDatabase();
      const stmt = database.prepare(sql);
      const result = stmt.get(params || []) as T;
      return result || null;
    } catch (error) {
      console.error('数据库查询错误:', error);
      return null;
    }
  }

  static insert(table: string, data: Record<string, any>): number {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map(() => '?').join(', ');
    
    const sql = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders})`;
    
    try {
      const database = getDatabase();
      const stmt = database.prepare(sql);
      const result = stmt.run(values);
      return result.lastInsertRowid as number;
    } catch (error) {
      console.error('插入数据错误:', error);
      throw new Error('插入数据失败');
    }
  }

  static update(
    table: string, 
    data: Record<string, any>, 
    where: string, 
    whereParams: any[]
  ): number {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const setClause = keys.map(key => `${key} = ?`).join(', ');
    
    const sql = `UPDATE ${table} SET ${setClause} WHERE ${where}`;
    
    try {
      const database = getDatabase();
      const stmt = database.prepare(sql);
      const result = stmt.run([...values, ...whereParams]);
      return result.changes;
    } catch (error) {
      console.error('更新数据错误:', error);
      throw new Error('更新数据失败');
    }
  }

  static delete(table: string, where: string, whereParams: any[]): number {
    const sql = `DELETE FROM ${table} WHERE ${where}`;
    
    try {
      const database = getDatabase();
      const stmt = database.prepare(sql);
      const result = stmt.run(whereParams);
      return result.changes;
    } catch (error) {
      console.error('删除数据错误:', error);
      throw new Error('删除数据失败');
    }
  }

  // 事务支持
  static transaction<T>(callback: (db: BetterSqlite3.Database) => T): T {
    const database = getDatabase();
    
    try {
      const transaction = database.transaction(() => callback(database));
      return transaction();
    } catch (error) {
      throw error;
    }
  }

  // 检查数据库连接
  static checkConnection(): boolean {
    try {
      const database = getDatabase();
      database.prepare('SELECT 1').get();
      return true;
    } catch (error) {
      console.error('数据库连接检查失败:', error);
      return false;
    }
  }

  // 关闭数据库连接
  static close(): void {
    if (db) {
      db.close();
      db = null;
      console.log('✅ SQLite 数据库连接已关闭');
    }
  }
}

// 初始化数据库表
export async function initDatabaseTables() {
  try {
    // 先检查连接
    const isConnected = Database.checkConnection();
    if (!isConnected) {
      console.warn('⚠️ 数据库连接失败，跳过表初始化');
      return;
    }

    // 创建用户表
    Database.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT DEFAULT 'user' CHECK(role IN ('admin', 'user')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 创建任务表
    Database.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        schedule TEXT NOT NULL,
        handler TEXT NOT NULL,
        enabled BOOLEAN DEFAULT TRUE,
        last_run DATETIME NULL,
        next_run DATETIME NULL,
        status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'running', 'completed', 'failed')),
        error_count INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 创建日志表
    Database.query(`
      CREATE TABLE IF NOT EXISTS task_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        task_id INTEGER NOT NULL,
        status TEXT NOT NULL CHECK(status IN ('started', 'completed', 'failed')),
        message TEXT,
        duration_ms INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
      )
    `);

    // 创建待办事项表
    Database.query(`
      CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        priority TEXT DEFAULT 'medium' CHECK(priority IN ('low', 'medium', 'high')),
        completed BOOLEAN DEFAULT FALSE,
        due_date DATETIME NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // 创建更新时间触发器
    Database.query(`
      CREATE TRIGGER IF NOT EXISTS update_users_updated_at 
      AFTER UPDATE ON users
      BEGIN
        UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
      END
    `);

    Database.query(`
      CREATE TRIGGER IF NOT EXISTS update_tasks_updated_at 
      AFTER UPDATE ON tasks
      BEGIN
        UPDATE tasks SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
      END
    `);

    Database.query(`
      CREATE TRIGGER IF NOT EXISTS update_todos_updated_at 
      AFTER UPDATE ON todos
      BEGIN
        UPDATE todos SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
      END
    `);

    console.log('✅ SQLite 数据库表初始化完成');
  } catch (error) {
    console.error('❌ 数据库初始化失败:', error);
    throw error;
  }
} 