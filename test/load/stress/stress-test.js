import { getJokes, getSourceJoke, createJoke } from '../scripts/helpers.js';
import { sleep } from 'k6';

export const options = {
  stages: [
    { duration: '1m', target: 20 },
    { duration: '2m', target: 50 },
    { duration: '1m', target: 0 },
  ],
};

export default function () {
  getJokes();
  getSourceJoke();

  createJoke({
    content: `stress-${__VU}-${__ITER}`,
  });

  sleep(1);
}