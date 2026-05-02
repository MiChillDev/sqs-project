import { useMutation } from '@tanstack/react-query';

export interface Joke {
  id: string;
  externalId: string;
  content: string;
}

export interface HealthCheck {
  status: string;
  message: string;
}

export async function fetchApi<T>(path: string): Promise<T> {
  const baseUrl = import.meta.env.VITE_API_BASE_URL ?? '';
  const response = await fetch(`${baseUrl}${path}`);

  if (!response.ok) {
    const error = new Error(`HTTP ${response.status}`) as Error & { status: number };
    error.status = response.status;
    throw error;
  }

  return response.json() as Promise<T>;
}

export function useJokes() {
  return useMutation({
    mutationFn: () => fetchApi<Joke>('/v1/jokes'),
  });
}

export function useHealthCheck() {
  return useMutation({
    mutationFn: () => fetchApi<HealthCheck>('/v1/health'),
  });
}
