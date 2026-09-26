import test from "node:test";
import assert from "node:assert/strict";
import {
  SCORE_LIMIT,
  limitNoTimerScores,
  limitTimerScores,
  normalizeTimerScore,
  upsertNoTimerScore,
} from "../scoreboard.js";

test("legacy timer entries are normalized", () => {
  const entry = normalizeTimerScore({ name: "Ada", bestTimeMs: 1234, rounds: 2 });
  assert.equal(entry.bestRoundTimeMs, 1234);
  assert.equal(entry.avgRoundTimeMs, null);
  assert.equal(entry.level, "easy");
});

test("malformed records are normalized without throwing", () => {
  const entry = normalizeTimerScore(null);
  assert.equal(entry.name, "Player");
  assert.equal(entry.bestRoundTimeMs, Number.POSITIVE_INFINITY);
});

test("timer records are sorted and limited to the best 50", () => {
  const entries = Array.from({ length: 75 }, (_, index) => ({
    name: `Player ${index}`,
    bestRoundTimeMs: 1000 + index,
    rounds: 1,
    score: 1,
  }));
  const limited = limitTimerScores(entries);
  assert.equal(limited.length, SCORE_LIMIT);
  assert.equal(limited[0].bestRoundTimeMs, 1000);
  assert.equal(limited.at(-1).bestRoundTimeMs, 1049);
});

test("untimed records replace the same player and level", () => {
  const updated = upsertNoTimerScore(
    [{ name: "Ada", level: "easy", maxRound: 2, score: 15, timestamp: 1 }],
    { name: "Ada", level: "easy", maxRound: 4, score: 12, timestamp: 2 },
  );
  assert.equal(updated.length, 1);
  assert.equal(updated[0].maxRound, 4);
  assert.equal(updated[0].score, 15);
});

test("untimed records are sorted, normalized, and limited", () => {
  const entries = Array.from({ length: 75 }, (_, index) => ({
    name: `Player ${index}`,
    maxRound: index,
    score: index,
  }));
  const limited = limitNoTimerScores(entries);
  assert.equal(limited.length, SCORE_LIMIT);
  assert.equal(limited[0].maxRound, 74);
  assert.equal(limited.at(-1).maxRound, 25);
});
