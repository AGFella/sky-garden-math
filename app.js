const TOTAL_QUESTIONS = 15;
const STREAK_BONUS_AT = 3;

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
    streak: "Серия",
    score: "Очки",
    ship: "Воздушный корабль",
    story: "Каждое правильное решение оживляет семена и возвращает цвет на острова.",
    play_again: "Играть снова",
    correct: "Отлично! Корабль летит быстрее!",
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
    streak: "Serie",
    score: "Punti",
    ship: "Nave volante",
    story: "Ogni risposta giusta fa crescere i semi e riporta colore alle isole.",
    play_again: "Gioca ancora",
    correct: "Ben fatto! La nave vola piu veloce!",
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
    streak: "Streak",
    score: "Score",
    ship: "Airship",
    story: "Each correct answer makes seeds grow and brings color back to the islands.",
    play_again: "Play again",
    correct: "Great! The airship speeds up!",
    wrong: "Almost! Try again.",
    hint_mul: (a, b) => `Hint: ${a} + ${a} + ... (${b} times)`,
    hint_div: (a, b) => `Hint: what number times ${b} makes ${a}?`,
    end_title: "Mission complete!",
    end_summary: (score, total) => `Correct answers: ${score} out of ${total}.`,
  }
};

const state = {
  lang: "ru",
  difficulty: "easy",
  currentIndex: 0,
  score: 0,
  streak: 0,
  wrongAttempts: 0,
  currentQuestion: null,
};

const problemText = document.getElementById("problemText");
const answerForm = document.getElementById("answerForm");
const answerInput = document.getElementById("answerInput");
const feedback = document.getElementById("feedback");
const hint = document.getElementById("hint");
const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");
const streakText = document.getElementById("streakText");
const scoreText = document.getElementById("scoreText");
const seed = document.getElementById("seed");
const endOverlay = document.getElementById("endOverlay");
const stars = document.getElementById("stars");
const endTitle = document.getElementById("endTitle");
const endSummary = document.getElementById("endSummary");

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
    return pick < 0.5
      ? makeMultiplication([2, 9], [2, 9])
      : makeDivision([2, 9], [2, 9]);
  }
  if (difficulty === "medium") {
    return pick < 0.5
      ? makeMultiplication([10, 30], [2, 9])
      : makeDivision([2, 9], [5, 15]);
  }
  return pick < 0.5
    ? makeMultiplication([10, 25], [10, 25])
    : makeDivision([2, 12], [6, 20]);
}

function updateProblemText() {
  if (!state.currentQuestion) return;
  const { a, b, op } = state.currentQuestion;
  problemText.textContent = `${a} ${op} ${b} = ?`;
}

function updateStats() {
  progressText.textContent = `${state.currentIndex} / ${TOTAL_QUESTIONS}`;
  progressBar.style.width = `${(state.currentIndex / TOTAL_QUESTIONS) * 100}%`;
  streakText.textContent = state.streak;
  scoreText.textContent = state.score;
}

function setFeedback(text, isCorrect) {
  feedback.textContent = text;
  feedback.style.color = isCorrect ? "#0f7d4f" : "#c93f3f";
}

function setHint(text) {
  hint.textContent = text || "";
}

function nextQuestion() {
  if (state.currentIndex >= TOTAL_QUESTIONS) {
    endGame();
    return;
  }
  state.currentQuestion = generateQuestion(state.difficulty);
  state.wrongAttempts = 0;
  updateProblemText();
  setFeedback("", true);
  setHint("");
  answerInput.value = "";
  answerInput.focus();
}

function startGame() {
  state.currentIndex = 0;
  state.score = 0;
  state.streak = 0;
  state.wrongAttempts = 0;
  state.currentQuestion = null;
  updateStats();
  endOverlay.hidden = true;
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
  seed.classList.add("grow");
  setTimeout(() => seed.classList.remove("grow"), 300);
}

function endGame() {
  const accuracy = state.score / TOTAL_QUESTIONS;
  const starCount = accuracy >= 0.9 ? 3 : accuracy >= 0.7 ? 2 : 1;
  stars.textContent = "★".repeat(starCount) + "☆".repeat(3 - starCount);

  const strings = i18n[state.lang];
  endTitle.textContent = strings.end_title;
  endSummary.textContent = strings.end_summary(state.score, TOTAL_QUESTIONS);
  endOverlay.hidden = false;
}

answerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const input = answerInput.value.trim();
  if (input === "") return;
  const numeric = Number(input);
  const strings = i18n[state.lang];

  if (numeric === state.currentQuestion.answer) {
    state.score += 1;
    state.streak += 1;
    state.currentIndex += 1;
    setFeedback(strings.correct, true);
    setHint("");
    celebrateSeed();

    if (state.streak > 0 && state.streak % STREAK_BONUS_AT === 0) {
      state.score += 1;
    }

    updateStats();
    setTimeout(nextQuestion, 500);
  } else {
    state.streak = 0;
    state.wrongAttempts += 1;
    setFeedback(strings.wrong, false);
    if (state.wrongAttempts >= 2) {
      giveHint();
    }
    updateStats();
  }
});

Array.from(document.querySelectorAll("[data-difficulty]")).forEach((btn) => {
  btn.addEventListener("click", () => {
    state.difficulty = btn.getAttribute("data-difficulty");
    startGame();
  });
});

Array.from(document.querySelectorAll("[data-lang]")).forEach((btn) => {
  btn.addEventListener("click", () => {
    setLanguage(btn.getAttribute("data-lang"));
  });
});



document.getElementById("restartBtn").addEventListener("click", startGame);
document.getElementById("playAgainBtn").addEventListener("click", startGame);

setLanguage(state.lang);
startGame();
