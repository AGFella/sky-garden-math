const TOTAL_QUESTIONS = 10;
const STREAK_BONUS_AT = 3;
const UNLOCK_TARGET = 10;

const i18n = {
  ru: {
    title: "Sky Garden Rescue",
    subtitle: "Помоги садовнику и котику спасти острова",
    difficulty: "Сложность",
    easy: "Легко",
    medium: "Средне",
    hard: "Сложно",
    submit: "Ответить",
    restart: "Начать заново",
    progress: "Прогресс",
    round: "Раунд",
    streak: "Серия",
    score: "Очки",
    story: "Каждое правильное решение оживляет семена и возвращает цвет на острова.",
    play_again: "Играть снова",
    next_round: "Следующий раунд",
    new_game: "Новая игра",
    start_game: "Начать игру",
    timer_label: "Таймер",
    player_name: "Имя игрока",
    save_score: "Сохранить результат",
    no_timer: "Без таймера",
    with_timer: "С таймером",
    full_score: "Полная таблица",
    clear_scores: "Очистить таблицу",
    clear_confirm: "Вы уверены, что хотите удалить все эти прекрасные результаты?",
    pause: "Пауза",
    continue: "Продолжить",
    confirm_quit: "Выйти из игры?",
    confirm_text: "Текущий прогресс будет потерян.",
    yes: "Да",
    no: "Нет",
    time_label: "Время",
    encourage_1: "Ты молодец!",
    encourage_2: "Супер!",
    encourage_3: "Так держать!",
    encourage_4: "Отличная работа!",
    correct: "Отлично!",
    wrong: "Почти! Попробуй еще раз.",
    hint_mul: (a, b) => `Подсказка: ${a} + ${a} + ... (всего ${b} раз)` ,
    hint_div: (a, b) => `Подсказка: какое число умножить на ${b}, чтобы получить ${a}?`,
    end_title: "Миссия завершена!",
    end_summary: (score, total) => `Правильных ответов: ${score} из ${total}.`,
  },
  it: {
    title: "Sky Garden Rescue",
    subtitle: "Aiuta il giardiniere e il gattino a salvare le isole",
    difficulty: "Difficolta",
    easy: "Facile",
    medium: "Medio",
    hard: "Difficile",
    submit: "Rispondi",
    restart: "Ricomincia",
    progress: "Progresso",
    round: "Round",
    streak: "Serie",
    score: "Punti",
    story: "Ogni risposta giusta fa crescere i semi e riporta colore alle isole.",
    play_again: "Gioca ancora",
    next_round: "Prossimo round",
    new_game: "Nuova partita",
    start_game: "Avvia",
    timer_label: "Timer",
    player_name: "Nome giocatore",
    save_score: "Salva risultato",
    no_timer: "Senza timer",
    with_timer: "Con timer",
    full_score: "Tabella completa",
    clear_scores: "Cancella tabella",
    clear_confirm: "Sei sicuro di voler eliminare tutti questi splendidi risultati?",
    pause: "Pausa",
    continue: "Continua",
    confirm_quit: "Uscire dal gioco?",
    confirm_text: "I progressi andranno persi.",
    yes: "Si",
    no: "No",
    time_label: "Tempo",
    encourage_1: "Bravo!",
    encourage_2: "Ottimo!",
    encourage_3: "Continua cosi!",
    encourage_4: "Grandioso!",
    correct: "Ben fatto!",
    wrong: "Quasi! Riprova.",
    hint_mul: (a, b) => `Suggerimento: ${a} + ${a} + ... (${b} volte)`,
    hint_div: (a, b) => `Suggerimento: che numero per ${b} fa ${a}?`,
    end_title: "Missione completata!",
    end_summary: (score, total) => `Risposte corrette: ${score} su ${total}.`,
  }
  ,
  en: {
    title: "Sky Garden Rescue",
    subtitle: "Help the gardener and the kitty save the islands",
    difficulty: "Difficulty",
    easy: "Easy",
    medium: "Medium",
    hard: "Hard",
    submit: "Submit",
    restart: "Restart",
    progress: "Progress",
    round: "Round",
    streak: "Streak",
    score: "Score",
    story: "Each correct answer makes seeds grow and brings color back to the islands.",
    play_again: "Play again",
    next_round: "Next round",
    new_game: "New game",
    start_game: "Start game",
    timer_label: "Timer",
    player_name: "Player name",
    save_score: "Save score",
    no_timer: "No timer",
    with_timer: "With timer",
    full_score: "Full scoreboard",
    clear_scores: "Clear scoreboard",
    clear_confirm: "Are you sure you want to delete all these beautiful results?",
    pause: "Pause",
    continue: "Continue",
    confirm_quit: "Quit the game?",
    confirm_text: "Current progress will be lost.",
    yes: "Yes",
    no: "No",
    time_label: "Time",
    encourage_1: "Awesome!",
    encourage_2: "Well done!",
    encourage_3: "Keep it up!",
    encourage_4: "Great work!",
    correct: "Great!",
    wrong: "Almost! Try again.",
    hint_mul: (a, b) => `Hint: ${a} + ${a} + ... (${b} times)`,
    hint_div: (a, b) => `Hint: what number times ${b} makes ${a}?`,
    end_title: "Mission complete!",
    end_summary: (score, total) => `Correct answers: ${score} out of ${total}.`,
  }
};

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
  streak: 0,
  consecutiveWrong: 0,
  wrongAttempts: 0,
  currentQuestion: null,
  results: [],
  unlocked: {
    medium: false,
    hard: false,
  },
  islandIndex: 0,
};

