import { i18n } from "./translations.js";
import {
  TOTAL_QUESTIONS,
  generateRoundPlan,
  getAnswerScore,
} from "./questions.js";
import { RoundTimer, calculateTimerStats } from "./timer.js";
import {
  limitNoTimerScores,
  limitTimerScores,
  normalizeNoTimerScore,
  normalizeTimerScore,
  sortNoTimerScores,
  sortTimerRuns,
  upsertNoTimerScore,
} from "./scoreboard.js";
import { loadProfile, saveProfile, purchaseItem, equipItem, removeEquippedItem } from "./profile.js";
import { applyReward, answerReward, roundReward } from "./rewards.js";
import { evaluateAchievements } from "./achievements.js";
import { findItem } from "./catalogue.js";
import { renderKitten } from "./kitten.js";
import { renderShop } from "./shop.js";

let profile = loadProfile();

const state = {
  lang: "en",
  difficulty: "easy",
  currentIndex: 0,
  roundCorrect: 0,
  totalCorrect: 0,
  roundNumber: 1,
  score: 0,
  timerEnabled: false,
  elapsedMs: 0,
  timerPaused: false,
  roundActive: false,
  playerName: "",
  bestRoundTimeMs: null,
  currentPetalColors: [],
  streak: 0,
  consecutiveWrong: 0,
  wrongAttempts: 0,
  currentQuestion: null,
  roundQuestions: [],
  roundTimes: [],
  results: [],
  confirmWasPaused: false,
  islandIndex: 0,
  sessionId: "",
  shopWasPaused: false,
};

const problemText = document.getElementById("problemText");
const answerForm = document.getElementById("answerForm");
const answerInput = document.getElementById("answerInput");
const submitBtn = answerForm?.querySelector("button[type='submit']");
const feedback = document.getElementById("feedback");
const hint = document.getElementById("hint");
const progressSteps = document.getElementById("progressSteps");
const progressText = document.getElementById("progressText");
const questionText = document.getElementById("questionText");
const streakText = document.getElementById("streakText");
const scoreText = document.getElementById("scoreText");
const kitten = document.getElementById("kitten");
const timer = document.getElementById("timer");
const endOverlay = document.getElementById("endOverlay");
const stars = document.getElementById("stars");
const endTitle = document.getElementById("endTitle");
const endSummary = document.getElementById("endSummary");
const endTime = document.getElementById("endTime");
const coinSummary = document.getElementById("coinSummary");
const difficultyButtons = Array.from(document.querySelectorAll("[data-difficulty]"));
const flower = document.getElementById("flower");
const islands = Array.from(document.querySelectorAll(".island"));
const nextRoundBtn = document.getElementById("nextRoundBtn");
const playAgainBtn = document.getElementById("playAgainBtn");
const startOverlay = document.getElementById("startOverlay");
const startGameBtn = document.getElementById("startGameBtn");
const timerToggle = document.getElementById("timerToggle");
const startDifficultyButtons = Array.from(document.querySelectorAll("[data-start-difficulty]"));
const timerRow = document.getElementById("timerRow");
const pauseBtn = document.getElementById("pauseBtn");
const newGameBtn = document.getElementById("newGameBtn");
const confirmOverlay = document.getElementById("confirmOverlay");
const confirmYes = document.getElementById("confirmYes");
const confirmNo = document.getElementById("confirmNo");
const celebrate = document.getElementById("celebrate");
const confetti = document.getElementById("confetti");
let speech = null;
const playerNameInput = document.getElementById("playerNameInput");
const saveScoreBtn = document.getElementById("saveScoreBtn");
const scoreTable = document.getElementById("scoreTable");
const fullScoreBtn = document.getElementById("fullScoreBtn");
const fullScoreOverlay = document.getElementById("fullScoreOverlay");
const fullScoreContent = document.getElementById("fullScoreContent");
const closeFullScoreX = document.getElementById("closeFullScoreX");
const clearScoresBtn = document.getElementById("clearScoresBtn");
const clearScoresOverlay = document.getElementById("clearScoresOverlay");
const clearScoresYes = document.getElementById("clearScoresYes");
const clearScoresNo = document.getElementById("clearScoresNo");
const rainbow = document.getElementById("rainbow");
const coinText = document.getElementById("coinText");
const shopBtn = document.getElementById("shopBtn");
const shopOverlay = document.getElementById("shopOverlay");
const closeShopBtn = document.getElementById("closeShopBtn");
const shopContent = document.getElementById("shopContent");
const shopKittenPreview = document.getElementById("shopKittenPreview");
const shopCoinText = document.getElementById("shopCoinText");
const purchaseOverlay = document.getElementById("purchaseOverlay");
const purchaseText = document.getElementById("purchaseText");
const purchaseYes = document.getElementById("purchaseYes");
const purchaseNo = document.getElementById("purchaseNo");
const rewardPop = document.getElementById("rewardPop");
const achievementToast = document.getElementById("achievementToast");
const rewardLive = document.getElementById("rewardLive");

