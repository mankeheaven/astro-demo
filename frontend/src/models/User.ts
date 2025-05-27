// 用户模型
import { Database } from '../lib/database';
import bcrypt from 'bcrypt';

export interface User {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  role: 'admin' | 'user';
  created_at: Date;
  updated_at: Date;
}

export interface CreateUserData {
  username: string;
  email: string;
  password: string;
  role?: 'admin' | 'user';
}

export class UserModel {
  static create(userData: CreateUserData): User {
    // 检查用户名是否已存在
    const existingUser = Database.queryOne<User>(
      'SELECT id FROM users WHERE username = ? OR email = ?',
      [userData.username, userData.email]
    );

    if (existingUser) {
      throw new Error('用户名或邮箱已存在');
    }

    // 加密密码
    const saltRounds = 10;
    const password_hash = bcrypt.hashSync(userData.password, saltRounds);

    // 插入用户
    const userId = Database.insert('users', {
      username: userData.username,
      email: userData.email,
      password_hash,
      role: userData.role || 'user'
    });

    // 返回创建的用户
    const user = Database.queryOne<User>(
      'SELECT * FROM users WHERE id = ?',
      [userId]
    );

    if (!user) {
      throw new Error('用户创建失败');
    }

    return user;
  }

  static findById(id: number): User | null {
    return Database.queryOne<User>(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );
  }

  static findByUsername(username: string): User | null {
    return Database.queryOne<User>(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );
  }

  static findByEmail(email: string): User | null {
    return Database.queryOne<User>(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
  }

  static verifyPassword(user: User, password: string): boolean {
    return bcrypt.compareSync(password, user.password_hash);
  }

  static updatePassword(userId: number, newPassword: string): void {
    const saltRounds = 10;
    const password_hash = bcrypt.hashSync(newPassword, saltRounds);
    
    Database.update(
      'users',
      { password_hash },
      'id = ?',
      [userId]
    );
  }

  static getAll(limit: number = 50, offset: number = 0): User[] {
    return Database.query<User>(
      'SELECT id, username, email, role, created_at, updated_at FROM users ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [limit, offset]
    );
  }

  static delete(id: number): boolean {
    const affectedRows = Database.delete('users', 'id = ?', [id]);
    return affectedRows > 0;
  }
} 