import { getJokes, getSourceJoke } from '../scripts/helpers.js';
import { sleep } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: 10 },
    { duration: '10s', target: 100 },
    { duration: '10s', target: 10 },
  ],
};

export default function () {
  getJokes();
  getSourceJoke();

  sleep(0.5);
}