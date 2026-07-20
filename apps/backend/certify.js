const http = require('http');
const crypto = require('crypto');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function request(method, path, body, token, headers = {}) {
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
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          ...headers
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

const results = { passed: 0, failed: 0, total: 0, issues: [] };
const logPass = (name) => { console.log(`✅ PASS: ${name}`); results.passed++; results.total++; };
const logFail = (name, details) => { console.log(`❌ FAIL: ${name}`, JSON.stringify(details, null, 2)); results.failed++; results.total++; results.issues.push(name); };

function assert(condition, name, details) {
  if (condition) logPass(name);
  else logFail(name, details);
}

async function run() {
  console.log("=== PHASE 1: INFRASTRUCTURE & SECURITY HEADER ===");
  const hRes = await request('GET', '/health');
  assert(hRes.headers['x-dns-prefetch-control'] === 'off', 'Helmet enabled (x-dns-prefetch-control)');
  assert(hRes.headers['x-frame-options'] === 'SAMEORIGIN', 'Helmet enabled (x-frame-options)');
  assert(hRes.headers['x-xss-protection'] === '0', 'Helmet enabled (x-xss-protection)');
  assert(hRes.headers['access-control-allow-credentials'] === 'true', 'CORS enabled');
  assert(hRes.headers['x-ratelimit-limit-global'], 'Rate limiting headers present');

  console.log("=== PHASE 2: AUTHENTICATION EDGE CASES ===");
  const email = `test-${Date.now()}@example.com`;
  
  // Register
  const r1 = await request('POST', '/auth/register', { email, password: 'Password123!', name: 'T' });
  assert(r1.status === 201 || r1.status === 200, 'Registration successful', r1);
  await prisma.user.update({ where: { email }, data: { emailVerified: true }});
  
  // Duplicate Registration
  const r2 = await request('POST', '/auth/register', { email, password: 'Password123!', name: 'T2' });
  assert(r2.status === 409, 'Duplicate registration handled (409)', r2);

  // Wrong Password
  const r3 = await request('POST', '/auth/login', { email, password: 'WrongPassword!' });
  assert(r3.status === 401, 'Wrong password handled (401)', r3);

  // Wrong Email
  const r4 = await request('POST', '/auth/login', { email: 'nonexistent@example.com', password: 'Password123!' });
  assert(r4.status === 401, 'Wrong email handled (401)', r4);

  // Success Login
  const r5 = await request('POST', '/auth/login', { email, password: 'Password123!' });
  const token = r5.data?.data?.accessToken || r5.data?.accessToken;
  assert(token, 'Valid JWT obtained', r5);

  // Missing Auth Header
  const r6 = await request('GET', '/users/me');
  assert(r6.status === 401, 'Missing Auth header rejected (401)', r6);

  // Invalid Token
  const r7 = await request('GET', '/users/me', null, 'invalid_token');
  assert(r7.status === 401, 'Invalid Bearer token rejected (401)', r7);

  console.log("=== PHASE 3: PROFILE EDGE CASES ===");
  // Invalid data on update profile
  const p1 = await request('PATCH', '/users/me', { displayName: 123 }, token);
  assert(p1.status === 400, 'Invalid type rejected on profile update (400)', p1);

  // Large payload check (simulated with large display name if schema allows, otherwise just a big dummy field)
  const p2 = await request('PATCH', '/users/me', { dummyLargeField: 'A'.repeat(5000) }, token);
  assert(p2.status === 400 || p2.status === 200, 'Large dummy payload safely ignored or rejected', p2);

  console.log("=== PHASE 6: SEARCH EDGE CASES ===");
  // Empty search
  const s1 = await request('GET', '/media/search?search=', null, token);
  assert(s1.status === 400 || s1.status === 200, 'Empty search string handled', s1);

  // Special chars
  const s2 = await request('GET', '/media/search?search=DROP TABLE', null, token);
  assert(s2.status === 200, 'SQLi payload safely escaped', s2);

  const s3 = await request('GET', '/media/search?search=<script>alert(1)</script>', null, token);
  assert(s3.status === 200, 'XSS payload safely processed by backend', s3);
  
  // Very long search
  const s4 = await request('GET', `/media/search?search=${'a'.repeat(2000)}`, null, token);
  assert(s4.status === 200 || s4.status === 400 || s4.status === 414, 'Very long search handled safely', s4);

  console.log("=== PHASE 13: API QUALITY ===");
  const a1 = await request('GET', '/auth/login');
  assert(a1.status === 404 || a1.status === 405, 'Incorrect method returns 404/405', a1);
  if (a1.status >= 400) {
    assert(a1.data?.statusCode === a1.status, 'Standardized error format (statusCode matches status)', a1);
    assert(a1.data?.requestId, 'Error response includes requestId', a1);
  } else {
    logFail('Standardized error format', a1);
  }

  console.log('--- FINAL SUMMARY ---');
  console.log(JSON.stringify(results, null, 2));
  await prisma.$disconnect();
  process.exit(0);
}

run();
