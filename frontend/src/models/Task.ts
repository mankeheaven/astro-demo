// 任务模型
import { Database } from '../lib/database';

export interface Task {
  id: number;
  name: string;
  description?: string;
  schedule: string;
  handler: string;
  enabled: boolean;
  last_run?: Date;
  next_run?: Date;
  status: 'pending' | 'running' | 'completed' | 'failed';
  error_count: number;
  created_at: Date;
  updated_at: Date;
}

export interface CreateTaskData {
  name: string;
  description?: string;
  schedule: string;
  handler: string;
  enabled?: boolean;
}

export interface TaskLog {
  id: number;
  task_id: number;
  status: 'started' | 'completed' | 'failed';
  message?: string;
  duration_ms?: number;
  created_at: Date;
}

export class TaskModel {
  static create(taskData: CreateTaskData): Task {
    const taskId = Database.insert('tasks', {
      name: taskData.name,
      description: taskData.description || null,
      schedule: taskData.schedule,
      handler: taskData.handler,
      enabled: taskData.enabled !== false ? 1 : 0 // SQLite 使用 1/0 表示布尔值
    });

    const task = Database.queryOne<Task>(
      'SELECT * FROM tasks WHERE id = ?',
      [taskId]
    );

    if (!task) {
      throw new Error('任务创建失败');
    }

    return task;
  }

  static findById(id: number): Task | null {
    return Database.queryOne<Task>(
      'SELECT * FROM tasks WHERE id = ?',
      [id]
    );
  }

  static getAll(): Task[] {
    return Database.query<Task>(
      'SELECT * FROM tasks ORDER BY created_at DESC'
    );
  }

  static getEnabled(): Task[] {
    return Database.query<Task>(
      'SELECT * FROM tasks WHERE enabled = 1 ORDER BY created_at DESC'
    );
  }

  static updateStatus(id: number, status: Task['status']): void {
    Database.update(
      'tasks',
      { status, updated_at: new Date().toISOString() },
      'id = ?',
      [id]
    );
  }

  static updateLastRun(id: number): void {
    Database.update(
      'tasks',
      { 
        last_run: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      'id = ?',
      [id]
    );
  }

  static toggleEnabled(id: number): boolean {
    const task = this.findById(id);
    if (!task) return false;

    Database.update(
      'tasks',
      { 
        enabled: task.enabled ? 0 : 1, // SQLite 布尔值切换
        updated_at: new Date().toISOString()
      },
      'id = ?',
      [id]
    );

    return true;
  }

  static incrementErrorCount(id: number): void {
    Database.query(
      'UPDATE tasks SET error_count = error_count + 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [id]
    );
  }

  static resetErrorCount(id: number): void {
    Database.update(
      'tasks',
      { 
        error_count: 0,
        updated_at: new Date().toISOString()
      },
      'id = ?',
      [id]
    );
  }

  static delete(id: number): boolean {
    const affectedRows = Database.delete('tasks', 'id = ?', [id]);
    return affectedRows > 0;
  }

  // 任务日志相关
  static addLog(taskId: number, status: TaskLog['status'], message?: string, durationMs?: number): void {
    Database.insert('task_logs', {
      task_id: taskId,
      status,
      message: message || null,
      duration_ms: durationMs || null
    });
  }

  static getLogs(taskId: number, limit: number = 50): TaskLog[] {
    return Database.query<TaskLog>(
      'SELECT * FROM task_logs WHERE task_id = ? ORDER BY created_at DESC LIMIT ?',
      [taskId, limit]
    );
  }
} 