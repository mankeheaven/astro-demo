# Astro 服务功能完整指南

## 概述

除了 Actions 之外，Astro 还可以提供丰富的服务端功能，包括定时任务、后台服务、中间件、健康监控等。本指南展示了如何在 Astro 项目中实现这些功能。

## 🕐 定时任务 (Cron Jobs)

### 功能特性
- 支持标准 Cron 表达式调度
- 任务启用/禁用控制
- 立即执行任务
- 任务状态监控
- 动态添加新任务

### 实现方案

#### 方案一：使用 Node.js 原生定时器
```typescript
class TaskScheduler {
  private tasks: Map<string, ScheduledTask> = new Map();
  private intervals: Map<string, NodeJS.Timeout> = new Map();

  addTask(task: ScheduledTask) {
    this.tasks.set(task.id, task);
    if (task.enabled) {
      this.scheduleTask(task);
    }
  }

  private scheduleTask(task: ScheduledTask) {
    const interval = this.parseSchedule(task.schedule);
    const timeoutId = setInterval(() => {
      this.executeTask(task.id);
    }, interval);
    this.intervals.set(task.id, timeoutId);
  }
}
```

#### 方案二：使用专业库 (推荐生产环境)
```bash
npm install node-cron
npm install node-schedule
```

```typescript
import cron from 'node-cron';
import schedule from 'node-schedule';

// 使用 node-cron
cron.schedule('0 2 * * *', () => {
  console.log('每天凌晨2点执行');
});

// 使用 node-schedule
schedule.scheduleJob('0 9 * * 1', () => {
  console.log('每周一上午9点执行');
}); 