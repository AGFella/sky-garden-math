export function calculateTimerStats(roundTimes) {
  const validTimes = roundTimes.filter((time) => Number.isFinite(time) && time >= 0);
  if (validTimes.length === 0) {
    return { bestRoundTimeMs: null, totalTimeMs: 0, avgRoundTimeMs: null };
  }
  const totalTimeMs = validTimes.reduce((sum, time) => sum + time, 0);
  return {
    bestRoundTimeMs: Math.min(...validTimes),
    totalTimeMs,
    avgRoundTimeMs: Math.round(totalTimeMs / validTimes.length),
  };
}

export class RoundTimer {
  constructor(onTick, intervalMs = 250) {
    this.onTick = onTick;
    this.intervalMs = intervalMs;
    this.elapsedMs = 0;
    this.startedAt = null;
    this.interval = null;
  }

  start() {
    this.reset();
    this.resume();
  }

  resume() {
    if (this.interval) return;
    this.startedAt = Date.now();
    this.interval = setInterval(() => this.tick(), this.intervalMs);
  }

  tick() {
    if (this.startedAt !== null) {
      const value = this.elapsedMs + (Date.now() - this.startedAt);
      this.onTick(value);
    }
  }

  pause() {
    if (this.startedAt !== null) {
      this.elapsedMs += Date.now() - this.startedAt;
    }
    this.startedAt = null;
    if (this.interval) clearInterval(this.interval);
    this.interval = null;
    this.onTick(this.elapsedMs);
    return this.elapsedMs;
  }

  reset() {
    if (this.interval) clearInterval(this.interval);
    this.interval = null;
    this.elapsedMs = 0;
    this.startedAt = null;
    this.onTick(0);
  }
}
