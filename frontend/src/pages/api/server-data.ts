import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request }) => {
  // 模拟数据库查询延迟
  await new Promise(resolve => setTimeout(resolve, 100));

  const url = new URL(request.url);
  const type = url.searchParams.get('type') || 'general';

  let data;

  switch (type) {
    case 'dashboard':
      data = {
        type: 'dashboard',
        timestamp: new Date().toISOString(),
        data: {
          totalUsers: Math.floor(Math.random() * 10000) + 1000,
          activeUsers: Math.floor(Math.random() * 1000) + 100,
          serverLoad: (Math.random() * 100).toFixed(1),
          memoryUsage: (Math.random() * 8).toFixed(2),
          requests: Math.floor(Math.random() * 1000000) + 100000,
          uptime: Math.floor(process.uptime())
        }
      };
      break;

    case 'user':
      const userId = url.searchParams.get('userId');
      if (!userId) {
        return new Response(JSON.stringify({ error: '缺少用户ID参数' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      data = {
        type: 'user',
        timestamp: new Date().toISOString(),
        data: {
          id: userId,
          name: `用户${userId}`,
          email: `user${userId}@example.com`,
          lastLogin: new Date(Date.now() - Math.random() * 86400000).toISOString(),
          preferences: {
            theme: Math.random() > 0.5 ? 'dark' : 'light',
            language: 'zh-CN',
            notifications: Math.random() > 0.5
          },
          stats: {
            loginCount: Math.floor(Math.random() * 1000) + 10,
            postsCount: Math.floor(Math.random() * 100),
            friendsCount: Math.floor(Math.random() * 500) + 5
          }
        }
      };
      break;

    case 'system':
      data = {
        type: 'system',
        timestamp: new Date().toISOString(),
        data: {
          nodeVersion: process.version,
          platform: process.platform,
          arch: process.arch,
          uptime: Math.floor(process.uptime()),
          memoryUsage: process.memoryUsage(),
          cpuUsage: process.cpuUsage(),
          env: process.env.NODE_ENV || 'development'
        }
      };
      break;

    default:
      data = {
        type: 'general',
        timestamp: new Date().toISOString(),
        data: {
          serverTime: new Date().toLocaleString('zh-CN'),
          randomNumber: Math.floor(Math.random() * 1000),
          requestId: Math.random().toString(36).substring(7),
          userAgent: request.headers.get('user-agent') || 'Unknown'
        }
      };
  }

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Access-Control-Allow-Origin': '*'
    }
  });
}; 