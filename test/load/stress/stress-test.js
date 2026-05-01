import { sleep } from 'k6';
import { getJokes, createJoke, getSourceJoke } from '../scripts/helpers.js';

export const options = {
  scenarios: {
    getJokes: {
      executor: 'ramping-vus',
      startVUs: 5,
      stages: [
        { duration: '30s', target: 20 },
        { duration: '1m', target: 20 },
        { duration: '30s', target: 0 },
      ],
      exec: 'getJokesScenario',
    },
    getSourceJokes: {
      executor: 'constant-vus',
      vus: 2,
      duration: '2m',
      exec: 'getSourceJokesScenario',
    },
    createJokes: {
      executor: 'ramping-vus',
      startVUs: 2,
      stages: [
        { duration: '30s', target: 8 },
        { duration: '1m', target: 8 },
        { duration: '30s', target: 0 },
      ],
      exec: 'createJokeScenario',
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<600'],   // 95% der Requests < 600ms
    http_req_failed: ['rate<0.05'],     // max. 5% Fehler
  },
};

export function getJokesScenario() {
  getJokes();
  sleep(1);
}

export function getSourceJokesScenario() {
  getSourceJoke();
  sleep(2); // slower to protect external API
}

export function createJokeScenario() {
  createJoke();
  sleep(1);
}