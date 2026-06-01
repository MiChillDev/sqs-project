import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		globals: true,
		environment: "jsdom",
		setupFiles: ["./tests/setup.ts"],
		include: [
			"tests/unit/**/*.test.{ts,tsx}",
			"src/**/__tests__/**/*.test.{ts,tsx}",
		],
		coverage: {
			reporter: ["text", "html", "lcov"],
			provider: "v8",
			thresholds: {
				lines: 90,
				functions: 90,
				branches: 85,
				statements: 90,
			},
		},
	},
	resolve: {
		alias: {
			src: path.resolve(__dirname, "./src"),
		},
	},
});
