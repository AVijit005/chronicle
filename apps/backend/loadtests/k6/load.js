import http from 'k6/http';
import { check, sleep } from 'k6';
import { randomString } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

export const options = {
  stages: [
    { duration: '1m', target: 50 },
    { duration: '3m', target: 100 },
    { duration: '1m', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.01'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';
const AUTH_TOKEN = __ENV.AUTH_TOKEN || '';

const params = {
  headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
};

export default function () {
  // Search
  const search = http.get(`${BASE_URL}/api/search?q=${randomString(3)}&limit=10`, params);
  check(search, { 'search ok': (r) => r.status === 200 });

  sleep(Math.random() * 2 + 0.5);

  // Health
  const health = http.get(`${BASE_URL}/api/health`);
  check(health, { 'health ok': (r) => r.status === 200 });

  sleep(1);
}