const KITTY_ANIM_MS = 600;
const IDLE_INTERVAL_MS = 5000;
const CORRECT_FEEDBACK_MS = 5000;
let idleTimer = null;
let feedbackTimer = null;
let endDelayTimer = null;
let rainbowTimer = null;
const dialogTriggers = new Map();
let activeShopCategory = "hat";
let pendingPurchaseId = null;
const achievementQueue = [];

function refreshProfileUI(save = true) {
  if (save) profile = saveProfile(profile);
  document.documentElement.dataset.theme = profile.activeTheme;
  if (coinText) coinText.textContent = profile.coins;
  if (shopCoinText) shopCoinText.textContent = profile.coins;
  renderKitten(kitten, profile, i18n[state.lang].kitten_label);
  speech = kitten.querySelector("[data-kitten-speech]");
  if (shopOverlay && !shopOverlay.hidden) {
    renderShop({ container: shopContent, preview: shopKittenPreview, profile, strings: i18n[state.lang], activeCategory: activeShopCategory });
  }
}

function showReward(amount, extraMessage = "") {
  if (!amount) return;
  const strings = i18n[state.lang];
  const message = `${strings.coin_earned(amount)}${extraMessage ? ` — ${extraMessage}` : ""}`;
  rewardPop.textContent = `● +${amount}`;
  rewardPop.classList.remove("show");
  requestAnimationFrame(() => rewardPop.classList.add("show"));
  rewardLive.textContent = message;
  setTimeout(() => rewardPop.classList.remove("show"), 1300);
}

function unlockAchievements() {
  const result = evaluateAchievements(profile);
  profile = result.profile;
  if (result.unlocked.length) {
    achievementQueue.push(...result.unlocked);
    showNextAchievement();
  }
  refreshProfileUI();
}

function showNextAchievement() {
  if (!achievementQueue.length || achievementToast.classList.contains("show")) return;
  const id = achievementQueue.shift();
  const key = `achievement_${id.replaceAll("-", "_")}`;
  achievementToast.textContent = `${i18n[state.lang].achievement_unlocked} ${i18n[state.lang][key]}`;
  achievementToast.classList.add("show");
  rewardLive.textContent = achievementToast.textContent;
  setTimeout(() => {
    achievementToast.classList.remove("show");
    setTimeout(showNextAchievement, 250);
  }, 3250);
}

function award(eventId, amount, extraMessage = "") {
  const result = applyReward(profile, eventId, amount);
  profile = result.profile;
  if (result.awarded) showReward(result.awarded, extraMessage);
  refreshProfileUI();
  return result.awarded;
}

function setAnswerEnabled(enabled) {
  if (answerInput) answerInput.disabled = !enabled;
  if (submitBtn) submitBtn.disabled = !enabled;
}

function openDialog(overlay, initialFocus) {
  if (!overlay) return;
  if (overlay.hidden) dialogTriggers.set(overlay, document.activeElement);
  overlay.hidden = false;
  requestAnimationFrame(() => (initialFocus ?? overlay.querySelector("button, input"))?.focus());
}

function closeDialog(overlay, restoreFocus = true) {
  if (!overlay) return;
  const trigger = dialogTriggers.get(overlay);
  overlay.hidden = true;
  if (restoreFocus && trigger instanceof HTMLElement) trigger.focus();
  dialogTriggers.delete(overlay);
}

function clearKittenAnimations() {
  kitten.classList.remove("idle", "happy", "shake", "cry");
}

function playKitten(animation) {
  clearKittenAnimations();
  kitten.classList.add(animation);
  setTimeout(() => kitten.classList.remove(animation), KITTY_ANIM_MS);
}

function setKittenCrying(isCrying) {
  if (isCrying) {
    kitten.classList.add("cry");
    kitten.classList.add("sad");
  } else {
    kitten.classList.remove("cry");
    kitten.classList.remove("sad");
  }
}

function setKittenMood(mood) {
  kitten.classList.remove("neutral", "sad");
  if (mood) {
    kitten.classList.add(mood);
  }
}

function startIdleLoop() {
  if (idleTimer) clearInterval(idleTimer);
  idleTimer = setInterval(() => {
    if (!kitten.classList.contains("happy") && !kitten.classList.contains("shake")) {
      playKitten("idle");
    }
  }, IDLE_INTERVAL_MS);
}

function setLanguage(lang) {
  state.lang = lang;
  const strings = i18n[lang];
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (strings[key]) {
      el.textContent = strings[key];
    }
  });
  document.querySelectorAll("[data-lang]").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.getAttribute("data-lang") === lang));
  });
  answerInput?.setAttribute("aria-label", strings.answer_label);
  closeFullScoreX?.setAttribute("aria-label", strings.close_dialog);
  closeShopBtn?.setAttribute("aria-label", strings.close_dialog);
  if (pauseBtn) {
    pauseBtn.textContent = state.timerPaused ? strings.continue : strings.pause;
    pauseBtn.setAttribute("aria-pressed", String(state.timerPaused));
  }
  updateProblemText();
  refreshProfileUI(false);
}

