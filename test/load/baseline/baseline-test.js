import { getJokes, getSourceJoke } from '../scripts/helpers.js';
import { sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 10 },
    { duration: '1m', target: 10 },
    { duration: '30s', target: 0 },
  ],
};

export default function () {
  getJokes();
  sleep(1);
  getSourceJoke();
  sleep(1);
}