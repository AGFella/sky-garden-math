import { normalizeProfile } from "./profile.js";

export const ACHIEVEMENTS = [
  { id: "first-bloom", test: (s) => s.completedRounds >= 1, item: "flower-badge" },
  { id: "perfect-pilot", test: (s) => s.perfectRounds >= 1, item: "golden-crown" },
  { id: "streak-star", test: (s) => s.bestStreak >= 10, item: "star-glasses" },
  { id: "garden-explorer", test: (s) => s.completedRounds >= 5 },
  { id: "speedy-captain", test: (s) => s.completedTimedRounds >= 1 },
  { id: "master-skies", test: (s) => ["easy", "medium", "hard"].every((level) => s.completedDifficulties.includes(level)) },
];

export function evaluateAchievements(profile) {
  const next = normalizeProfile(profile);
  const unlocked = [];
  for (const achievement of ACHIEVEMENTS) {
    if (!next.achievements.includes(achievement.id) && achievement.test(next.statistics)) {
      next.achievements.push(achievement.id);
      if (achievement.item && !next.ownedItems.includes(achievement.item)) next.ownedItems.push(achievement.item);
      unlocked.push(achievement.id);
    }
  }
  return { profile: next, unlocked };
}