function updateProblemText() {
  if (!state.currentQuestion) return;
  const { a, b, op } = state.currentQuestion;
  problemText.textContent = `${a} ${op} ${b} = ?`;
}

function clearProblemText() {
  if (problemText) {
    problemText.textContent = "";
  }
}

function updateStats() {
  progressText.textContent = `${state.roundNumber}`;
  if (questionText) {
    questionText.textContent = `${state.currentIndex} / ${TOTAL_QUESTIONS}`;
  }
  streakText.textContent = state.streak;
  scoreText.textContent = Number.isInteger(state.score)
    ? String(state.score)
    : state.score.toFixed(1);
  if (progressSteps) {
    const steps = Array.from(progressSteps.querySelectorAll(".step"));
    steps.forEach((step, index) => {
      step.classList.remove("correct", "wrong");
      const result = state.results[index];
      if (result === true) step.classList.add("correct");
      if (result === false) step.classList.add("wrong");
    });
  }
}

function updateFlowerProgress(count) {
  if (!flower) return;
  if (count === 0) {
    state.currentPetalColors = [];
  }
  const pieces = [
    ".stem-1",
    ".stem-2",
    ".center",
    ".p1",
    ".p2",
    ".p3",
    ".p4",
    ".p5",
    ".p6",
    ".leaf",
  ];
  pieces.forEach((selector, index) => {
    const el = flower.querySelector(selector);
    if (!el) return;
    const shouldBeOn = index < count;
    el.classList.toggle("on", shouldBeOn);
    if (shouldBeOn && el.classList.contains("petal") && !el.dataset.colorSet) {
      const color = randomPetalColor(state.currentPetalColors);
      el.style.background = color;
      state.currentPetalColors.push(color);
      el.dataset.colorSet = "true";
    }
    if (!shouldBeOn && el.classList.contains("petal")) {
      if (el.style.background) {
        state.currentPetalColors = state.currentPetalColors.filter(
          (c) => c !== el.style.background
        );
      }
      el.dataset.colorSet = "";
      el.style.background = "";
    }
  });
}

function randomPetalColor(usedColors = []) {
  const hue = Math.floor(Math.random() * 360);
  const saturation = 65 + Math.floor(Math.random() * 20);
  const lightness = 55 + Math.floor(Math.random() * 10);
  const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  if (hue >= 85 && hue <= 150) {
    return randomPetalColor(usedColors);
  }
  if (usedColors.includes(color)) {
    return randomPetalColor(usedColors);
  }
  return color;
}

function setFeedback(text, isCorrect) {
  const strings = i18n[state.lang];
  if (isCorrect) {
    const messages = [
      strings.correct,
      strings.encourage_1,
      strings.encourage_2,
      strings.encourage_3,
      strings.encourage_4
    ].filter(Boolean);
    const msg = messages[Math.floor(Math.random() * messages.length)];
    feedback.textContent = msg;
  } else {
    feedback.textContent = text;
  }
  feedback.style.color = isCorrect ? "#0f7d4f" : "#c93f3f";
  feedback.classList.toggle("correct", isCorrect);
  if (feedbackTimer) {
    clearTimeout(feedbackTimer);
    feedbackTimer = null;
  }
  if (isCorrect && text) {
    feedbackTimer = setTimeout(() => {
      feedback.textContent = "";
      feedback.classList.remove("correct");
    }, CORRECT_FEEDBACK_MS);
  }
}

function setHint(text) {
  hint.textContent = text || "";
}

