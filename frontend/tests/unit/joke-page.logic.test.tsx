import {
	getNextCount,
	scheduleConfettiReset,
	shouldShowConfetti,
} from "src/app/routes/joke-page";
import { describe, expect, it, vi } from "vitest";

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

	it("schedules confetti reset", () => {
		vi.useFakeTimers();

		const fn = vi.fn();

		scheduleConfettiReset(fn, 1500);

		expect(fn).not.toHaveBeenCalled();

		vi.advanceTimersByTime(1500);

		expect(fn).toHaveBeenCalledTimes(1);

		vi.useRealTimers();
	});
});