const problemText = document.getElementById("problemText");
const answerForm = document.getElementById("answerForm");
const answerInput = document.getElementById("answerInput");
const feedback = document.getElementById("feedback");
const hint = document.getElementById("hint");
const progressSteps = document.getElementById("progressSteps");
const progressText = document.getElementById("progressText");
const questionText = document.getElementById("questionText");
const streakText = document.getElementById("streakText");
const scoreText = document.getElementById("scoreText");
const seed = document.getElementById("seed");
const kitten = document.getElementById("kitten");
const timer = document.getElementById("timer");
const endOverlay = document.getElementById("endOverlay");
const stars = document.getElementById("stars");
const endTitle = document.getElementById("endTitle");
const endSummary = document.getElementById("endSummary");
const endTime = document.getElementById("endTime");
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
const speech = document.getElementById("speech");
const playerNameInput = document.getElementById("playerNameInput");
const saveScoreBtn = document.getElementById("saveScoreBtn");
const scoreTable = document.getElementById("scoreTable");
const fullScoreBtn = document.getElementById("fullScoreBtn");
const rainbow = document.getElementById("rainbow");

const KITTY_ANIM_MS = 600;
const IDLE_INTERVAL_MS = 5000;
const CORRECT_FEEDBACK_MS = 5000;
let idleTimer = null;
let feedbackTimer = null;
let roundTimer = null;
let endDelayTimer = null;
let rainbowTimer = null;

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
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (strings[key]) {
      el.textContent = strings[key];
    }
  });
  updateProblemText();
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function makeAddition(range) {
  const a = randomInt(range[0], range[1]);
  const b = randomInt(range[0], range[1]);
  return { a, b, op: "+", answer: a + b };
}

function makeSubtraction(range) {
  const a = randomInt(range[0], range[1]);
  const b = randomInt(range[0], Math.min(a, range[1]));
  return { a, b, op: "−", answer: a - b };
}

function makeMultiplication(rangeA, rangeB) {
  const a = randomInt(rangeA[0], rangeA[1]);
  const b = randomInt(rangeB[0], rangeB[1]);
  return { a, b, op: "×", answer: a * b };
}