function formatTime(ms) {
  if (!Number.isFinite(ms)) return "-";
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

const roundClock = new RoundTimer((elapsedMs) => {
  state.elapsedMs = elapsedMs;
  if (timer) timer.textContent = formatTime(elapsedMs);
});

function startTimer() {
  if (!timer) return;
  timer.hidden = false;
  roundClock.start();
}

function resumeTimer() {
  if (!timer) return;
  roundClock.resume();
}

function stopTimer() {
  state.elapsedMs = roundClock.pause();
  if (timer) {
    timer.hidden = !state.timerEnabled;
  }
}

function loadScores(key) {
  try {
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveScores(key, list) {
  try {
    localStorage.setItem(key, JSON.stringify(list));
  } catch {
    // A full or unavailable localStorage must not interrupt the game.
  }
}

function renderScoreboard() {
  if (!scoreTable) return;
  const strings = i18n[state.lang];
  const timerMode = state.timerEnabled;
  const scores = timerMode
    ? sortTimerRuns(loadScores("mathgame_scores_timer").map(normalizeTimerScore)).slice(0, 3)
    : sortNoTimerScores(loadScores("mathgame_scores_notimer").map(normalizeNoTimerScore)).slice(0, 3);
  const headings = timerMode
    ? [strings.player_name, strings.round, strings.time_label, strings.score]
    : [strings.player_name, strings.round, strings.difficulty, strings.score];
  scoreTable.replaceChildren(createScoreRow(headings, true));
  scores.forEach((entry) => {
    const values = timerMode
      ? [entry.name, entry.rounds, formatTime(entry.bestRoundTimeMs), entry.score]
      : [entry.name, entry.maxRound, strings[entry.level] ?? entry.level, entry.score];
    scoreTable.append(createScoreRow(values));
  });
}

function createScoreRow(values, isHeader = false) {
  const row = document.createElement("div");
  row.className = `score-row${isHeader ? " header" : ""}`;
  values.forEach((value) => {
    const cell = document.createElement("div");
    cell.textContent = String(value ?? "");
    row.append(cell);
  });
  return row;
}

function createScoreTable(title, headings, rows, widths) {
  const section = document.createElement("div");
  const heading = document.createElement("h3");
  heading.textContent = title;
  const table = document.createElement("table");
  table.className = "full-score-table";
  const colgroup = document.createElement("colgroup");
  widths.forEach((width) => {
    const col = document.createElement("col");
    col.style.width = width;
    colgroup.append(col);
  });
  const headingRow = document.createElement("tr");
  headings.forEach((value) => {
    const cell = document.createElement("th");
    cell.textContent = value;
    headingRow.append(cell);
  });
  table.append(colgroup, headingRow);
  rows.forEach((values) => {
    const row = document.createElement("tr");
    values.forEach((value) => {
      const cell = document.createElement("td");
      cell.textContent = String(value ?? "");
      row.append(cell);
    });
    table.append(row);
  });
  section.append(heading, table);
  return section;
}

function openFullScoreboard() {
  const strings = i18n[state.lang];
  if (!fullScoreContent || !fullScoreOverlay) return;
  const noTimerScores = sortNoTimerScores(loadScores("mathgame_scores_notimer").map(normalizeNoTimerScore));
  const timerScores = sortTimerRuns(loadScores("mathgame_scores_timer").map(normalizeTimerScore));
  const noTimerRows = noTimerScores.map((entry) => [
    entry.name, entry.maxRound, strings[entry.level] ?? entry.level, entry.score,
  ]);
  const timerRows = timerScores.map((entry) => [
    entry.name,
    entry.rounds,
    strings[entry.level] ?? entry.level,
    formatTime(entry.bestRoundTimeMs),
    entry.avgRoundTimeMs == null ? "-" : formatTime(entry.avgRoundTimeMs),
    entry.score,
  ]);
  fullScoreContent.replaceChildren(
    createScoreTable(strings.no_timer, [strings.player_name, strings.round, strings.difficulty, strings.score], noTimerRows, ["38%", "14%", "24%", "24%"]),
    createScoreTable(strings.with_timer, [strings.player_name, strings.round, strings.difficulty, strings.time_label, strings.avg_time, strings.score], timerRows, ["27%", "12%", "15%", "18%", "14%", "14%"]),
  );
  openDialog(fullScoreOverlay, closeFullScoreX);
}

function scheduleRainbow() {
  if (!rainbow) return;
  const showFor = 6000;
  const minGap = 10000;
  const extraGap = Math.floor(Math.random() * 6000);
  if (rainbowTimer) clearTimeout(rainbowTimer);
  rainbowTimer = setTimeout(() => {
    rainbow.classList.add("show");
    setTimeout(() => {
      rainbow.classList.remove("show");
      scheduleRainbow();
    }, showFor);
  }, minGap + extraGap);
}

function nextQuestion() {
  if (state.currentIndex >= TOTAL_QUESTIONS) {
    endGame();
    return;
  }
  state.currentQuestion = state.roundQuestions[state.currentIndex];
  state.wrongAttempts = 0;
  updateProblemText();
  setHint("");
  answerInput.value = "";
  answerInput.focus();
}

function startGame() {
  state.sessionId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  state.currentIndex = 0;
  state.roundCorrect = 0;
  state.totalCorrect = 0;
  state.roundNumber = 1;
  state.score = 0;
  state.bestRoundTimeMs = null;
  state.roundTimes = [];
  state.streak = 0;
  state.consecutiveWrong = 0;
  state.wrongAttempts = 0;
  state.currentQuestion = null;
  state.roundQuestions = generateRoundPlan(state.difficulty, Math.random, state.roundNumber);
  state.results = [];
  updateStats();
  endOverlay.hidden = true;
  setKittenCrying(false);
  setKittenMood(null);
  updateFlowerProgress(0);
  updateDifficultyUI();
  stopTimer();
  state.timerPaused = false;
  state.roundActive = true;
  setAnswerEnabled(true);
  if (saveScoreBtn) saveScoreBtn.disabled = false;
  if (playerNameInput) {
    state.playerName = playerNameInput.value.trim();
  }
  if (timerRow) timerRow.hidden = false;
  if (pauseBtn) pauseBtn.hidden = !state.timerEnabled;
  if (timer) timer.hidden = !state.timerEnabled;
  if (state.timerEnabled) startTimer();
  nextQuestion();
}

function showStartScreen() {
  state.roundActive = false;
  state.currentQuestion = null;
  clearProblemText();
  setHint("");
  openDialog(startOverlay, playerNameInput);
  if (timerRow) timerRow.hidden = true;
  if (timer) timer.hidden = true;
}

function nextRound() {
  state.currentIndex = 0;
  state.roundCorrect = 0;
  state.roundNumber += 1;
  state.streak = 0;
  state.consecutiveWrong = 0;
  state.wrongAttempts = 0;
  state.currentQuestion = null;
  state.roundQuestions = generateRoundPlan(state.difficulty, Math.random, state.roundNumber);
  state.results = [];
  updateStats();
  endOverlay.hidden = true;
  setKittenCrying(false);
  setKittenMood(null);
  updateFlowerProgress(0);
  updateDifficultyUI();
  stopTimer();
  state.timerPaused = false;
  state.roundActive = true;
  setAnswerEnabled(true);
  if (saveScoreBtn) saveScoreBtn.disabled = false;
  if (pauseBtn) pauseBtn.hidden = !state.timerEnabled;
  if (timer) timer.hidden = !state.timerEnabled;
  if (state.timerEnabled) startTimer();
  nextQuestion();
}

function giveHint() {
  const strings = i18n[state.lang];
  const { a, b, op } = state.currentQuestion;
  const hints = {
    "+": strings.hint_add,
    "−": strings.hint_sub,
    "×": strings.hint_mul,
    "÷": strings.hint_div,
  };
  setHint(hints[op](a, b));
}

function setCelebrateMessage() {
  if (!celebrate) return;
  const messages = i18n[state.lang].celebrations;
  const msg = messages[Math.floor(Math.random() * messages.length)];
  celebrate.textContent = msg;
  if (speech) {
    speech.textContent = msg;
    speech.classList.add("active");
  }
}

function moveFlowerToIsland() {
  if (!flower || islands.length === 0) return;
  const activePieces = flower.querySelectorAll(".on");
  if (activePieces.length === 0) return;

  const island = islands[state.islandIndex % islands.length];
  state.islandIndex += 1;

  const startRect = flower.getBoundingClientRect();
  const targetRect = island.getBoundingClientRect();
  const targetX = targetRect.left + targetRect.width / 2 - startRect.width / 2;
  const targetY = targetRect.top + targetRect.height / 2 - startRect.height / 2 - 10;

  const clone = flower.cloneNode(true);
  clone.classList.add("flower-placed");
  clone.classList.add("flower-bare");
  clone.style.left = `${startRect.left}px`;
  clone.style.top = `${startRect.top}px`;
  clone.style.width = `${startRect.width}px`;
  clone.style.height = `${startRect.height}px`;
  clone.style.transform = "scale(1)";
  clone.style.opacity = "1";
  clone.style.position = "fixed";

  document.body.appendChild(clone);

  requestAnimationFrame(() => {
    clone.style.left = `${targetX}px`;
    clone.style.top = `${targetY}px`;
    clone.style.transform = "scale(0.6)";
    clone.style.opacity = "1";
  });

  setTimeout(() => {
    if (!island) return;
    clone.style.position = "absolute";
    clone.style.left = "50%";
    clone.style.top = "0%";
    clone.style.transform = "translate(-50%, -60%) scale(0.55)";
    clone.style.transition = "none";
    island.appendChild(clone);
  }, 950);
}

function endGame() {
  state.roundActive = false;
  if (state.timerEnabled) {
    stopTimer();
    state.roundTimes.push(state.elapsedMs);
    const stats = calculateTimerStats(state.roundTimes);
    state.bestRoundTimeMs = stats.bestRoundTimeMs;
  }
  let starHtml = "";
  if (state.roundCorrect === TOTAL_QUESTIONS) {
    starHtml = "<span class=\"star gold\">★</span><span class=\"star gold\">★</span><span class=\"star gold\">★</span>";
  } else if (state.roundCorrect >= 4) {
    starHtml = "<span class=\"star green\">★</span><span class=\"star green\">★</span><span class=\"star gray\">☆</span>";
  } else if (state.roundCorrect > 1) {
    starHtml = "<span class=\"star green\">★</span><span class=\"star gray\">☆</span><span class=\"star gray\">☆</span>";
  } else {
    starHtml = "<span class=\"star gray\">☆</span><span class=\"star gray\">☆</span><span class=\"star gray\">☆</span>";
  }
  stars.innerHTML = starHtml;

  const strings = i18n[state.lang];
  const earned = award(`${state.sessionId}:round:${state.roundNumber}`, roundReward(state.roundCorrect, TOTAL_QUESTIONS), state.roundCorrect === TOTAL_QUESTIONS ? strings.perfect_coin_bonus : "");
  if (earned) {
    profile.statistics.completedRounds += 1;
    if (state.roundCorrect === TOTAL_QUESTIONS) {
      profile.statistics.perfectRounds += 1;
      profile.statistics.flowersGrown += 1;
    }
    if (state.timerEnabled) profile.statistics.completedTimedRounds += 1;
    if (!profile.statistics.completedDifficulties.includes(state.difficulty)) profile.statistics.completedDifficulties.push(state.difficulty);
  }
  coinSummary.textContent = strings.round_coin_bonus(earned);
  unlockAchievements();
  endTitle.textContent = strings.end_title;
  endSummary.textContent = strings.end_summary(state.roundCorrect, TOTAL_QUESTIONS);
  if (state.timerEnabled && endTime) {
    endTime.textContent = `${strings.time_label}: ${formatTime(state.elapsedMs)}`;
  } else if (endTime) {
    endTime.textContent = "";
  }
  if (confetti) confetti.classList.add("active");
  kitten.classList.remove("sleeping");
  kitten.classList.add("celebrating");
  setKittenMood(null);
  setCelebrateMessage();
  moveFlowerToIsland();
  if (endDelayTimer) clearTimeout(endDelayTimer);
  endDelayTimer = setTimeout(() => {
    if (confetti) confetti.classList.remove("active");
    if (celebrate) celebrate.textContent = "";
    if (speech) {
      speech.textContent = "";
      speech.classList.remove("active");
    }
    kitten.classList.remove("celebrating");
    openDialog(endOverlay, nextRoundBtn);
  }, 5000);
}

answerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!state.roundActive || state.timerPaused) return;
  const input = answerInput.value.trim();
  if (input === "") return;
  const numeric = Number(input);
  const strings = i18n[state.lang];

  if (numeric === state.currentQuestion.answer) {
    state.roundCorrect = Math.min(state.roundCorrect + 1, TOTAL_QUESTIONS);
    state.totalCorrect += 1;
    state.streak += 1;
    profile.statistics.correctAnswers += 1;
    profile.statistics.bestStreak = Math.max(profile.statistics.bestStreak, state.streak);
    award(`${state.sessionId}:answer:${state.roundNumber}:${state.currentIndex}`, answerReward(state.streak), state.streak % 3 === 0 ? strings.streak_coin_bonus : "");
    unlockAchievements();
    state.score += getAnswerScore(state.difficulty, state.streak);
    state.consecutiveWrong = 0;
    state.currentIndex += 1;
    state.results.push(true);
    setFeedback(strings.correct, true);
    setHint("");
    setKittenCrying(false);
    setKittenMood(null);
    playKitten("happy");

    updateDifficultyUI();

    updateStats();
    updateFlowerProgress(state.roundCorrect);
    if (state.currentIndex >= TOTAL_QUESTIONS) {
      stopTimer();
      endGame();
    } else {
      setTimeout(nextQuestion, 500);
    }
  } else {
    state.wrongAttempts += 1;
    setFeedback(strings.wrong, false);
    answerInput.value = "";
    answerInput.focus();
    if (state.wrongAttempts === 1) {
      state.streak = 0;
      setKittenMood("neutral");
      playKitten("shake");
    }
    if (state.wrongAttempts >= 2) {
      giveHint();
      state.consecutiveWrong += 1;
      if (state.consecutiveWrong > 3) {
        setKittenCrying(true);
        setKittenMood("sad");
      }
      state.currentIndex += 1;
      state.results.push(false);
      updateStats();
      if (state.currentIndex >= TOTAL_QUESTIONS) {
        stopTimer();
        endGame();
      } else {
        setTimeout(nextQuestion, 500);
      }
    }
  }
});

