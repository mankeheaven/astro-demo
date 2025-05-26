# 环境配置说明

本项目支持基于环境文件的多环境打包配置，可以轻松地在开发、测试和生产环境之间切换。

## 环境文件

项目包含以下环境配置文件：

- `env.development` - 开发环境配置
- `env.test` - 测试环境配置  
- `env.production` - 生产环境配置

### 环境变量说明

| 变量名 | 说明 | 示例值 |
|--------|------|--------|
| `NODE_ENV` | Node.js环境 | `development`, `test`, `production` |
| `PUBLIC_API_URL` | API服务器地址 | `http://localhost:8000` |
| `PUBLIC_APP_ENV` | 应用环境标识 | `development`, `test`, `production` |
| `PUBLIC_DEBUG` | 是否开启调试模式 | `true`, `false` |

## 构建命令

### 开发环境
```bash
# 启动开发服务器
npm run dev

# 构建开发版本
npm run build:dev
```

### 测试环境
```bash
# 构建测试版本
npm run build:test

# 预览测试版本
npm run preview:test
```

### 生产环境
```bash
# 构建生产版本
npm run build:prod

# 预览生产版本
npm run preview:prod
```

### 清理构建文件
```bash
# 清理所有构建文件
npm run clean:all

# 清理dist目录
npm run clean
```

## 输出目录

不同环境的构建文件会输出到不同的目录：

- 开发环境: `dist/dev/`
- 测试环境: `dist/test/`
- 生产环境: `dist/prod/`

## 环境特定配置

### 开发环境
- 启用源码映射 (sourcemap)
- 不压缩代码
- 简化文件名
- 开启调试模式

### 测试环境
- 启用源码映射
- 不压缩代码
- 简化文件名
- 关闭调试模式
- 设置base路径为 `/test/`

### 生产环境
- 关闭源码映射
- 启用代码压缩
- 文件名包含hash值
- 关闭调试模式
- 内联样式表优化

## 在代码中使用环境变量

在React组件中可以通过全局变量访问环境信息：

```tsx
// 获取当前环境
const currentEnv = __APP_ENV__;

// 获取API地址
const apiUrl = __API_URL__;

// 检查是否为调试模式
const isDebug = __DEBUG__;
```

## 自定义环境配置

如需添加新的环境或修改现有配置：

1. 创建或修改对应的环境文件 (如 `env.staging`)
2. 在 `config/env.config.js` 中添加对应的配置
3. 在 `package.json` 中添加对应的构建脚本

## 注意事项

- 环境变量以 `PUBLIC_` 开头的会被注入到客户端代码中
- 不要在环境文件中存储敏感信息
- 确保在部署时使用正确的环境配置
- Windows和Linux/macOS都支持，使用了跨平台的构建脚本

## 故障排除

如果遇到构建问题：

1. 检查环境文件是否存在且格式正确
2. 确认Node.js版本兼容性
3. 清理构建缓存: `npm run clean:all`
4. 重新安装依赖: `npm install` 