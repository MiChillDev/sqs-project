import { sleep } from 'k6';
import { getJokes, createJoke, getSourceJoke, login } from '../helper.js';

export const options = {
  scenarios: {
    getJokes: {
      executor: 'constant-vus',
      vus: 6,
      duration: '30s',
      exec: 'getJokesScenario',
    },
    getSourceJokes: {
      executor: 'constant-vus',
      vus: 1,
      duration: '30s',
      exec: 'getSourceJokesScenario',
    },
    createJoke: {
      executor: 'constant-vus',
      vus: 3,
      duration: '30s',
      exec: 'createJokeScenario',
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<150'],   // 95% der Requests < 150ms
    http_req_failed: ['rate<0.01'],     // max. 1% Fehler
  },
};

export function setup() {
  const token = login();
  return { token };
}

export function getJokesScenario(data) {
  getJokes(data.token);
  sleep(1);
}

export function getSourceJokesScenario(data) {
  getSourceJoke(data.token);
  sleep(2); // slower to protect external API
}

export function createJokeScenario(data) {
  createJoke(data.token);
  sleep(1);
}