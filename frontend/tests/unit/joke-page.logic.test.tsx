import { getNextCount, shouldShowConfetti } from "src/app/routes/joke-page";
import { describe, expect, it } from "vitest";

// -----------------------------
// TESTS
// -----------------------------

describe("joke-page helpers", () => {
	it("increments count", () => {
		expect(getNextCount(0, 100)).toBe(1);
	});

	it("wraps from 99 to 0", () => {
		expect(getNextCount(99, 100)).toBe(0);
	});

	it("shows confetti at boundary", () => {
		expect(shouldShowConfetti(99, 100)).toBe(true);
	});

	it("does not show confetti otherwise", () => {
		expect(shouldShowConfetti(42, 100)).toBe(false);
	});
});
