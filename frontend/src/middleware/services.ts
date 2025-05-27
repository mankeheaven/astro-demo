// 服务中间件
import type { MiddlewareHandler } from 'astro';
import { backgroundService } from '../services/background';

export const servicesMiddleware: MiddlewareHandler = async (context, next) => {
  const { url } = context;
  
  // 服务健康检查端点
  if (url.pathname === '/api/health') {
    const services = backgroundService.getAllServices();
    const healthStatus = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      services: services.map(service => ({
        id: service.id,
        name: service.name,
        status: service.status,
        uptime: service.startTime ? 
          Date.now() - service.startTime.getTime() : 0
      }))
    };

    return new Response(JSON.stringify(healthStatus), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  // 服务指标端点
  if (url.pathname === '/api/metrics') {
    const services = backgroundService.getAllServices();
    const metrics = {
      totalServices: services.length,
      runningServices: services.filter(s => s.status === 'running').length,
      errorServices: services.filter(s => s.status === 'error').length,
      totalErrors: services.reduce((sum, s) => sum + s.errorCount, 0),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      timestamp: new Date().toISOString()
    };

    return new Response(JSON.stringify(metrics), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  return next();
}; 