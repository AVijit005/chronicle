const http = require('http');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function request(method, path, body, token) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : undefined;
    const req = http.request(
      {
        hostname: 'localhost',
        port: 3000,
        path: `/api${path}`,
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {}),
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
      },
      (res) => {
        let rawData = '';
        res.on('data', (chunk) => { rawData += chunk; });
        res.on('end', () => {
          let parsed;
          try {
            parsed = rawData ? JSON.parse(rawData) : null;
          } catch (e) {
            parsed = rawData;
          }
          resolve({ status: res.statusCode, data: parsed, headers: res.headers });
        });
      }
    );
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function run() {
  const email = `test-${Date.now()}@example.com`;
  await request('POST', '/auth/register', { email, password: 'Password123!', name: 'Test User' });
  await prisma.user.update({ where: { email }, data: { emailVerified: true }});
  const login = await request('POST', '/auth/login', { email, password: 'Password123!' });
  const token = login.data?.data?.accessToken || login.data?.accessToken;
  console.log('Got token:', !!token);

  // Search bug:
  const search = await request('GET', '/media/search?search=test', null, token);
  console.log('Search GET:', search.status, search.data);
  
  // Analytics bug:
  const analytics = await request('GET', '/analytics/dashboard', null, token);
  console.log('Analytics GET:', analytics.status, analytics.data);
  process.exit(0);
}
run();
