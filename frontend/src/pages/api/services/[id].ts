// 服务控制 API 端点
import type { APIRoute } from 'astro';

// 模拟服务状态存储
const serviceStates = new Map([
  ['websocket-server', { status: 'running', errorCount: 0, startTime: new Date(Date.now() - 2 * 60 * 60 * 1000) }],
  ['file-watcher', { status: 'running', errorCount: 1, startTime: new Date(Date.now() - 1 * 60 * 60 * 1000) }],
  ['cache-manager', { status: 'stopped', errorCount: 0, startTime: null }],
  ['log-processor', { status: 'error', errorCount: 5, startTime: new Date(Date.now() - 3 * 60 * 60 * 1000) }],
  ['scheduler', { status: 'running', errorCount: 0, startTime: new Date(Date.now() - 4 * 60 * 60 * 1000) }]
]);

const serviceNames = new Map([
  ['websocket-server', 'WebSocket 服务器'],
  ['file-watcher', '文件监控服务'],
  ['cache-manager', '缓存管理服务'],
  ['log-processor', '日志处理服务'],
  ['scheduler', '定时任务调度器']
]);

export const POST: APIRoute = async ({ params, request, url }) => {
  const serviceId = params.id;
  const action = url.searchParams.get('action');
  
  if (!serviceId || !serviceNames.has(serviceId)) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: '服务不存在' 
    }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  if (!action || !['start', 'stop', 'restart'].includes(action)) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: '无效的操作，支持的操作: start, stop, restart' 
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const serviceName = serviceNames.get(serviceId)!;
  const currentState = serviceStates.get(serviceId)!;
  
  let message = '';
  let newStatus = currentState.status;
  let newStartTime = currentState.startTime;
  let newErrorCount = currentState.errorCount;

  switch (action) {
    case 'start':
      if (currentState.status === 'running') {
        message = `服务 ${serviceName} 已经在运行中`;
      } else {
        newStatus = 'running';
        newStartTime = new Date();
        message = `服务 ${serviceName} 已启动`;
      }
      break;
      
    case 'stop':
      if (currentState.status === 'stopped') {
        message = `服务 ${serviceName} 已经停止`;
      } else {
        newStatus = 'stopped';
        newStartTime = null;
        message = `服务 ${serviceName} 已停止`;
      }
      break;
      
    case 'restart':
      newStatus = 'running';
      newStartTime = new Date();
      newErrorCount = 0; // 重启时清除错误计数
      message = `服务 ${serviceName} 已重启`;
      break;
  }

  // 更新服务状态
  serviceStates.set(serviceId, {
    status: newStatus as any,
    errorCount: newErrorCount,
    startTime: newStartTime
  });

  // 模拟操作延迟
  await new Promise(resolve => setTimeout(resolve, 500));

  return new Response(JSON.stringify({ 
    success: true, 
    message,
    service: {
      id: serviceId,
      name: serviceName,
      status: newStatus,
      startTime: newStartTime?.toISOString() || null,
      errorCount: newErrorCount,
      uptime: newStartTime ? Math.floor((Date.now() - newStartTime.getTime()) / 1000) : 0
    }
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
};

export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}; 