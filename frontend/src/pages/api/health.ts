// 健康检查 API 端点
export async function GET() {
  const healthStatus = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    server: {
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.version,
      platform: process.platform
    },
    services: [
      {
        id: 'websocket-server',
        name: 'WebSocket 服务器',
        status: 'running',
        startTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2小时前启动
        uptime: 7200, // 2小时
        errorCount: 0,
        lastActivity: new Date().toISOString()
      },
      {
        id: 'file-watcher',
        name: '文件监控服务',
        status: 'running',
        startTime: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1小时前启动
        uptime: 3600, // 1小时
        errorCount: 1,
        lastActivity: new Date().toISOString()
      },
      {
        id: 'cache-manager',
        name: '缓存管理服务',
        status: 'stopped',
        startTime: null,
        uptime: 0,
        errorCount: 0,
        lastActivity: new Date(Date.now() - 30 * 60 * 1000).toISOString() // 30分钟前
      },
      {
        id: 'log-processor',
        name: '日志处理服务',
        status: 'error',
        startTime: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3小时前启动
        uptime: 10800, // 3小时
        errorCount: 5,
        lastActivity: new Date(Date.now() - 10 * 60 * 1000).toISOString() // 10分钟前
      },
      {
        id: 'scheduler',
        name: '定时任务调度器',
        status: 'running',
        startTime: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4小时前启动
        uptime: 14400, // 4小时
        errorCount: 0,
        lastActivity: new Date().toISOString()
      }
    ]
  };

  return new Response(JSON.stringify(healthStatus, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}

// 处理 CORS 预检请求
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
} 