function updateDifficultyUI() {
  difficultyButtons.forEach((btn) => {
    const level = btn.getAttribute("data-difficulty");
    btn.classList.remove("locked");
    btn.disabled = false;
    btn.classList.toggle("active", level === state.difficulty);
    btn.setAttribute("aria-pressed", String(level === state.difficulty));
  });
  startDifficultyButtons.forEach((btn) => {
    const level = btn.getAttribute("data-start-difficulty");
    btn.classList.remove("locked");
    btn.disabled = false;
    btn.classList.toggle("active", level === state.difficulty);
    btn.setAttribute("aria-pressed", String(level === state.difficulty));
  });
}

difficultyButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const level = btn.getAttribute("data-difficulty");
    state.difficulty = level;
    const replacement = generateRoundPlan(level, Math.random, state.roundNumber);
    state.roundQuestions.splice(state.currentIndex, TOTAL_QUESTIONS - state.currentIndex, ...replacement.slice(state.currentIndex));
    updateDifficultyUI();
    state.wrongAttempts = 0;
    state.consecutiveWrong = 0;
    endOverlay.hidden = true;
    setKittenCrying(false);
    setKittenMood(null);
    updateStats();
    updateFlowerProgress(state.roundCorrect);
    nextQuestion();
  });
});

Array.from(document.querySelectorAll("[data-lang]")).forEach((btn) => {
  btn.addEventListener("click", () => {
    setLanguage(btn.getAttribute("data-lang"));
    renderScoreboard();
  });
});



