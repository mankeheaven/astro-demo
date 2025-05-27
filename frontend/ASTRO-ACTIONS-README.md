# Astro Actions 演示指南

## 🚀 概述

Astro Actions 是 Astro 5.0 中引入的强大功能，允许您编写类型安全的后端函数，可以直接从前端 JavaScript 客户端代码调用。这个演示展示了 Actions 的各种使用场景和最佳实践。

## 📁 项目结构

```
src/
├── actions/
│   └── index.ts          # Actions 定义
├── components/
│   └── ActionsDemo.tsx   # React 演示组件
└── pages/
    └── actions-demo.astro # 演示页面
```

## 🔧 功能特性

### 1. 类型安全
- 使用 Zod 进行输入验证
- TypeScript 类型推断
- 运行时数据验证

### 2. 服务端执行
- 安全的服务器端代码执行
- 可访问数据库、文件系统等服务端资源
- 隐藏敏感逻辑和 API 密钥

### 3. 错误处理
- 统一的错误响应格式
- 客户端友好的错误处理
- 自动验证错误

## 📝 演示功能

### 1. 用户注册 (Form Data)
```typescript
export const registerUser = defineAction({
  accept: 'form',
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
});
```

**特点：**
- 支持 FormData 格式
- 密码确认验证
- 模拟用户冲突处理
- 异步操作模拟

### 2. 发送消息 (JSON Data)
```typescript
export const sendMessage = defineAction({
  accept: 'json',
  input: z.object({
    name: z.string().min(1, '请输入姓名'),
    message: z.string().min(1, '请输入消息内容'),
    type: z.enum(['feedback', 'support', 'general']).default('general'),
  }),
  handler: async (input) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      success: true,
      message: '消息发送成功！',
      messageId: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
    };
  }
});
```

**特点：**
- JSON 数据格式
- 枚举类型验证
- 默认值设置

### 3. 用户查询
```typescript
export const getUserInfo = defineAction({
  accept: 'json',
  input: z.object({
    userId: z.string().min(1, '用户ID不能为空'),
  }),
  handler: async (input) => {
    // 模拟数据库查询
    const users = {
      '1': { id: '1', name: '张三', email: 'zhangsan@example.com', role: 'admin' },
      '2': { id: '2', name: '李四', email: 'lisi@example.com', role: 'user' },
      '3': { id: '3', name: '王五', email: 'wangwu@example.com', role: 'user' },
    };
    
    const user = users[input.userId];
    
    if (!user) {
      throw new Error('用户不存在');
    }
    
    return { success: true, user };
  }
});
```

**特点：**
- 数据查询模拟
- 错误处理（用户不存在）
- 预定义数据集

### 4. 文件上传
```typescript
export const uploadFile = defineAction({
  accept: 'form',
  input: z.object({
    file: z.instanceof(File),
    description: z.string().optional(),
  }),
  handler: async (input) => {
    // 文件大小检查
    if (input.file.size > 5 * 1024 * 1024) {
      throw new Error('文件大小不能超过5MB');
    }
    
    // 文件类型检查
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
        url: `/uploads/${input.file.name}`,
      }
    };
  }
});
```

**特点：**
- 文件实例验证
- 文件大小限制
- 文件类型检查
- 可选描述字段

### 5. 计算器
```typescript
export const calculate = defineAction({
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
    }
    
    return {
      success: true,
      result,
      operation: `${a} ${operation} ${b} = ${result}`,
    };
  }
});
```

**特点：**
- 数学运算
- 除零错误处理
- 枚举操作类型

### 6. 待办事项管理 (CRUD)
```typescript
export const manageTodo = defineAction({
  accept: 'json',
  input: z.object({
    action: z.enum(['create', 'update', 'delete', 'toggle']),
    id: z.string().optional(),
    title: z.string().optional(),
    completed: z.boolean().optional(),
  }),
  handler: async (input) => {
    const { action, id, title, completed } = input;
    
    switch (action) {
      case 'create':
        if (!title) throw new Error('标题不能为空');
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
      // ... 其他操作
    }
  }
});
```

**特点：**
- 多操作支持 (CRUD)
- 条件验证
- 动态响应数据

## 🎯 客户端使用

### 基本调用
```typescript
import { registerUser } from '../actions';

const handleSubmit = async (formData: FormData) => {
  const response = await registerUser(formData);
  
  if (response.error) {
    console.error('操作失败:', response.error.message);
  } else {
    console.log('操作成功:', response.data);
  }
};
```

### 错误处理
```typescript
try {
  const response = await someAction(data);
  
  if (response.error) {
    // 处理验证错误或业务逻辑错误
    setError(response.error.message);
  } else {
    // 处理成功响应
    setResult(response.data);
  }
} catch (error) {
  // 处理网络错误或其他异常
  console.error('网络错误:', error);
}
```

## 🔍 测试建议

### 1. 用户注册测试
- 输入用户名 "admin" 测试错误处理
- 测试密码不匹配验证
- 测试邮箱格式验证

### 2. 用户查询测试
- 使用 ID: 1, 2, 3 测试成功响应
- 使用其他 ID 测试错误处理

### 3. 文件上传测试
- 上传超过 5MB 的文件测试大小限制
- 上传不支持的文件类型测试类型检查

### 4. 计算器测试
- 测试除零错误处理
- 测试各种数学运算

## 🚀 部署注意事项

1. **服务器环境**: Actions 需要服务器环境，确保使用适当的适配器
2. **环境变量**: 敏感配置应使用环境变量
3. **错误日志**: 生产环境中应记录详细的错误日志
4. **性能监控**: 监控 Actions 的执行时间和错误率

## 📚 最佳实践

1. **输入验证**: 始终使用 Zod 进行严格的输入验证
2. **错误处理**: 提供清晰、用户友好的错误消息
3. **类型安全**: 充分利用 TypeScript 类型系统
4. **异步操作**: 合理使用 async/await 处理异步操作
5. **安全性**: 在服务端验证所有输入，不信任客户端数据

## 🔗 相关链接

- [Astro Actions 官方文档](https://docs.astro.build/en/guides/actions/)
- [Zod 验证库](https://zod.dev/)
- [TypeScript 文档](https://www.typescriptlang.org/)

---

这个演示展示了 Astro Actions 的强大功能和灵活性，为构建现代 web 应用提供了类型安全的服务端解决方案。 