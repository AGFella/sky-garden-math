import { normalizeProfile } from "./profile.js";

export const REWARDS = { correct: 1, streak: 1, round: 2, perfect: 5 };

export function applyReward(profile, eventId, amount) {
  const next = normalizeProfile(profile);
  if (!eventId || next.rewardedEvents.includes(eventId)) return { profile: next, awarded: 0 };
  const safeAmount = Number.isFinite(amount) && amount > 0 ? Math.floor(amount) : 0;
  next.coins += safeAmount;
  next.rewardedEvents = [...next.rewardedEvents, eventId].slice(-500);
  return { profile: next, awarded: safeAmount };
}

export function answerReward(streak) {
  return REWARDS.correct + (streak > 0 && streak % 3 === 0 ? REWARDS.streak : 0);
}

export function roundReward(correct, total) {
  return REWARDS.round + (correct === total ? REWARDS.perfect : 0);
}
