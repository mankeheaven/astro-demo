import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { UserModel, type CreateUserData } from '../models/User';
import { TaskModel, type CreateTaskData } from '../models/Task';
import { Database } from '../lib/database';
import * as os from 'os';

// 这里可以安全的运行后端代码
// 所有 Actions 必须在 server 对象下导出
export const server = {
  // 用户注册 Action
  registerUser: defineAction({
    accept: 'json',
    input: z.object({
      username: z.string().min(3, '用户名至少3个字符'),
      email: z.string().email('请输入有效的邮箱地址'),
      password: z.string().min(6, '密码至少6个字符'),
      confirmPassword: z.string(),
    }).refine((data) => data.password === data.confirmPassword, {
      message: "密码不匹配",
      path: ["confirmPassword"],
    }),
    handler: async (input) => {
      // 模拟数据库操作
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 模拟用户已存在的情况
      if (input.username === 'admin') {
        throw new Error('用户名已存在');
      }
      
      return {
        success: true,
        message: `用户 ${input.username} 注册成功！`,
        user: {
          id: Math.random().toString(36).substr(2, 9),
          username: input.username,
          email: input.email,
          createdAt: new Date().toISOString(),
        }
      };
    }
  }),

  // 发送消息 Action
  sendMessage: defineAction({
    accept: 'json',
    input: z.object({
      name: z.string().min(1, '请输入姓名'),
      message: z.string().min(1, '请输入消息内容'),
      type: z.enum(['feedback', 'support', 'general']).default('general'),
    }),
    handler: async (input) => {
      // 模拟发送消息
      await new Promise(resolve => setTimeout(resolve, 800));
      
      return {
        success: true,
        message: '消息发送成功！',
        messageId: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString(),
      };
    }
  }),

  // 获取用户信息 Action
  getUserInfo: defineAction({
    accept: 'json',
    input: z.object({
      userId: z.string().min(1, '用户ID不能为空'),
    }),
    handler: async (input) => {
      // 模拟数据库查询
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 模拟用户数据
      const users = {
        '1': { id: '1', name: '张三', email: 'zhangsan@example.com', role: 'admin' },
        '2': { id: '2', name: '李四', email: 'lisi@example.com', role: 'user' },
        '3': { id: '3', name: '王五', email: 'wangwu@example.com', role: 'user' },
      };
      
      const user = users[input.userId as keyof typeof users];
      
      if (!user) {
        throw new Error('用户不存在');
      }
      
      return {
        success: true,
        user,
      };
    }
  }),

  // 文件上传 Action
  uploadFile: defineAction({
    accept: 'form',
    input: z.object({
      file: z.instanceof(File),
      description: z.string().optional(),
    }),
    handler: async (input) => {
      // 模拟文件上传
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 检查文件大小（5MB限制）
      if (input.file.size > 5 * 1024 * 1024) {
        throw new Error('文件大小不能超过5MB');
      }
      
      // 检查文件类型
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
      if (!allowedTypes.includes(input.file.type)) {
        throw new Error('不支持的文件类型');
      }
      
      return {
        success: true,
        message: '文件上传成功！',
        file: {
          id: Math.random().toString(36).substr(2, 9),
          name: input.file.name,
          size: input.file.size,
          type: input.file.type,
          description: input.description || '',
          uploadedAt: new Date().toISOString(),
          url: `/uploads/${input.file.name}`, // 模拟文件URL
        }
      };
    }
  }),

  // 计算器 Action
  calculate: defineAction({
    accept: 'json',
    input: z.object({
      operation: z.enum(['add', 'subtract', 'multiply', 'divide']),
      a: z.number(),
      b: z.number(),
    }),
    handler: async (input) => {
      const { operation, a, b } = input;
      
      let result: number;
      
      switch (operation) {
        case 'add':
          result = a + b;
          break;
        case 'subtract':
          result = a - b;
          break;
        case 'multiply':
          result = a * b;
          break;
        case 'divide':
          if (b === 0) {
            throw new Error('除数不能为零');
          }
          result = a / b;
          break;
        default:
          throw new Error('无效的操作');
      }
      
      return {
        success: true,
        result,
        operation: `${a} ${operation} ${b} = ${result}`,
      };
    },
  }),

  // 待办事项管理 Action
  manageTodo: defineAction({
    accept: 'json',
    input: z.object({
      action: z.enum(['create', 'update', 'delete', 'toggle']),
      id: z.string().optional(),
      title: z.string().optional(),
      completed: z.boolean().optional(),
    }),
    handler: async (input) => {
      // 模拟数据库操作
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const { action, id, title, completed } = input;
      
      switch (action) {
        case 'create':
          if (!title) {
            throw new Error('标题不能为空');
          }
          return {
            success: true,
            message: '待办事项创建成功',
            todo: {
              id: Math.random().toString(36).substr(2, 9),
              title,
              completed: false,
              createdAt: new Date().toISOString(),
            }
          };
          
        case 'update':
          if (!id || !title) {
            throw new Error('ID和标题不能为空');
          }
          return {
            success: true,
            message: '待办事项更新成功',
            todo: {
              id,
              title,
              completed: completed || false,
              updatedAt: new Date().toISOString(),
            }
          };
          
        case 'delete':
          if (!id) {
            throw new Error('ID不能为空');
          }
          return {
            success: true,
            message: '待办事项删除成功',
            deletedId: id,
          };
          
        case 'toggle':
          if (!id) {
            throw new Error('ID不能为空');
          }
          return {
            success: true,
            message: '状态切换成功',
            todo: {
              id,
              completed: !completed,
              updatedAt: new Date().toISOString(),
            }
          };
          
        default:
          throw new Error('无效的操作');
      }
    }
  }),

  // SQLite 数据库相关 Actions

  // 用户注册 Action (SQLite)
  userRegister: defineAction({
    accept: 'json',
    input: z.object({
      username: z.string().min(3).max(20),
      email: z.string().email(),
      password: z.string().min(6),
      confirmPassword: z.string().min(6),
      role: z.enum(['admin', 'user']).optional()
    }).refine((data) => data.password === data.confirmPassword, {
      message: "密码确认不匹配",
      path: ["confirmPassword"],
    }),
    handler: async ({ username, email, password, role }) => {
      try {
        const user = UserModel.create({
          username,
          email,
          password,
          role
        });

        return {
          success: true,
          message: '用户注册成功',
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            createdAt: user.created_at
          }
        };
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : '注册失败');
      }
    }
  }),

  // 获取用户信息 Action (SQLite)
  userGetById: defineAction({
    accept: 'json',
    input: z.object({
      userId: z.number().int().positive()
    }),
    handler: async ({ userId }) => {
      try {
        const user = UserModel.findById(userId);
        
        if (!user) {
          throw new Error('用户不存在');
        }

        return {
          success: true,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            createdAt: user.created_at
          }
        };
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : '获取用户失败');
      }
    }
  }),

  // 获取所有用户 Action (SQLite)
  userGetAll: defineAction({
    accept: 'json',
    input: z.object({
      limit: z.number().int().positive().max(100).default(20),
      offset: z.number().int().min(0).default(0)
    }),
    handler: async ({ limit, offset }) => {
      try {
        const users = UserModel.getAll(limit, offset);
        
        return {
          success: true,
          users: users.map(user => ({
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            createdAt: user.created_at
          })),
          pagination: {
            limit,
            offset,
            hasMore: users.length === limit
          }
        };
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : '获取用户列表失败');
      }
    }
  }),

  // 删除用户 Action (SQLite)
  userDelete: defineAction({
    accept: 'json',
    input: z.object({
      userId: z.number().int().positive()
    }),
    handler: async ({ userId }) => {
      try {
        const success = UserModel.delete(userId);
        
        if (!success) {
          throw new Error('用户不存在或删除失败');
        }

        return {
          success: true,
          message: '用户删除成功'
        };
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : '删除用户失败');
      }
    }
  }),

  // 创建任务 Action (SQLite)
  taskCreate: defineAction({
    accept: 'json',
    input: z.object({
      name: z.string().min(1).max(100),
      description: z.string().optional(),
      schedule: z.string().min(1),
      handler: z.string().min(1),
      enabled: z.boolean().default(true)
    }),
    handler: async (taskData) => {
      try {
        const task = TaskModel.create(taskData);

        return {
          success: true,
          message: '任务创建成功',
          task: {
            id: task.id,
            name: task.name,
            description: task.description,
            schedule: task.schedule,
            handler: task.handler,
            enabled: task.enabled,
            status: task.status,
            createdAt: task.created_at
          }
        };
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : '创建任务失败');
      }
    }
  }),

  // 获取所有任务 Action (SQLite)
  taskGetAll: defineAction({
    accept: 'json',
    handler: async () => {
      try {
        const tasks = TaskModel.getAll();

        return {
          success: true,
          tasks: tasks.map(task => ({
            id: task.id,
            name: task.name,
            description: task.description,
            schedule: task.schedule,
            handler: task.handler,
            enabled: task.enabled,
            lastRun: task.last_run,
            status: task.status,
            errorCount: task.error_count,
            createdAt: task.created_at
          }))
        };
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : '获取任务列表失败');
      }
    }
  }),

  // 切换任务状态 Action (SQLite)
  taskToggle: defineAction({
    accept: 'json',
    input: z.object({
      taskId: z.number().int().positive()
    }),
    handler: async ({ taskId }) => {
      try {
        const success = TaskModel.toggleEnabled(taskId);
        
        if (!success) {
          throw new Error('任务不存在');
        }

        return {
          success: true,
          message: '任务状态已更新'
        };
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : '更新任务状态失败');
      }
    }
  }),

  // 执行任务 Action (SQLite)
  taskRun: defineAction({
    accept: 'json',
    input: z.object({
      taskId: z.number().int().positive()
    }),
    handler: async ({ taskId }) => {
      try {
        const task = TaskModel.findById(taskId);
        
        if (!task) {
          throw new Error('任务不存在');
        }

        if (!task.enabled) {
          throw new Error('任务已禁用');
        }

        // 记录任务开始
        TaskModel.addLog(taskId, 'started', '任务开始执行');
        TaskModel.updateStatus(taskId, 'running');

        const startTime = Date.now();

        try {
          // 这里执行实际的任务逻辑
          await executeTaskHandler(task.handler);
          
          const duration = Date.now() - startTime;
          
          // 记录任务完成
          TaskModel.updateStatus(taskId, 'completed');
          TaskModel.updateLastRun(taskId);
          TaskModel.addLog(taskId, 'completed', '任务执行成功', duration);

          return {
            success: true,
            message: '任务执行成功',
            duration
          };
        } catch (error) {
          const duration = Date.now() - startTime;
          const errorMessage = error instanceof Error ? error.message : '任务执行失败';
          
          // 记录任务失败
          TaskModel.updateStatus(taskId, 'failed');
          TaskModel.incrementErrorCount(taskId);
          TaskModel.addLog(taskId, 'failed', errorMessage, duration);

          throw new Error(errorMessage);
        }
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : '执行任务失败');
      }
    }
  }),

  // 获取任务日志 Action (SQLite)
  taskGetLogs: defineAction({
    accept: 'json',
    input: z.object({
      taskId: z.number().int().positive(),
      limit: z.number().int().positive().max(100).default(20)
    }),
    handler: async ({ taskId, limit }) => {
      try {
        const logs = TaskModel.getLogs(taskId, limit);

        return {
          success: true,
          logs: logs.map(log => ({
            id: log.id,
            status: log.status,
            message: log.message,
            durationMs: log.duration_ms,
            createdAt: log.created_at
          }))
        };
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : '获取任务日志失败');
      }
    }
  }),

  // 删除任务 Action (SQLite)
  taskDelete: defineAction({
    accept: 'json',
    input: z.object({
      taskId: z.number().int().positive()
    }),
    handler: async ({ taskId }) => {
      try {
        const success = TaskModel.delete(taskId);
        
        if (!success) {
          throw new Error('任务不存在或删除失败');
        }

        return {
          success: true,
          message: '任务删除成功'
        };
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : '删除任务失败');
      }
    }
  }),

  // 获取数据库统计信息 Action (SQLite)
  statsGetDashboard: defineAction({
    accept: 'json',
    handler: async () => {
      try {
        const userCountResult = Database.query<{count: number}>(
          'SELECT COUNT(*) as count FROM users'
        );
        
        const taskCountResult = Database.query<{count: number}>(
          'SELECT COUNT(*) as count FROM tasks'
        );
        
        const enabledTaskCountResult = Database.query<{count: number}>(
          'SELECT COUNT(*) as count FROM tasks WHERE enabled = 1'
        );
        
        const recentTasksResult = Database.query<{status: string, count: number}>(
          'SELECT status, COUNT(*) as count FROM tasks GROUP BY status'
        );

        const tasksByStatus = recentTasksResult.reduce((acc: any, row: any) => {
          acc[row.status] = row.count;
          return acc;
        }, {});

        return {
          success: true,
          stats: {
            totalUsers: userCountResult[0]?.count || 0,
            totalTasks: taskCountResult[0]?.count || 0,
            enabledTasks: enabledTaskCountResult[0]?.count || 0,
            tasksByStatus: {
              pending: tasksByStatus.pending || 0,
              running: tasksByStatus.running || 0,
              completed: tasksByStatus.completed || 0,
              failed: tasksByStatus.failed || 0
            }
          }
        };
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : '获取统计信息失败');
      }
    }
  }),

  // 获取系统资源使用情况 Action
  getSystemStats: defineAction({
    accept: 'json',
    handler: async () => {
      try {
        // 获取 CPU 使用率
        const cpus = os.cpus();
        const cpuCount = cpus.length;
        
        // 计算 CPU 使用率（需要两次采样）
        const getCpuUsage = () => {
          return new Promise<number>((resolve) => {
            const startMeasure = cpus.map(cpu => {
              const total = Object.values(cpu.times).reduce((acc, time) => acc + time, 0);
              const idle = cpu.times.idle;
              return { total, idle };
            });

            setTimeout(() => {
              const endMeasure = os.cpus().map(cpu => {
                const total = Object.values(cpu.times).reduce((acc, time) => acc + time, 0);
                const idle = cpu.times.idle;
                return { total, idle };
              });

              const totalDiff = endMeasure.reduce((acc, end, i) => acc + (end.total - startMeasure[i].total), 0);
              const idleDiff = endMeasure.reduce((acc, end, i) => acc + (end.idle - startMeasure[i].idle), 0);
              
              const cpuUsage = 100 - (idleDiff / totalDiff * 100);
              resolve(Math.round(cpuUsage * 100) / 100);
            }, 100);
          });
        };

        const cpuUsage = await getCpuUsage();

        // 获取内存使用情况
        const totalMemory = os.totalmem();
        const freeMemory = os.freemem();
        const usedMemory = totalMemory - freeMemory;
        const memoryUsagePercent = (usedMemory / totalMemory) * 100;

        // 获取磁盘使用情况（使用 fs 模块）
        const fs = await import('fs');
        const path = await import('path');
        
        let diskUsage = { total: 0, used: 0, free: 0, usagePercent: 0 };
        try {
          // 获取根目录的磁盘使用情况
          const rootPath = process.platform === 'win32' ? 'C:\\' : '/';
          const stats = fs.statSync(rootPath);
          
          // 对于 Windows 和 Unix 系统，使用不同的方法获取磁盘信息
          if (process.platform === 'win32') {
            // Windows 系统使用 statvfs 或估算
            const { execSync } = await import('child_process');
            try {
              const output = execSync('wmic logicaldisk get size,freespace,caption', { encoding: 'utf8' });
              const lines = output.split('\n').filter(line => line.trim() && !line.includes('Caption'));
              if (lines.length > 0) {
                const parts = lines[0].trim().split(/\s+/);
                if (parts.length >= 3) {
                  const freeSpace = parseInt(parts[1]) || 0;
                  const totalSpace = parseInt(parts[2]) || 0;
                  const usedSpace = totalSpace - freeSpace;
                  
                  diskUsage = {
                    total: Math.round(totalSpace / 1024 / 1024 / 1024 * 100) / 100, // GB
                    used: Math.round(usedSpace / 1024 / 1024 / 1024 * 100) / 100, // GB
                    free: Math.round(freeSpace / 1024 / 1024 / 1024 * 100) / 100, // GB
                    usagePercent: totalSpace > 0 ? Math.round((usedSpace / totalSpace) * 100 * 100) / 100 : 0
                  };
                }
              }
            } catch (e) {
              // Windows 命令失败时的默认值
              diskUsage = { total: 100, used: 50, free: 50, usagePercent: 50 };
            }
          } else {
            // Unix 系统使用 statvfs
            try {
              const { execSync } = await import('child_process');
              const output = execSync('df -h /', { encoding: 'utf8' });
              const lines = output.split('\n');
              if (lines.length > 1) {
                const parts = lines[1].split(/\s+/);
                if (parts.length >= 5) {
                  const total = parseFloat(parts[1].replace('G', '')) || 0;
                  const used = parseFloat(parts[2].replace('G', '')) || 0;
                  const available = parseFloat(parts[3].replace('G', '')) || 0;
                  const usagePercent = parseFloat(parts[4].replace('%', '')) || 0;
                  
                  diskUsage = {
                    total: Math.round(total * 100) / 100,
                    used: Math.round(used * 100) / 100,
                    free: Math.round(available * 100) / 100,
                    usagePercent: Math.round(usagePercent * 100) / 100
                  };
                }
              }
            } catch (e) {
              // Unix 命令失败时的默认值
              diskUsage = { total: 100, used: 50, free: 50, usagePercent: 50 };
            }
          }
        } catch (e) {
          // 磁盘信息获取失败时的默认值
          diskUsage = { total: 0, used: 0, free: 0, usagePercent: 0 };
        }

        // 获取网络使用情况
        const networkInterfaces = os.networkInterfaces();
        let networkStats = { bytesReceived: 0, bytesSent: 0, packetsReceived: 0, packetsSent: 0 };
        
        try {
          // 尝试读取网络统计信息
          if (process.platform === 'linux') {
            const { execSync } = await import('child_process');
            try {
              const output = execSync('cat /proc/net/dev', { encoding: 'utf8' });
              const lines = output.split('\n');
              let totalRx = 0, totalTx = 0;
              
              for (const line of lines) {
                if (line.includes(':') && !line.includes('lo:')) { // 排除回环接口
                  const parts = line.split(':')[1]?.trim().split(/\s+/);
                  if (parts && parts.length >= 9) {
                    totalRx += parseInt(parts[0]) || 0; // 接收字节
                    totalTx += parseInt(parts[8]) || 0; // 发送字节
                  }
                }
              }
              
              networkStats = {
                bytesReceived: Math.round(totalRx / 1024 / 1024 * 100) / 100, // MB
                bytesSent: Math.round(totalTx / 1024 / 1024 * 100) / 100, // MB
                packetsReceived: 0, // 暂不统计包数量
                packetsSent: 0
              };
            } catch (e) {
              // Linux 网络统计获取失败
            }
          } else {
            // 其他系统使用网络接口信息作为基础数据
            const interfaces = Object.values(networkInterfaces).flat().filter(iface => 
              iface && !iface.internal && iface.family === 'IPv4'
            );
            
            // 模拟网络使用情况（实际项目中可以使用专门的网络监控库）
            networkStats = {
              bytesReceived: Math.random() * 1000, // 模拟数据
              bytesSent: Math.random() * 500,
              packetsReceived: Math.floor(Math.random() * 10000),
              packetsSent: Math.floor(Math.random() * 5000)
            };
          }
        } catch (e) {
          // 网络统计获取失败时的默认值
          networkStats = { bytesReceived: 0, bytesSent: 0, packetsReceived: 0, packetsSent: 0 };
        }

        // 获取系统信息
        const platform = os.platform();
        const arch = os.arch();
        const hostname = os.hostname();
        const uptime = os.uptime();

        // 获取负载平均值（仅在 Unix 系统上可用）
        let loadAverage = [0, 0, 0];
        try {
          loadAverage = os.loadavg();
        } catch (e) {
          // Windows 系统不支持 loadavg
        }

        return {
          success: true,
          stats: {
            cpu: {
              usage: cpuUsage,
              cores: cpuCount,
              model: cpus[0]?.model || 'Unknown',
              loadAverage: loadAverage
            },
            memory: {
              total: Math.round(totalMemory / 1024 / 1024 / 1024 * 100) / 100, // GB
              used: Math.round(usedMemory / 1024 / 1024 / 1024 * 100) / 100, // GB
              free: Math.round(freeMemory / 1024 / 1024 / 1024 * 100) / 100, // GB
              usagePercent: Math.round(memoryUsagePercent * 100) / 100
            },
            disk: diskUsage,
            network: networkStats,
            system: {
              platform,
              arch,
              hostname,
              uptime: Math.round(uptime), // 秒
              nodeVersion: process.version
            },
            timestamp: new Date().toISOString()
          }
        };
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : '获取系统统计信息失败');
      }
    }
  }),

  // 简单的测试 Action
  hello: defineAction({
    accept: 'json',
    input: z.object({
      name: z.string(),
    }),
    handler: async (input) => {
      return {
        success: true,
        message: `Hello, ${input.name}!`,
      };
    },
  })
};

// 任务处理器执行函数
async function executeTaskHandler(handler: string): Promise<void> {
  switch (handler) {
    case 'cleanupOldData':
      await cleanupOldData();
      break;
    case 'syncData':
      await syncData();
      break;
    case 'generateReport':
      await generateReport();
      break;
    case 'backupDatabase':
      await backupDatabase();
      break;
    default:
      throw new Error(`未知的任务处理器: ${handler}`);
  }
}

// 具体的任务处理函数
async function cleanupOldData(): Promise<void> {
  // 清理30天前的日志
  Database.query(
    'DELETE FROM task_logs WHERE created_at < datetime("now", "-30 days")'
  );
  console.log('✅ 清理旧数据完成');
}

async function syncData(): Promise<void> {
  // 模拟数据同步
  await new Promise(resolve => setTimeout(resolve, 2000));
  console.log('✅ 数据同步完成');
}

async function generateReport(): Promise<void> {
  // 模拟报告生成
  await new Promise(resolve => setTimeout(resolve, 3000));
  console.log('✅ 报告生成完成');
}

async function backupDatabase(): Promise<void> {
  // 模拟数据库备份
  await new Promise(resolve => setTimeout(resolve, 5000));
  console.log('✅ 数据库备份完成');
} 