// handled below with null checks

if (nextRoundBtn) {
  nextRoundBtn.addEventListener("click", () => {
    closeDialog(endOverlay, false);
    nextRound();
  });
}
if (playAgainBtn) {
  playAgainBtn.addEventListener("click", () => {
    state.confirmWasPaused = state.timerPaused;
    openDialog(confirmOverlay, confirmNo);
  });
}
if (startGameBtn) {
  startGameBtn.addEventListener("click", () => {
    closeDialog(startOverlay, false);
    state.timerEnabled = !!(timerToggle && timerToggle.checked);
    if (timerRow) timerRow.hidden = false;
    if (pauseBtn) pauseBtn.hidden = !state.timerEnabled;
    if (timer) timer.hidden = !state.timerEnabled;
    if (playerNameInput) {
      state.playerName = playerNameInput.value.trim();
    }
    startGame();
    renderScoreboard();
  });
}
if (playerNameInput) {
  playerNameInput.addEventListener("input", () => {
    state.playerName = playerNameInput.value.trim();
    if (saveScoreBtn) saveScoreBtn.disabled = false;
  });
}
startDifficultyButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    startDifficultyButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    state.difficulty = btn.getAttribute("data-start-difficulty");
    updateDifficultyUI();
  });
});
if (fullScoreBtn) {
  fullScoreBtn.addEventListener("click", openFullScoreboard);
}
if (closeFullScoreX) {
  closeFullScoreX.addEventListener("click", () => {
    closeDialog(fullScoreOverlay);
  });
}
if (clearScoresBtn) {
  clearScoresBtn.addEventListener("click", () => {
    openDialog(clearScoresOverlay, clearScoresNo);
  });
}
if (clearScoresYes) {
  clearScoresYes.addEventListener("click", () => {
    localStorage.removeItem("mathgame_scores_notimer");
    localStorage.removeItem("mathgame_scores_timer");
    closeDialog(clearScoresOverlay, false);
    renderScoreboard();
    openFullScoreboard();
  });
}
if (clearScoresNo) {
  clearScoresNo.addEventListener("click", () => {
    closeDialog(clearScoresOverlay);
  });
}

