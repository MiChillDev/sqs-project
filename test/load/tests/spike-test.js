import { login, getJokes, createJoke, getSourceJoke } from '../helper.js';
import { makeSetup, makeScenario, buildOptions } from '../loadtest-factory.js';

export const options = buildOptions({
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
  p95Ms: 900,       // 95% der Requests < 900ms
  failedRate: 0.1,  // max. 10% Fehler
});

export const setup = makeSetup(login);
export const getJokesScenario = makeScenario(getJokes, 1);
export const getSourceJokesScenario = makeScenario(getSourceJoke, 2); // slower to protect external API
export const createJokeScenario = makeScenario(createJoke, 1);