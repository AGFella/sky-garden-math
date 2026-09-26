import test from "node:test";
import assert from "node:assert/strict";
import { PROFILE_KEY, createDefaultProfile, normalizeProfile, purchaseItem, equipItem, removeEquippedItem, saveProfile } from "../profile.js";
import { answerReward, roundReward, applyReward } from "../rewards.js";
import { evaluateAchievements } from "../achievements.js";

test("default and malformed profiles are safe", () => {
  const profile = createDefaultProfile();
  assert.equal(profile.coins, 0);
  assert.ok(profile.ownedItems.includes("sky-garden"));
  const repaired = normalizeProfile({ coins: -10, ownedItems: ["sky-garden", "sky-garden", "missing"], activeTheme: "missing", equippedItems: { hat: "missing" } });
  assert.equal(repaired.coins, 0);
  assert.deepEqual(repaired.ownedItems, ["sky-garden"]);
  assert.equal(repaired.activeTheme, "sky-garden");
  assert.equal(repaired.equippedItems.hat, null);
});

test("saving a profile preserves unrelated leaderboard data", () => {
  const values = new Map([["mathgame_scores_timer", "leaderboard"]]);
  const storage = { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
  saveProfile(createDefaultProfile(), storage);
  assert.equal(values.get("mathgame_scores_timer"), "leaderboard");
  assert.ok(values.has(PROFILE_KEY));
});

test("reward rules and event protection work", () => {
  assert.equal(answerReward(1), 1);
  assert.equal(answerReward(3), 2);
  assert.equal(roundReward(8, 10), 2);
  assert.equal(roundReward(10, 10), 7);
  const first = applyReward(createDefaultProfile(), "answer-1", 2);
  const duplicate = applyReward(first.profile, "answer-1", 2);
  assert.equal(first.awarded, 2);
  assert.equal(duplicate.awarded, 0);
  assert.equal(duplicate.profile.coins, 2);
});

test("purchases deduct once and equip by category", () => {
  const profile = { ...createDefaultProfile(), coins: 100 };
  const bought = purchaseItem(profile, "captain-hat");
  assert.equal(bought.ok, true);
  assert.equal(bought.profile.coins, 80);
  assert.equal(bought.profile.equippedItems.hat, "captain-hat");
  assert.equal(purchaseItem(bought.profile, "captain-hat").reason, "owned");
  assert.equal(purchaseItem(createDefaultProfile(), "captain-hat").reason, "insufficient");
  assert.equal(purchaseItem(profile, "golden-crown").reason, "locked");
  const withSecond = purchaseItem(bought.profile, "wizard-hat").profile;
  assert.equal(withSecond.equippedItems.hat, "wizard-hat");
  assert.equal(removeEquippedItem(withSecond, "hat").equippedItems.hat, null);
});

test("themes must be owned before activation", () => {
  const profile = createDefaultProfile();
  assert.equal(equipItem(profile, "sunset-sky").activeTheme, "sky-garden");
  const bought = purchaseItem({ ...profile, coins: 60 }, "sunset-sky");
  assert.equal(bought.profile.activeTheme, "sunset-sky");
});

test("achievements unlock once and grant free items", () => {
  const profile = createDefaultProfile();
  profile.statistics.completedRounds = 1;
  profile.statistics.perfectRounds = 1;
  profile.statistics.bestStreak = 10;
  const first = evaluateAchievements(profile);
  assert.deepEqual(first.unlocked, ["first-bloom", "perfect-pilot", "streak-star"]);
  assert.ok(first.profile.ownedItems.includes("flower-badge"));
  assert.ok(first.profile.ownedItems.includes("golden-crown"));
  assert.ok(first.profile.ownedItems.includes("star-glasses"));
  assert.equal(first.profile.coins, 0);
  assert.deepEqual(evaluateAchievements(first.profile).unlocked, []);
});

test("master achievement requires all difficulties", () => {
  const profile = createDefaultProfile();
  profile.statistics.completedDifficulties = ["easy", "medium", "hard"];
  assert.ok(evaluateAchievements(profile).unlocked.includes("master-skies"));
});
