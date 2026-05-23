import http from 'k6/http';
import { check } from 'k6';

export const BASE_URL = 'http://app:8080/api/v1';
let AUTH_TOKEN = null;
const AUTH_HEADER = () => (AUTH_TOKEN ? { Authorization: `Bearer ${AUTH_TOKEN}` } : {});

export function login(username = 'admin', password = 'superSecurePassword123') {
  const payload = { username, password };
  const res = http.post(`${BASE_URL}/auth/login`, JSON.stringify(payload), {
    headers: { 'Content-Type': 'application/json' },
  });

  if (res?.status === 200) {
    try {
      AUTH_TOKEN = res.json()?.token;
    } catch (e) {
      // leave AUTH_TOKEN as null
    }
  }

  return res;
}

export function getJokes() {
  const res = http.get(`${BASE_URL}/jokes`, { headers: AUTH_HEADER() });
  check(res, {
    'GET jokes 200': r => r.status === 200,
  });
  return res;
}

export function getSourceJoke() {
  const res = http.get(`${BASE_URL}/source-joke`, { headers: AUTH_HEADER() });
  check(res, {
    'GET source-joke 200': r => r.status === 200,
  });
  return res;
}

export function createJoke() {
  const payload = {
    content: `loadtest-${__VU}-${__ITER}`
  };

  const res = http.post(`${BASE_URL}/jokes`, JSON.stringify(payload), {
    headers: { 'Content-Type': 'application/json', ...AUTH_HEADER() },
  });

  check(res, {
    'POST joke success': r => r.status >= 200 && r.status < 300,
  });

  return res;
}