function openShop() {
  state.shopWasPaused = state.timerPaused;
  if (state.roundActive && state.timerEnabled && !state.timerPaused) pauseBtn?.click();
  renderShop({ container: shopContent, preview: shopKittenPreview, profile, strings: i18n[state.lang], activeCategory: activeShopCategory });
  openDialog(shopOverlay, closeShopBtn);
}

function closeShop() {
  closeDialog(shopOverlay);
  if (state.roundActive && state.timerEnabled && state.timerPaused && !state.shopWasPaused) pauseBtn?.click();
}

shopBtn?.addEventListener("click", openShop);
closeShopBtn?.addEventListener("click", closeShop);
shopContent?.addEventListener("click", (event) => {
  const control = event.target.closest("button[data-action]");
  const card = event.target.closest(".shop-item[data-item-id]");
  const selectedItem = card ? findItem(card.dataset.itemId) : null;
  if (selectedItem) {
    shopContent.querySelectorAll(".shop-item").forEach((entry) => entry.classList.toggle("selected", entry === card));
    if (selectedItem.category !== "theme") {
      const previewProfile = {
        ...profile,
        equippedItems: { ...profile.equippedItems, [selectedItem.category]: selectedItem.id },
      };
      renderKitten(shopKittenPreview, previewProfile, i18n[state.lang][selectedItem.translationKey]);
    }
  }
  if (!control) return;
  if (control.disabled) return;
  if (control.dataset.action === "category") {
    activeShopCategory = control.dataset.category;
  } else if (control.dataset.action === "buy") {
    pendingPurchaseId = control.dataset.itemId;
    const item = findItem(pendingPurchaseId);
    purchaseText.textContent = i18n[state.lang].purchase_confirm(i18n[state.lang][item.translationKey], item.price);
    openDialog(purchaseOverlay, purchaseNo);
    return;
  } else if (control.dataset.action === "equip") {
    profile = equipItem(profile, control.dataset.itemId);
    refreshProfileUI();
  } else if (control.dataset.action === "remove") {
    const item = findItem(control.dataset.itemId);
    profile = removeEquippedItem(profile, item.category);
    refreshProfileUI();
  }
  renderShop({ container: shopContent, preview: shopKittenPreview, profile, strings: i18n[state.lang], activeCategory: activeShopCategory });
});
shopContent?.addEventListener("keydown", (event) => {
  if ((event.key === "Enter" || event.key === " ") && event.target.matches(".shop-item")) {
    event.preventDefault();
    event.target.click();
  }
});

purchaseYes?.addEventListener("click", () => {
  const item = findItem(pendingPurchaseId);
  const result = purchaseItem(profile, pendingPurchaseId);
  profile = result.profile;
  closeDialog(purchaseOverlay, false);
  if (result.ok) {
    rewardLive.textContent = i18n[state.lang].purchase_success(i18n[state.lang][item.translationKey]);
    refreshProfileUI();
  }
  pendingPurchaseId = null;
});
purchaseNo?.addEventListener("click", () => {
  pendingPurchaseId = null;
  closeDialog(purchaseOverlay);
});


