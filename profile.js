import { CATALOGUE, THEMES, findItem } from "./catalogue.js";

export const PROFILE_KEY = "sky_garden_player_profile";
export const PROFILE_VERSION = 1;
const EQUIPMENT_CATEGORIES = ["hat", "glasses", "neckwear", "badge", "handItem", "effect"];

export function createDefaultProfile() {
  return {
    version: PROFILE_VERSION,
    coins: 0,
    ownedItems: ["sky-garden"],
    equippedItems: Object.fromEntries(EQUIPMENT_CATEGORIES.map((key) => [key, null])),
    activeTheme: "sky-garden",
    achievements: [],
    rewardedEvents: [],
    statistics: {
      correctAnswers: 0,
      completedRounds: 0,
      perfectRounds: 0,
      bestStreak: 0,
      flowersGrown: 0,
      completedDifficulties: [],
      completedTimedRounds: 0,
    },
  };
}

function safeCount(value) {
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? Math.floor(number) : 0;
}

export function normalizeProfile(value) {
  const source = value && typeof value === "object" ? value : {};
  const defaults = createDefaultProfile();
  const validIds = new Set(CATALOGUE.map((item) => item.id));
  const owned = [...new Set(Array.isArray(source.ownedItems) ? source.ownedItems.filter((id) => validIds.has(id)) : [])];
  if (!owned.includes("sky-garden")) owned.unshift("sky-garden");
  const equipped = { ...defaults.equippedItems };
  for (const category of EQUIPMENT_CATEGORIES) {
    const id = source.equippedItems?.[category];
    if (owned.includes(id) && findItem(id)?.category === category) equipped[category] = id;
  }
  const stats = source.statistics && typeof source.statistics === "object" ? source.statistics : {};
  return {
    version: PROFILE_VERSION,
    coins: safeCount(source.coins),
    ownedItems: owned,
    equippedItems: equipped,
    activeTheme: THEMES.includes(source.activeTheme) && owned.includes(source.activeTheme) ? source.activeTheme : "sky-garden",
    achievements: [...new Set(Array.isArray(source.achievements) ? source.achievements.filter((id) => typeof id === "string") : [])],
    rewardedEvents: [...new Set(Array.isArray(source.rewardedEvents) ? source.rewardedEvents.filter((id) => typeof id === "string").slice(-500) : [])],
    statistics: {
      correctAnswers: safeCount(stats.correctAnswers),
      completedRounds: safeCount(stats.completedRounds),
      perfectRounds: safeCount(stats.perfectRounds),
      bestStreak: safeCount(stats.bestStreak),
      flowersGrown: safeCount(stats.flowersGrown),
      completedDifficulties: [...new Set(Array.isArray(stats.completedDifficulties) ? stats.completedDifficulties.filter((level) => ["easy", "medium", "hard"].includes(level)) : [])],
      completedTimedRounds: safeCount(stats.completedTimedRounds),
    },
  };
}

export function loadProfile(storage = localStorage) {
  try {
    return normalizeProfile(JSON.parse(storage.getItem(PROFILE_KEY) || "null"));
  } catch {
    return createDefaultProfile();
  }
}

export function saveProfile(profile, storage = localStorage) {
  const normalized = normalizeProfile(profile);
  try { storage.setItem(PROFILE_KEY, JSON.stringify(normalized)); } catch { /* Keep the game playable. */ }
  return normalized;
}

export function purchaseItem(profile, itemId) {
  const next = normalizeProfile(profile);
  const item = findItem(itemId);
  if (!item) return { ok: false, reason: "missing", profile: next };
  if (item.achievementRequired) return { ok: false, reason: "locked", profile: next };
  if (next.ownedItems.includes(itemId)) return { ok: false, reason: "owned", profile: next };
  if (next.coins < item.price) return { ok: false, reason: "insufficient", profile: next };
  next.coins -= item.price;
  next.ownedItems.push(itemId);
  return { ok: true, profile: equipItem(next, itemId) };
}

export function equipItem(profile, itemId) {
  const next = normalizeProfile(profile);
  const item = findItem(itemId);
  if (!item || !next.ownedItems.includes(itemId)) return next;
  if (item.category === "theme") next.activeTheme = itemId;
  else if (item.category in next.equippedItems) next.equippedItems[item.category] = itemId;
  return next;
}

export function removeEquippedItem(profile, category) {
  const next = normalizeProfile(profile);
  if (category in next.equippedItems) next.equippedItems[category] = null;
  return next;
}
