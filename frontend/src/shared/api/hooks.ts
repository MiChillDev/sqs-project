import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { HealthCheck, Joke, JokeInput, LoginRequest, SourceJoke, TokenResponse } from './api';
import { fetchApi } from './api';

export function useRandomJoke() {
  return useQuery({
    queryKey: ['jokes', 'random'],
    queryFn: ({ signal }) => fetchApi<Joke>('/api/v1/jokes', { signal }),
    enabled: false,
  });
}

export function useHealthCheck() {
  return useQuery({
    queryKey: ['health'],
    queryFn: ({ signal }) => fetchApi<HealthCheck>('/api/v1/health', { signal }),
    enabled: false,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
}

export function useCreateJoke() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: JokeInput) =>
      fetchApi<Joke>('/api/v1/jokes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
        auth: true,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jokes'] });
    },
    meta: { skipGlobalErrorToast: true },
  });
}

export function useLogin() {
  return useMutation<TokenResponse, Error, LoginRequest>({
    mutationFn: (input) =>
      fetchApi<TokenResponse>('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      }),
    meta: { skipGlobalErrorToast: true },
  });
}

export function useSourceJoke() {
  return useQuery({
    queryKey: ['source-joke'],
    queryFn: ({ signal }) => fetchApi<SourceJoke>('/api/v1/source-joke', { signal, auth: true }),
    enabled: false,
  });
}
