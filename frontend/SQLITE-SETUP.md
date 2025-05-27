# SQLite 数据库配置说明

## 📋 概述

本项目集成了 SQLite 数据库，提供完整的数据库操作演示，包括用户管理、任务调度、数据统计等功能。SQLite 是一个轻量级的嵌入式数据库，无需单独的数据库服务器，非常适合开发和演示。

## 🛠️ 安装和配置

### 1. 安装依赖

```bash
npm install better-sqlite3 @types/better-sqlite3 bcrypt @types/bcrypt
```

### 2. 数据库文件

SQLite 数据库文件会自动创建在 `data/astro_demo.db`，无需手动配置。

### 3. 初始化数据库表

```bash
# 运行数据库初始化脚本
npm run init-db

# 或手动运行
node scripts/init-db.ts
```

## 📊 数据库表结构

### users 表
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'user' CHECK(role IN ('admin', 'user')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### tasks 表
```sql
CREATE TABLE tasks (
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
);
```

### task_logs 表
```sql
CREATE TABLE task_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  task_id INTEGER NOT NULL,
  status TEXT NOT NULL CHECK(status IN ('started', 'completed', 'failed')),
  message TEXT,
  duration_ms INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
);
```

### todos 表
```sql
CREATE TABLE todos (
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
);
```

## 🚀 使用方法

### 1. 启动项目

```bash
npm run dev
```

### 2. 访问数据库演示

打开浏览器访问：`http://localhost:3000/database-demo`

### 3. 测试功能

- **用户管理**：创建、查询、删除用户
- **任务管理**：创建、执行、监控定时任务
- **数据统计**：查看实时数据统计
- **日志记录**：查看操作日志和任务执行记录

## 🔧 API 接口

### 用户相关
- `POST /api/users` - 创建用户
- `GET /api/users` - 获取用户列表
- `GET /api/users/:id` - 获取用户详情
- `DELETE /api/users/:id` - 删除用户

### 任务相关
- `POST /api/tasks` - 创建任务
- `GET /api/tasks` - 获取任务列表
- `PUT /api/tasks/:id/toggle` - 切换任务状态
- `POST /api/tasks/:id/run` - 执行任务
- `GET /api/tasks/:id/logs` - 获取任务日志

### 统计相关
- `GET /api/stats/dashboard` - 获取仪表板统计

## 🛡️ 安全特性

- **密码加密**：使用 bcrypt 进行密码哈希
- **SQL 注入防护**：使用参数化查询
- **输入验证**：使用 Zod 进行数据验证
- **错误处理**：统一的错误处理机制
- **事务支持**：SQLite 事务处理

## ✨ SQLite 特性

### 优势
- **零配置**：无需安装和配置数据库服务器
- **轻量级**：数据库文件小，性能优秀
- **跨平台**：支持所有主流操作系统
- **ACID 兼容**：支持事务和数据完整性
- **标准 SQL**：支持大部分 SQL 标准

### WAL 模式
项目启用了 WAL (Write-Ahead Logging) 模式：
- 提高并发性能
- 减少锁定时间
- 支持同时读写操作

### 外键约束
启用了外键约束确保数据完整性：
- 自动维护引用完整性
- 级联删除支持
- 防止孤立数据

## 🔍 故障排除

### 权限问题
```bash
# 确保数据目录有写权限
chmod 755 data/
chmod 644 data/astro_demo.db
```

### 文件锁定
```bash
# 如果数据库被锁定，检查是否有其他进程在使用
lsof data/astro_demo.db

# 或重启应用
npm run dev
```

### 数据库损坏
```bash
# 检查数据库完整性
sqlite3 data/astro_demo.db "PRAGMA integrity_check;"

# 修复数据库（如果需要）
sqlite3 data/astro_demo.db "VACUUM;"
```

## 📝 注意事项

1. **备份**：定期备份 `data/astro_demo.db` 文件
2. **并发**：SQLite 支持多读单写，适合中小型应用
3. **大小限制**：单个数据库文件最大 281TB
4. **性能**：对于大量并发写入，考虑使用 PostgreSQL 或 MySQL
5. **部署**：确保生产环境有足够的磁盘空间

## 🔄 迁移到其他数据库

如果需要迁移到 PostgreSQL 或 MySQL：

1. **导出数据**：
```bash
sqlite3 data/astro_demo.db .dump > backup.sql
```

2. **转换 SQL**：
- 修改数据类型（INTEGER → INT）
- 调整自增语法（AUTOINCREMENT → AUTO_INCREMENT）
- 更新日期时间函数

3. **更新代码**：
- 修改连接配置
- 调整查询语法
- 更新数据类型映射

## 🔗 相关链接

- [SQLite 官方文档](https://www.sqlite.org/docs.html)
- [better-sqlite3 文档](https://github.com/WiseLibs/better-sqlite3)
- [bcrypt 加密库](https://github.com/kelektiv/node.bcrypt.js)
- [Zod 验证库](https://github.com/colinhacks/zod)
- [SQLite WAL 模式](https://www.sqlite.org/wal.html) 