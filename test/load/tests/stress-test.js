import { login, getJokes, createJoke, getSourceJoke } from '../helper.js';
import { makeSetup, makeScenario, buildOptions } from '../loadtest-factory.js';

export const options = buildOptions({
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
  p95Ms: 600,       // 95% der Requests < 600ms
  failedRate: 0.05, // max. 5% Fehler
});

export const setup = makeSetup(login);
export const getJokesScenario = makeScenario(getJokes, 1);
export const getSourceJokesScenario = makeScenario(getSourceJoke, 2);
export const createJokeScenario = makeScenario(createJoke, 1);