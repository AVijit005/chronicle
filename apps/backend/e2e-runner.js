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
  const results = { passed: 0, failed: 0, total: 0, bugs: 0, issues: [] };
  const logPass = (name) => { console.log(`✅ PASS: ${name}`); results.passed++; results.total++; };
  const logFail = (name, details) => { console.log(`❌ FAIL: ${name}`, JSON.stringify(details, null, 2)); results.failed++; results.total++; results.issues.push(name); };

  try {
    const res = await request('GET', '/health');
    if (res.status === 200) logPass('Health endpoint'); else logFail('Health endpoint', res);
  } catch (e) { logFail('Health endpoint', e.message); }

  let accessToken = null;
  let refreshToken = null;
  let email = `test-${Date.now()}@example.com`;

  try {
    const res = await request('POST', '/auth/register', { email, password: 'Password123!', name: 'Test User' });
    if (res.status === 201 || res.status === 200) {
      logPass('User registration');
      await prisma.user.update({ where: { email }, data: { emailVerified: true }});
    } else logFail('User registration', res);
  } catch (e) { logFail('User registration', e.message); }

  try {
    const res = await request('POST', '/auth/login', { email, password: 'Password123!' });
    if (res.status === 201 || res.status === 200) {
      logPass('Login & JWT');
      accessToken = res.data?.data?.accessToken || res.data?.accessToken;
      refreshToken = res.data?.data?.refreshToken || res.data?.refreshToken;
    } else logFail('Login', res);
  } catch (e) { logFail('Login', e.message); }

  if (refreshToken) {
    try {
      const res = await request('POST', '/auth/refresh', { refreshToken });
      if (res.status === 200 || res.status === 201) logPass('Refresh token'); else logFail('Refresh token', res);
    } catch (e) { logFail('Refresh token', e.message); }
  }

  if (accessToken) {
    try {
      const res = await request('POST', '/auth/logout', null, accessToken);
      if (res.status === 200 || res.status === 201 || res.status === 204) logPass('Logout'); else logFail('Logout', res);
    } catch (e) { logFail('Logout', e.message); }
  }

  // Login again to get a valid token
  try {
    const res = await request('POST', '/auth/login', { email, password: 'Password123!' });
    accessToken = res.data?.data?.accessToken || res.data?.accessToken;
  } catch (e) {}

  if (accessToken) {
    try {
      const res = await request('GET', '/users/me', null, accessToken);
      if (res.status === 200) logPass('Profile GET'); else logFail('Profile GET', res);
    } catch (e) { logFail('Profile GET', e.message); }

    try {
      const res = await request('PATCH', '/users/me', { displayName: 'Updated Name' }, accessToken);
      if (res.status === 200) logPass('Profile UPDATE'); else logFail('Profile UPDATE', res);
    } catch (e) { logFail('Profile UPDATE', e.message); }

    try {
      const res = await request('GET', '/media', null, accessToken);
      if (res.status === 200) logPass('Media GET'); else logFail('Media GET', res);
    } catch (e) { logFail('Media GET', e.message); }

    let collectionId = null;
    try {
      const res = await request('POST', '/collections', { name: 'My Favorites', description: 'Testing collections' }, accessToken);
      if (res.status === 201 || res.status === 200) {
        logPass('Collections POST');
        collectionId = res.data?.data?.id || res.data?.id;
      } else logFail('Collections POST', res);
    } catch (e) { logFail('Collections POST', e.message); }

    if (collectionId) {
      try {
        const res = await request('GET', `/collections/${collectionId}`, null, accessToken);
        if (res.status === 200) logPass('Collections GET by ID'); else logFail('Collections GET by ID', res);
      } catch (e) { logFail('Collections GET by ID', e.message); }
    }

    try {
      const res = await request('GET', '/media/search?search=test', null, accessToken);
      if (res.status === 200) logPass('Search GET'); else logFail('Search GET', res);
    } catch (e) { logFail('Search GET', e.message); }
    
    try {
      const res = await request('GET', '/analytics/dashboard', null, accessToken);
      if (res.status === 200) logPass('Analytics GET'); else logFail('Analytics GET', res);
    } catch (e) { logFail('Analytics GET', e.message); }

    try {
      const res = await request('GET', '/notifications', null, accessToken);
      if (res.status === 200) logPass('Notifications GET'); else logFail('Notifications GET', res);
    } catch (e) { logFail('Notifications GET', e.message); }
  }

  console.log('--- RESULT ---');
  console.log(JSON.stringify(results, null, 2));
  
  await prisma.$disconnect();
  process.exit(0);
}
run();
