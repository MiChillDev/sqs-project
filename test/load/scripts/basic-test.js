import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  vus: 10,
  duration: '30s',
};

export default function () {
  const res = http.get('http://app:8080/api/v1/health');

  check(res, {
    'status is 200': (r) => r.status === 200,
  });

  sleep(1);
}