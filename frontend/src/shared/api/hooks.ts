import { useMutation, useQuery } from "@tanstack/react-query";
import type { HealthCheck, Joke, JokeInput, SourceJoke } from "./api";
import { fetchApi } from "./api";

export function useRandomJoke() {
	return useQuery({
		queryKey: ["jokes", "random"],
		queryFn: ({ signal }) => fetchApi<Joke>("/v1/jokes", { signal }),
		enabled: false,
	});
}

export function useHealthCheck() {
	return useQuery({
		queryKey: ["health"],
		queryFn: ({ signal }) => fetchApi<HealthCheck>("/v1/health", { signal }),
		enabled: false,
		staleTime: Infinity,
		refetchOnWindowFocus: false,
	});
}

export function useCreateJoke() {
	return useMutation({
		mutationFn: (input: JokeInput) =>
			fetchApi<Joke>("/v1/jokes", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(input),
			}),
	});
}

export function useSourceJoke() {
	return useQuery({
		queryKey: ["source-joke"],
		queryFn: ({ signal }) =>
			fetchApi<SourceJoke>("/v1/source-joke", { signal }),
		enabled: false,
	});
}
