import http from 'k6/http';
import { check } from 'k6';

export const BASE_URL = 'http://app:8080/api/v1';

export function getJokes() {
  const res = http.get(`${BASE_URL}/jokes`);
  check(res, {
    'GET jokes 200': r => r.status === 200,
  });
  return res;
}

export function getSourceJoke() {
  const res = http.get(`${BASE_URL}/source-joke`);
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
    headers: { 'Content-Type': 'application/json' },
  });

  check(res, {
    'POST joke success': r => r.status >= 200 && r.status < 300,
  });

  return res;
}