endOverlay.hidden = true;
refreshProfileUI(false);
setLanguage(state.lang);
renderScoreboard();
showStartScreen();
startIdleLoop();
updateDifficultyUI();
updateFlowerProgress(state.roundCorrect);
scheduleRainbow();
renderScoreboard();


if (pauseBtn) {
  pauseBtn.addEventListener("click", () => {
    if (!state.timerEnabled) return;
    if (state.timerPaused) {
      state.timerPaused = false;
      kitten.classList.remove("sleeping");
      pauseBtn.classList.remove("active");
      pauseBtn.textContent = i18n[state.lang].pause;
      pauseBtn.setAttribute("aria-pressed", "false");
      setAnswerEnabled(true);
      resumeTimer();
    } else {
      state.timerPaused = true;
      kitten.classList.add("sleeping");
      pauseBtn.classList.add("active");
      pauseBtn.textContent = i18n[state.lang].continue;
      pauseBtn.setAttribute("aria-pressed", "true");
      setAnswerEnabled(false);
      stopTimer();
    }
  });
}

if (newGameBtn) {
  newGameBtn.addEventListener("click", () => {
    state.confirmWasPaused = state.timerPaused;
    if (!state.timerEnabled) {
      openDialog(confirmOverlay, confirmNo);
      return;
    }
    if (!state.timerPaused) {
      state.timerPaused = true;
      stopTimer();
      kitten.classList.add("sleeping");
      setAnswerEnabled(false);
    }
    openDialog(confirmOverlay, confirmNo);
  });
}

if (confirmYes) {
  confirmYes.addEventListener("click", () => {
    closeDialog(confirmOverlay, false);
    showStartScreen();
    stopTimer();
    state.timerEnabled = false;
    state.timerPaused = false;
    setAnswerEnabled(true);
    kitten.classList.remove("sleeping");
    kitten.classList.remove("celebrating");
    if (pauseBtn) {
      pauseBtn.classList.remove("active");
      pauseBtn.textContent = i18n[state.lang].pause;
      pauseBtn.setAttribute("aria-pressed", "false");
    }
    if (confetti) confetti.classList.remove("active");
    if (celebrate) celebrate.textContent = "";
    if (speech) {
      speech.textContent = "";
      speech.classList.remove("active");
    }
    if (endDelayTimer) {
      clearTimeout(endDelayTimer);
      endDelayTimer = null;
    }
    renderScoreboard();
  });
}

if (confirmNo) {
  confirmNo.addEventListener("click", () => {
    closeDialog(confirmOverlay);
    if (state.roundActive && state.timerEnabled && state.timerPaused && !state.confirmWasPaused) {
      state.timerPaused = false;
      kitten.classList.remove("sleeping");
      setAnswerEnabled(true);
      if (pauseBtn) {
        pauseBtn.classList.remove("active");
        pauseBtn.textContent = i18n[state.lang].pause;
        pauseBtn.setAttribute("aria-pressed", "false");
      }
      resumeTimer();
    }
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  if (purchaseOverlay && !purchaseOverlay.hidden) {
    pendingPurchaseId = null;
    closeDialog(purchaseOverlay);
  } else if (shopOverlay && !shopOverlay.hidden) {
    closeShop();
  } else if (clearScoresOverlay && !clearScoresOverlay.hidden) {
    closeDialog(clearScoresOverlay);
  } else if (fullScoreOverlay && !fullScoreOverlay.hidden) {
    closeDialog(fullScoreOverlay);
  }
});

if (saveScoreBtn) {
  saveScoreBtn.addEventListener("click", () => {
    const name = (state.playerName || "Player").slice(0, 20);
    const scoreValue = Number.isInteger(state.score)
      ? state.score
      : Number(state.score.toFixed(1));
    if (state.timerEnabled) {
      const scores = loadScores("mathgame_scores_timer").map(normalizeTimerScore);
      const stats = calculateTimerStats(state.roundTimes);
      // Run-based leaderboard entry: keep every saved game run.
      scores.push({
        name,
        level: state.difficulty,
        rounds: state.roundNumber,
        bestRoundTimeMs: stats.bestRoundTimeMs ?? state.elapsedMs,
        avgRoundTimeMs: stats.avgRoundTimeMs,
        score: scoreValue,
        timestamp: Date.now()
      });
      saveScores("mathgame_scores_timer", limitTimerScores(scores));
    } else {
      const scores = upsertNoTimerScore(loadScores("mathgame_scores_notimer"), {
        name,
        level: state.difficulty,
        maxRound: state.roundNumber,
        score: scoreValue,
        timestamp: Date.now(),
      });
      saveScores("mathgame_scores_notimer", limitNoTimerScores(scores));
    }
    renderScoreboard();
    saveScoreBtn.disabled = true;
  });
}
