import { login, getJokes, createJoke, getSourceJoke } from '../helper.js';
import { makeSetup, makeScenario, buildOptions } from '../loadtest-factory.js';

export const options = buildOptions({
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
  p95Ms: 150,       // 95% der Requests < 150ms
  failedRate: 0.01,  // max. 1% Fehler
});

export const setup = makeSetup(login);
export const getJokesScenario = makeScenario(getJokes, 1);
export const getSourceJokesScenario = makeScenario(getSourceJoke, 2); // slower to protect external API
export const createJokeScenario = makeScenario(createJoke, 1);
