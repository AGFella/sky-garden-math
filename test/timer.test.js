import test from "node:test";
import assert from "node:assert/strict";
import { calculateTimerStats } from "../timer.js";

test("timer statistics use every completed round", () => {
  assert.deepEqual(calculateTimerStats([12000, 8000, 10000]), {
    bestRoundTimeMs: 8000,
    totalTimeMs: 30000,
    avgRoundTimeMs: 10000,
  });
});

test("timer statistics ignore malformed values", () => {
  assert.deepEqual(calculateTimerStats([5000, Number.NaN, -1]), {
    bestRoundTimeMs: 5000,
    totalTimeMs: 5000,
    avgRoundTimeMs: 5000,
  });
  assert.deepEqual(calculateTimerStats([]), {
    bestRoundTimeMs: null,
    totalTimeMs: 0,
    avgRoundTimeMs: null,
  });
});
