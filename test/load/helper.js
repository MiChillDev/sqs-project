import http from 'k6/http';
import { check } from 'k6';

const USERNAME_SECRET_PATH = '/run/secrets/app.seed.admin.username';
const PASSWORD_SECRET_PATH = '/run/secrets/app.seed.admin.password';

function readSecret(path) {
  try {
    return open(path).trim();
  } catch (error) {
    throw new Error(`Failed to read required secret file: ${path}`);
  }
}

export const BASE_URL = __ENV.K6_BASE_URL || 'http://app:8080/api/v1';

const SEED_ADMIN_USERNAME = __ENV.K6_ADMIN_USERNAME || readSecret(USERNAME_SECRET_PATH);
const SEED_ADMIN_PASSWORD = __ENV.K6_ADMIN_PASSWORD || readSecret(PASSWORD_SECRET_PATH);

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