function makeDivision(rangeDivisor, rangeQuotient) {
  const divisor = randomInt(rangeDivisor[0], rangeDivisor[1]);
  const quotient = randomInt(rangeQuotient[0], rangeQuotient[1]);
  const dividend = divisor * quotient;
  return { a: dividend, b: divisor, op: "÷", answer: quotient };
}

function generateQuestion(difficulty) {
  const pick = Math.random();
  if (difficulty === "easy") {
    if (pick < 0.5) return makeAddition([0, 19]);
    if (pick < 0.75) return makeSubtraction([0, 19]);
    return pick < 0.875
      ? makeMultiplication([1, 4], [1, 4])
      : makeDivision([1, 4], [1, 4]);
  }
  if (difficulty === "medium") {
    if (pick < 0.5) return makeAddition([0, 30]);
    if (pick < 0.75) return makeSubtraction([0, 30]);
    return pick < 0.875
      ? makeMultiplication([1, 9], [1, 9])
      : makeDivision([2, 9], [1, 9]);
  }
  if (pick < 0.4) return makeAddition([0, 100]);
  if (pick < 0.8) return makeSubtraction([0, 100]);
  return pick < 0.9
    ? makeMultiplication([2, 100], [2, 10])
    : makeDivision([2, 10], [2, 100]);
}

function updateProblemText() {
  if (!state.currentQuestion) return;
  const { a, b, op } = state.currentQuestion;
  problemText.textContent = `${a} ${op} ${b} = ?`;
}

function updateStats() {
  progressText.textContent = `${state.roundNumber}`;
  if (questionText) {
    questionText.textContent = `${state.currentIndex} / ${TOTAL_QUESTIONS}`;
  }
  streakText.textContent = state.streak;
  scoreText.textContent = state.score;
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
      el.style.background = randomPetalColor();
      el.dataset.colorSet = "true";
    }
    if (!shouldBeOn && el.classList.contains("petal")) {
      el.dataset.colorSet = "";
    }
  });
}

