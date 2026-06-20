import type { components } from '../../../api/generated/api-types.ts';

type JokeInput = components['schemas']['JokeInput'];
type TokenResponse = components['schemas']['TokenResponse'];
type LoginRequest = components['schemas']['LoginRequest'];

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 200;
const REQUEST_TIMEOUT_MS = 5000;
const DEFAULT_BASE_URL = 'http://localhost:8080';

const SEED_JOKES: JokeInput[] = [
  { content: 'Chuck Norris can divide by zero.', externalId: 'seed-1' },
  { content: 'Chuck Norris counted to infinity. Twice.', externalId: 'seed-2' },
  { content: 'When Chuck Norris enters a room, he does not turn the lights on. He turns the dark off.', externalId: 'seed-3' },
  { content: "Chuck Norris knows Victoria's secret.", externalId: 'seed-4' },
  { content: 'Chuck Norris can slam a revolving door.', externalId: 'seed-5' },
];

async function fetchWithRetry(
  url: string,
  options: RequestInit,
  attempt = 1
): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (response.status >= 500 && attempt < MAX_RETRIES) {
      const delay = RETRY_DELAY_MS * attempt;
      await new Promise((resolve) => setTimeout(resolve, delay));
      return fetchWithRetry(url, options, attempt + 1);
    }

    return response;
  } catch (error) {
    clearTimeout(timeout);
    if (attempt < MAX_RETRIES) {
      const delay = RETRY_DELAY_MS * attempt;
      await new Promise((resolve) => setTimeout(resolve, delay));
      return fetchWithRetry(url, options, attempt + 1);
    }
    throw error;
  }
}

async function login(
  baseUrl: string,
  username: string,
  password: string
): Promise<string> {
  const body: LoginRequest = { username, password };
  const response = await fetchWithRetry(`${baseUrl}/api/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Login failed: ${response.status} ${response.statusText}`);
  }

  const data: TokenResponse = await response.json();
  return data.token;
}

async function createJoke(
  baseUrl: string,
  token: string,
  joke: JokeInput
): Promise<void> {
  const response = await fetchWithRetry(`${baseUrl}/api/v1/jokes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(joke),
  });

  if (!response.ok) {
    throw new Error(
      `Failed to create joke '${joke.externalId}': ${response.status} ${response.statusText}`
    );
  }
}

export async function seed(): Promise<void> {
  const username = process.env.SEED_ADMIN_USERNAME;
  const password = process.env.SEED_ADMIN_PASSWORD;

  if (!username || !password) {
    throw new Error(
      'SEED_ADMIN_USERNAME and SEED_ADMIN_PASSWORD environment variables are required'
    );
  }

  const baseUrl = process.env.API_BASE_URL ?? DEFAULT_BASE_URL;

  console.log('Authenticating as admin...');
  const token = await login(baseUrl, username, password);

  console.log('Creating seed jokes...');
  const results = await Promise.allSettled(
    SEED_JOKES.map((joke) => createJoke(baseUrl, token, joke))
  );

  const succeeded = results.filter((r) => r.status === 'fulfilled').length;
  const failed = results.filter((r) => r.status === 'rejected').length;

  console.log(`Seeded: ${succeeded} jokes created, ${failed} failed`);

  if (failed > 0) {
    const errors = results
      .filter((r) => r.status === 'rejected')
      .map((r) => (r as PromiseRejectedResult).reason);
    throw new Error(`Seed partially failed:\n${errors.join('\n')}`);
  }
}
