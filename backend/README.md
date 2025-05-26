# Golang Echo 后端项目

这是一个使用Golang Echo框架创建的后端API项目。

## 功能

- RESTful API
- JSON响应
- CORS支持
- 日志记录

## 安装步骤

确保已安装Go环境，然后执行：

```bash
# 进入src目录
cd src

# 安装依赖
go mod tidy

# 运行项目
go run main.go
```

## API端点

- `GET /` - 欢迎消息
- `GET /api/health` - 健康检查

## 开发

服务器将在 http://localhost:8080 运行 