function randomPetalColor() {
  const hue = Math.floor(Math.random() * 360);
  const saturation = 65 + Math.floor(Math.random() * 20);
  const lightness = 55 + Math.floor(Math.random() * 10);
  if ((hue >= 85 && hue <= 150)) {
    return randomPetalColor();
  }
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
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
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function startTimer() {
  if (!timer) return;
  state.elapsedMs = 0;
  timer.textContent = "00:00";
  timer.hidden = false;
  const start = Date.now();
  if (roundTimer) clearInterval(roundTimer);
  roundTimer = setInterval(() => {
    state.elapsedMs = Date.now() - start;
    timer.textContent = formatTime(state.elapsedMs);
  }, 500);
}

function resumeTimer() {
  if (!timer) return;
  const base = state.elapsedMs;
  const start = Date.now();
  if (roundTimer) clearInterval(roundTimer);
  roundTimer = setInterval(() => {
    state.elapsedMs = base + (Date.now() - start);
    timer.textContent = formatTime(state.elapsedMs);
  }, 500);
}

function stopTimer() {
  if (roundTimer) {
    clearInterval(roundTimer);
    roundTimer = null;
  }
  if (timer) {
    timer.hidden = !state.timerEnabled;
  }
}

function loadScores(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveScores(key, list) {
  localStorage.setItem(key, JSON.stringify(list));
}

function renderScoreboard() {
  if (!scoreTable) return;
  const strings = i18n[state.lang];
  const showTimer = state.timerEnabled;
  if (!showTimer) {
    const scores = loadScores("mathgame_scores_notimer");
    scores.sort((a, b) => b.maxRound - a.maxRound || b.timestamp - a.timestamp);
    const rows = scores.slice(0, 3);
    scoreTable.innerHTML = [
      `<div class="score-row header"><div>${strings.player_name}</div><div>${strings.round}</div><div>${strings.difficulty}</div></div>`,
      ...rows.map((s) => `<div class="score-row"><div>${s.name}</div><div>${s.maxRound}</div><div>${s.level}</div></div>`)
    ].join("");
  } else {
    const scores = loadScores("mathgame_scores_timer");
    scores.sort((a, b) => a.bestTimeMs - b.bestTimeMs || b.rounds - a.rounds);
    const rows = scores.slice(0, 3);
    scoreTable.innerHTML = [
      `<div class="score-row header"><div>${strings.player_name}</div><div>${strings.round}</div><div>${strings.time_label}</div></div>`,
      ...rows.map((s) => `<div class="score-row"><div>${s.name}</div><div>${s.rounds}</div><div>${formatTime(s.bestTimeMs)}</div></div>`)
    ].join("");
  }
}

function openFullScoreboard() {
  const strings = i18n[state.lang];
  const notimer = loadScores("mathgame_scores_notimer");
  const timer = loadScores("mathgame_scores_timer");
  notimer.sort((a, b) => b.maxRound - a.maxRound || b.timestamp - a.timestamp);
  timer.sort((a, b) => a.bestTimeMs - b.bestTimeMs || b.rounds - a.rounds);
  const w = window.open("", "_blank", "width=600,height=700");
  if (!w) return;
  const html = `
  <html><head><title>Scoreboard</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; }
    h2 { margin-top: 24px; }
    table { width: 100%; border-collapse: collapse; margin-top: 8px; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background: #f5f5f5; }
    .actions { margin-top: 20px; display: flex; justify-content: flex-end; }
    .clear { border: 1px dashed #c55; background: #fff5f5; padding: 8px 12px; border-radius: 8px; cursor: pointer; }
  </style></head><body>
    <h2>${strings.no_timer}</h2>
    <table>
      <tr><th>${strings.player_name}</th><th>${strings.round}</th><th>${strings.difficulty}</th></tr>
      ${notimer.map(s => `<tr><td>${s.name}</td><td>${s.maxRound}</td><td>${s.level}</td></tr>`).join("")}
    </table>
    <h2>${strings.with_timer}</h2>
    <table>
      <tr><th>${strings.player_name}</th><th>${strings.round}</th><th>${strings.time_label}</th></tr>
      ${timer.map(s => `<tr><td>${s.name}</td><td>${s.rounds}</td><td>${formatTime(s.bestTimeMs)}</td></tr>`).join("")}
    </table>
    <div class="actions">
      <button class="clear" id="clearScores">${strings.clear_scores}</button>
    </div>
    <script>
      const clearBtn = document.getElementById("clearScores");
      if (clearBtn) {
        clearBtn.addEventListener("click", () => {
          if (confirm("${strings.clear_confirm}")) {
            localStorage.removeItem("mathgame_scores_notimer");
            localStorage.removeItem("mathgame_scores_timer");
            if (window.opener) {
              window.opener.postMessage({ type: "scoresCleared" }, "*");
            }
            location.reload();
          }
        });
      }
    </script>
  </body></html>`;
  w.document.write(html);
  w.document.close();
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
  state.currentQuestion = generateQuestion(state.difficulty);
  state.wrongAttempts = 0;
  updateProblemText();
  setHint("");
  answerInput.value = "";
  answerInput.focus();
}

function startGame() {
  state.currentIndex = 0;
  state.roundCorrect = 0;
  state.totalCorrect = 0;
  state.roundNumber = 1;
  state.score = 0;
  state.bestRoundTimeMs = null;
  state.streak = 0;
  state.consecutiveWrong = 0;
  state.wrongAttempts = 0;
  state.currentQuestion = null;
  state.results = [];
  state.unlocked.medium = false;
  state.unlocked.hard = false;
  updateStats();
  endOverlay.hidden = true;
  setKittenCrying(false);
  setKittenMood(null);
  updateFlowerProgress(0);
  updateDifficultyUI();
  stopTimer();
  state.timerPaused = false;
  state.roundActive = true;
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

function nextRound() {
  state.currentIndex = 0;
  state.roundCorrect = 0;
  state.roundNumber += 1;
  state.streak = 0;
  state.consecutiveWrong = 0;
  state.wrongAttempts = 0;
  state.currentQuestion = null;
  state.results = [];
  if (state.roundNumber >= 2) state.unlocked.medium = true;
  if (state.roundNumber >= 4) state.unlocked.hard = true;
  updateStats();
  endOverlay.hidden = true;
  setKittenCrying(false);
  setKittenMood(null);
  updateFlowerProgress(0);
  updateDifficultyUI();
  stopTimer();
  state.timerPaused = false;
  state.roundActive = true;
  if (saveScoreBtn) saveScoreBtn.disabled = false;
  if (state.timerEnabled) {
    state.bestRoundTimeMs = Math.min(
      state.bestRoundTimeMs ?? Number.POSITIVE_INFINITY,
      state.elapsedMs
    );
  }
  if (pauseBtn) pauseBtn.hidden = !state.timerEnabled;
  if (timer) timer.hidden = !state.timerEnabled;
  if (state.timerEnabled) startTimer();
  nextQuestion();
}

function giveHint() {
  const strings = i18n[state.lang];
  const { a, b, op } = state.currentQuestion;
  if (op === "×") {
    setHint(strings.hint_mul(a, b));
  } else {
    setHint(strings.hint_div(a, b));
  }
}

function celebrateSeed() {
  if (!seed) return;
  seed.classList.add("grow");
  setTimeout(() => seed.classList.remove("grow"), 300);
}

function setCelebrateMessage() {
  if (!celebrate) return;
  const messages = [
    "Great job!",
    "Well done!",
    "You are the best!",
    "Fantastic!",
    "Amazing work!"
  ];
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
    state.bestRoundTimeMs = Math.min(
      state.bestRoundTimeMs ?? Number.POSITIVE_INFINITY,
      state.elapsedMs
    );
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
    endOverlay.hidden = false;
  }, 5000);
}

answerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!state.roundActive) return;
  const input = answerInput.value.trim();
  if (input === "") return;
  const numeric = Number(input);
  const strings = i18n[state.lang];

  if (numeric === state.currentQuestion.answer) {
    state.score += 1;
    state.roundCorrect = Math.min(state.roundCorrect + 1, TOTAL_QUESTIONS);
    state.totalCorrect += 1;
    state.streak += 1;
    state.consecutiveWrong = 0;
    state.currentIndex += 1;
    state.results.push(true);
    setFeedback(strings.correct, true);
    setHint("");
    celebrateSeed();
    setKittenCrying(false);
    setKittenMood(null);
    playKitten("happy");

    updateDifficultyUI();

    if (state.streak > 0 && state.streak % STREAK_BONUS_AT === 0) {
      state.score += 1;
    }

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
  });
  startDifficultyButtons.forEach((btn) => {
    const level = btn.getAttribute("data-start-difficulty");
    btn.classList.remove("locked");
    btn.disabled = false;
    btn.classList.toggle("active", level === state.difficulty);
  });
}

difficultyButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const level = btn.getAttribute("data-difficulty");
    const isUnlocked =
      level === "easy" ||
      (level === "medium" && state.unlocked.medium) ||
      (level === "hard" && state.unlocked.hard);
    if (!isUnlocked) return;
    state.difficulty = level;
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
  });
});



// handled below with null checks

if (nextRoundBtn) {
  nextRoundBtn.addEventListener("click", nextRound);
}
if (playAgainBtn) {
  playAgainBtn.addEventListener("click", () => {
    if (confirmOverlay) confirmOverlay.hidden = false;
  });
}
if (startGameBtn) {
  startGameBtn.addEventListener("click", () => {
    if (startOverlay) startOverlay.hidden = true;
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

endOverlay.hidden = true;
setLanguage(state.lang);
if (startOverlay) startOverlay.hidden = false;
if (timer) timer.hidden = true;
if (timerRow) timerRow.hidden = true;
startIdleLoop();
updateDifficultyUI();
updateFlowerProgress(state.roundCorrect);
scheduleRainbow();
renderScoreboard();

window.addEventListener("message", (event) => {
  if (event && event.data && event.data.type === "scoresCleared") {
    renderScoreboard();
  }
});

if (pauseBtn) {
  pauseBtn.addEventListener("click", () => {
    if (!state.timerEnabled) return;
    if (state.timerPaused) {
      state.timerPaused = false;
      kitten.classList.remove("sleeping");
      pauseBtn.classList.remove("active");
      pauseBtn.textContent = i18n[state.lang].pause;
      resumeTimer();
    } else {
      state.timerPaused = true;
      kitten.classList.add("sleeping");
      pauseBtn.classList.add("active");
      pauseBtn.textContent = i18n[state.lang].continue;
      stopTimer();
    }
  });
}

if (newGameBtn) {
  newGameBtn.addEventListener("click", () => {
    if (!state.timerEnabled) {
      if (confirmOverlay) confirmOverlay.hidden = false;
      return;
    }
    if (!state.timerPaused) {
      state.timerPaused = true;
      stopTimer();
      kitten.classList.add("sleeping");
    }
    if (confirmOverlay) confirmOverlay.hidden = false;
  });
}

if (confirmYes) {
  confirmYes.addEventListener("click", () => {
    if (confirmOverlay) confirmOverlay.hidden = true;
    if (startOverlay) startOverlay.hidden = false;
    startGame();
    stopTimer();
    if (timerRow) timerRow.hidden = true;
    state.timerEnabled = false;
    state.timerPaused = false;
    kitten.classList.remove("sleeping");
    kitten.classList.remove("celebrating");
    if (pauseBtn) {
      pauseBtn.classList.remove("active");
      pauseBtn.textContent = i18n[state.lang].pause;
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
    if (confirmOverlay) confirmOverlay.hidden = true;
    if (state.timerEnabled && state.timerPaused) {
      state.timerPaused = false;
      kitten.classList.remove("sleeping");
      if (pauseBtn) {
        pauseBtn.classList.remove("active");
        pauseBtn.textContent = i18n[state.lang].pause;
      }
      resumeTimer();
    }
  });
}

if (saveScoreBtn) {
  saveScoreBtn.addEventListener("click", () => {
    const name = (state.playerName || "Player").slice(0, 20);
    if (state.timerEnabled) {
      const scores = loadScores("mathgame_scores_timer");
      const existing = scores.find((s) => s.name === name && s.level === state.difficulty);
      const bestTime = state.bestRoundTimeMs ?? state.elapsedMs;
      if (existing) {
        existing.rounds = Math.max(existing.rounds, state.roundNumber);
        existing.bestTimeMs = Math.min(existing.bestTimeMs, bestTime);
        existing.timestamp = Date.now();
      } else {
        scores.push({
          name,
          level: state.difficulty,
          rounds: state.roundNumber,
          bestTimeMs: bestTime,
          timestamp: Date.now()
        });
      }
      saveScores("mathgame_scores_timer", scores);
    } else {
      const scores = loadScores("mathgame_scores_notimer");
      const existing = scores.find((s) => s.name === name && s.level === state.difficulty);
      if (existing) {
        existing.maxRound = Math.max(existing.maxRound, state.roundNumber);
        existing.timestamp = Date.now();
      } else {
        scores.push({
          name,
          level: state.difficulty,
          maxRound: state.roundNumber,
          timestamp: Date.now()
        });
      }
      saveScores("mathgame_scores_notimer", scores);
    }
    renderScoreboard();
    saveScoreBtn.disabled = true;
  });
}
