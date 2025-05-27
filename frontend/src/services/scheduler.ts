// 定时任务服务
import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';

// 模拟任务存储
interface ScheduledTask {
  id: string;
  name: string;
  schedule: string; // cron 表达式
  handler: string;
  enabled: boolean;
  lastRun?: Date;
  nextRun?: Date;
  status: 'pending' | 'running' | 'completed' | 'failed';
}

class TaskScheduler {
  private tasks: Map<string, ScheduledTask> = new Map();
  private intervals: Map<string, NodeJS.Timeout> = new Map();

  constructor() {
    // 初始化一些示例任务
    this.addTask({
      id: 'daily-cleanup',
      name: '每日清理任务',
      schedule: '0 2 * * *', // 每天凌晨2点
      handler: 'cleanupOldData',
      enabled: true,
      status: 'pending'
    });

    this.addTask({
      id: 'hourly-sync',
      name: '每小时数据同步',
      schedule: '0 * * * *', // 每小时
      handler: 'syncData',
      enabled: true,
      status: 'pending'
    });

    this.addTask({
      id: 'weekly-report',
      name: '周报生成',
      schedule: '0 9 * * 1', // 每周一上午9点
      handler: 'generateWeeklyReport',
      enabled: false,
      status: 'pending'
    });
  }

  addTask(task: ScheduledTask) {
    this.tasks.set(task.id, task);
    if (task.enabled) {
      this.scheduleTask(task);
    }
  }

  private scheduleTask(task: ScheduledTask) {
    // 简化的调度逻辑（实际项目中应使用 node-cron 等库）
    const interval = this.parseSchedule(task.schedule);
    if (interval > 0) {
      const timeoutId = setInterval(() => {
        this.executeTask(task.id);
      }, interval);
      this.intervals.set(task.id, timeoutId);
    }
  }

  private parseSchedule(schedule: string): number {
    // 简化的 cron 解析（实际应使用专业库）
    if (schedule === '0 * * * *') return 60 * 60 * 1000; // 1小时
    if (schedule === '0 2 * * *') return 24 * 60 * 60 * 1000; // 24小时
    if (schedule === '0 9 * * 1') return 7 * 24 * 60 * 60 * 1000; // 7天
    return 0;
  }

  async executeTask(taskId: string) {
    const task = this.tasks.get(taskId);
    if (!task || !task.enabled) return;

    console.log(`🚀 执行任务: ${task.name}`);
    task.status = 'running';
    task.lastRun = new Date();

    try {
      await this.runTaskHandler(task.handler);
      task.status = 'completed';
      console.log(`✅ 任务完成: ${task.name}`);
    } catch (error) {
      task.status = 'failed';
      console.error(`❌ 任务失败: ${task.name}`, error);
    }

    this.tasks.set(taskId, task);
  }

  private async runTaskHandler(handler: string) {
    switch (handler) {
      case 'cleanupOldData':
        await this.cleanupOldData();
        break;
      case 'syncData':
        await this.syncData();
        break;
      case 'generateWeeklyReport':
        await this.generateWeeklyReport();
        break;
      case 'backupDatabase':
        await this.backupDatabase();
        break;
      case 'sendNotifications':
        await this.sendNotifications();
        break;
      default:
        throw new Error(`未知的任务处理器: ${handler}`);
    }
  }

  private async cleanupOldData() {
    // 模拟清理旧数据
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('🧹 清理了 100 条过期数据');
  }

  private async syncData() {
    // 模拟数据同步
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('🔄 同步了 50 条新数据');
  }

  private async generateWeeklyReport() {
    // 模拟生成报告
    await new Promise(resolve => setTimeout(resolve, 3000));
    console.log('📊 生成了周报');
  }

  private async backupDatabase() {
    // 模拟数据库备份
    await new Promise(resolve => setTimeout(resolve, 5000));
    console.log('💾 数据库备份完成');
  }

  private async sendNotifications() {
    // 模拟发送通知
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log('📧 发送了 25 条通知');
  }

  getAllTasks(): ScheduledTask[] {
    return Array.from(this.tasks.values());
  }

  getTask(id: string): ScheduledTask | undefined {
    return this.tasks.get(id);
  }

  toggleTask(id: string): boolean {
    const task = this.tasks.get(id);
    if (!task) return false;

    task.enabled = !task.enabled;
    
    if (task.enabled) {
      this.scheduleTask(task);
    } else {
      const interval = this.intervals.get(id);
      if (interval) {
        clearInterval(interval);
        this.intervals.delete(id);
      }
    }

    this.tasks.set(id, task);
    return true;
  }

  async runTaskNow(id: string): Promise<boolean> {
    const task = this.tasks.get(id);
    if (!task) return false;

    await this.executeTask(id);
    return true;
  }
}

// 全局任务调度器实例
export const taskScheduler = new TaskScheduler();

// 定时任务相关的 Actions
export const schedulerActions = {
  // 获取所有任务
  getTasks: defineAction({
    handler: async () => {
      return taskScheduler.getAllTasks();
    }
  }),

  // 切换任务状态
  toggleTask: defineAction({
    input: z.object({
      taskId: z.string()
    }),
    handler: async ({ taskId }) => {
      const success = taskScheduler.toggleTask(taskId);
      if (!success) {
        throw new Error(`任务 ${taskId} 不存在`);
      }
      return { success: true, message: '任务状态已更新' };
    }
  }),

  // 立即执行任务
  runTaskNow: defineAction({
    input: z.object({
      taskId: z.string()
    }),
    handler: async ({ taskId }) => {
      const success = await taskScheduler.runTaskNow(taskId);
      if (!success) {
        throw new Error(`任务 ${taskId} 不存在`);
      }
      return { success: true, message: '任务已开始执行' };
    }
  }),

  // 添加新任务
  addTask: defineAction({
    input: z.object({
      name: z.string(),
      schedule: z.string(),
      handler: z.string(),
      enabled: z.boolean().default(true)
    }),
    handler: async ({ name, schedule, handler, enabled }) => {
      const id = `task-${Date.now()}`;
      taskScheduler.addTask({
        id,
        name,
        schedule,
        handler,
        enabled,
        status: 'pending'
      });
      return { success: true, taskId: id, message: '任务已添加' };
    }
  })
}; 