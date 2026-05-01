import { sleep } from 'k6';
import { getJokes, createJoke, getSourceJoke } from '../scripts/helpers.js';

export const options = {
  scenarios: {
    getJokes: {
      executor: 'ramping-vus',
      stages: [
        { duration: '10s', target: 50 },
        { duration: '20s', target: 50 },
        { duration: '10s', target: 0 },
      ],
      exec: 'getJokesScenario',
    },
    getSourceJokes: {
      executor: 'constant-vus',
      vus: 1,
      duration: '40s',
      exec: 'getSourceJokesScenario',
    },
    createJoke: {
      executor: 'ramping-vus',
      stages: [
        { duration: '10s', target: 10 },
        { duration: '20s', target: 10 },
        { duration: '10s', target: 0 },
      ],
      exec: 'createJokeScenario',
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<900'],   // 95% der Requests < 900ms
    http_req_failed: ['rate<0.1'],     // max. 10% Fehler
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