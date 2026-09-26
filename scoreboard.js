export const SCORE_LIMIT = 50;

function finiteNumber(value, fallback) {
  return Number.isFinite(Number(value)) ? Number(value) : fallback;
}

export function normalizeTimerScore(entry = {}) {
  if (!entry || typeof entry !== "object") entry = {};
  const legacyBest = entry.bestRoundTimeMs ?? entry.bestTimeMs;
  return {
    name: String(entry.name ?? "Player").slice(0, 20),
    level: ["easy", "medium", "hard"].includes(entry.level) ? entry.level : "easy",
    rounds: Math.max(0, finiteNumber(entry.rounds, 0)),
    bestRoundTimeMs: finiteNumber(legacyBest, Number.POSITIVE_INFINITY),
    avgRoundTimeMs: entry.avgRoundTimeMs == null ? null : finiteNumber(entry.avgRoundTimeMs, null),
    score: finiteNumber(entry.score, 0),
    timestamp: finiteNumber(entry.timestamp, 0),
  };
}

export function normalizeNoTimerScore(entry = {}) {
  if (!entry || typeof entry !== "object") entry = {};
  return {
    name: String(entry.name ?? "Player").slice(0, 20),
    level: ["easy", "medium", "hard"].includes(entry.level) ? entry.level : "easy",
    maxRound: Math.max(0, finiteNumber(entry.maxRound, 0)),
    score: finiteNumber(entry.score, 0),
    timestamp: finiteNumber(entry.timestamp, 0),
  };
}

export function sortTimerRuns(list) {
  return [...list].sort((a, b) =>
    a.bestRoundTimeMs - b.bestRoundTimeMs ||
    b.rounds - a.rounds ||
    b.score - a.score ||
    b.timestamp - a.timestamp
  );
}

export function sortNoTimerScores(list) {
  return [...list].sort((a, b) =>
    b.maxRound - a.maxRound || b.timestamp - a.timestamp
  );
}

export function limitTimerScores(list) {
  return sortTimerRuns(list.map(normalizeTimerScore)).slice(0, SCORE_LIMIT);
}

export function limitNoTimerScores(list) {
  return sortNoTimerScores(list.map(normalizeNoTimerScore)).slice(0, SCORE_LIMIT);
}

export function upsertNoTimerScore(list, candidate) {
  const scores = list.map(normalizeNoTimerScore);
  const existing = scores.find((entry) => entry.name === candidate.name && entry.level === candidate.level);
  if (existing) {
    existing.maxRound = Math.max(existing.maxRound, candidate.maxRound);
    existing.score = Math.max(existing.score, candidate.score);
    existing.timestamp = candidate.timestamp;
  } else {
    scores.push(normalizeNoTimerScore(candidate));
  }
  return limitNoTimerScores(scores);
}
