import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 10 },  // ramp-up
    { duration: '1m', target: 20 },   // load
    { duration: '30s', target: 0 },   // ramp-down
  ],
};

const BASE_URL = 'http://app:8080/api/v1';

export default function () {

  // GET random joke
  const res1 = http.get(`${BASE_URL}/jokes`);
  check(res1, {
    'jokes status 200': (r) => r.status === 200,
  });

  sleep(1);

  // GET random source joke
  const res2 = http.get(`${BASE_URL}/source-joke`);
  check(res2, {
    'source-joke status 200': (r) => r.status === 200,
  });

  sleep(1);

  // POST create joke
  const payload = JSON.stringify({
    content: `loadtest-${__VU}-${__ITER}`
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const res3 = http.post(`${BASE_URL}/jokes`, payload, params);

  check(res3, {
    'create joke status 200/201': (r) => r.status >= 200 && r.status < 300,
  });

  sleep(1);
}