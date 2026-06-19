import http from 'k6/http';
import { check } from 'k6';

export const BASE_URL = __ENV.K6_BASE_URL || 'http://app:8080/api/v1';

const SEED_ADMIN_USERNAME = __ENV.K6_ADMIN_USERNAME;
const SEED_ADMIN_PASSWORD = __ENV.K6_ADMIN_PASSWORD;

if (!SEED_ADMIN_USERNAME) {
  throw new Error('Missing required environment variable: K6_ADMIN_USERNAME');
}

if (!SEED_ADMIN_PASSWORD) {
  throw new Error('Missing required environment variable: K6_ADMIN_PASSWORD');
}

export function login(username = SEED_ADMIN_USERNAME, password = SEED_ADMIN_PASSWORD) {
  const payload = { username, password };

  const res = http.post(
    `${BASE_URL}/auth/login`,
    JSON.stringify(payload),
    {
      headers: { 'Content-Type': 'application/json' },
    }
  );

  check(res, {
    'login successful': r => r.status === 200,
  });

  if (res.status !== 200) {
    throw new Error(`Login failed: ${res.status} ${res.body}`);
  }

  const token = res.json()?.token;

  if (!token) {
    throw new Error('Login response did not contain a token');
  }

  return token;
}

function authHeaders(token) {
  return {
    Authorization: `Bearer ${token}`,
  };
}

export function getJokes(token) {
  const res = http.get(`${BASE_URL}/jokes`, {
    headers: authHeaders(token),
  });

  check(res, {
    'GET jokes 200': r => r.status === 200,
  });

  return res;
}

export function getSourceJoke(token) {
  const res = http.get(`${BASE_URL}/source-joke`, {
    headers: authHeaders(token),
  });

  check(res, {
    'GET source-joke 200': r => r.status === 200,
  });

  return res;
}

export function createJoke(token) {
  const payload = {
    content: `loadtest-${__VU}-${__ITER}`,
    externalId: '',
  };

  const res = http.post(
    `${BASE_URL}/jokes`,
    JSON.stringify(payload),
    {
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders(token),
      },
    }
  );

  check(res, {
    'POST joke success': r => r.status >= 200 && r.status < 300,
  });

  return res;
}