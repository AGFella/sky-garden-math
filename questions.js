export const TOTAL_QUESTIONS = 10;
export const STREAK_BONUS_AT = 3;

const OPERATION_PLANS = {
  medium: ["+", "+", "−", "−", "×", "×", "×", "÷", "÷", "÷"],
  hard: ["+", "+", "−", "−", "×", "×", "×", "÷", "÷", "÷"],
};
const OPERATIONS = ["+", "−", "×", "÷"];

export function randomInt(min, max, random = Math.random) {
  return Math.floor(random() * (max - min + 1)) + min;
}

function shuffle(items, random) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = randomInt(0, index, random);
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

function addition(cap, minimum, random) {
  const a = randomInt(minimum, cap - minimum, random);
  const b = randomInt(minimum, cap - a, random);
  return { a, b, op: "+", answer: a + b };
}

function subtraction(cap, minimum, random) {
  const a = randomInt(minimum + 1, cap, random);
  const b = randomInt(minimum, a - 1, random);
  return { a, b, op: "−", answer: a - b };
}

function multiplication(maxFactor, maxProduct, preferredMinimum, random) {
  const usePreferred = preferredMinimum > 1 && random() < 0.8;
  const minA = usePreferred ? preferredMinimum : 1;
  const eligibleA = [];
  for (let value = minA; value <= maxFactor; value += 1) {
    if (Math.floor(maxProduct / value) >= (usePreferred ? preferredMinimum : 1)) {
      eligibleA.push(value);
    }
  }
  const a = eligibleA[randomInt(0, eligibleA.length - 1, random)];
  const minB = usePreferred ? preferredMinimum : 1;
  const b = randomInt(minB, Math.min(maxFactor, Math.floor(maxProduct / a)), random);
  return { a, b, op: "×", answer: a * b };
}

function division(maxDivisor, maxDividend, preferredMinimum, random) {
  const usePreferred = preferredMinimum > 1 && random() < 0.8;
  const minimum = usePreferred ? preferredMinimum : 1;
  const eligibleDivisors = [];
  for (let value = minimum; value <= maxDivisor; value += 1) {
    if (Math.floor(maxDividend / value) >= minimum) eligibleDivisors.push(value);
  }
  const divisor = eligibleDivisors[randomInt(0, eligibleDivisors.length - 1, random)];
  const quotient = randomInt(minimum, Math.floor(maxDividend / divisor), random);
  return { a: divisor * quotient, b: divisor, op: "÷", answer: quotient };
}

export function generateQuestion(difficulty, operation, random = Math.random) {
  if (difficulty === "easy") {
    if (operation === "+") return addition(20, 1, random);
    if (operation === "−") return subtraction(20, 1, random);
    if (operation === "×") return multiplication(6, 36, 1, random);
    return division(6, 36, 1, random);
  }

  if (difficulty === "medium") {
    if (operation === "+") return addition(30, random() < 0.8 ? 10 : 1, random);
    if (operation === "−") return subtraction(30, random() < 0.8 ? 10 : 1, random);
    if (operation === "×") return multiplication(9, 81, 6, random);
    return division(9, 81, 6, random);
  }

  if (operation === "+") return addition(100, random() < 0.8 ? 25 : 1, random);
  if (operation === "−") return subtraction(100, random() < 0.8 ? 25 : 1, random);
  if (operation === "×") return multiplication(12, 100, 6, random);
  return division(12, 100, 6, random);
}

function sameQuestion(left, right) {
  return left && right && left.a === right.a && left.b === right.b && left.op === right.op;
}

function operationPlan(difficulty, roundNumber) {
  if (difficulty !== "easy") return OPERATION_PLANS[difficulty] ?? OPERATION_PLANS.medium;
  // Ten questions cannot split exactly into four equal groups. Rotate the two
  // extra slots so every operation is equally represented over four rounds.
  const offset = Math.max(0, roundNumber - 1) % OPERATIONS.length;
  return [...OPERATIONS, ...OPERATIONS, OPERATIONS[offset], OPERATIONS[(offset + 1) % OPERATIONS.length]];
}

export function generateRoundPlan(difficulty, random = Math.random, roundNumber = 1) {
  const operations = shuffle(operationPlan(difficulty, roundNumber), random);
  const questions = [];
  operations.forEach((operation) => {
    let question = generateQuestion(difficulty, operation, random);
    let attempts = 0;
    while (sameQuestion(question, questions.at(-1)) && attempts < 20) {
      question = generateQuestion(difficulty, operation, random);
      attempts += 1;
    }
    questions.push(question);
  });
  return questions;
}

export function getDifficultyScoreMultiplier(difficulty) {
  if (difficulty === "medium") return 1.1;
  if (difficulty === "hard") return 1.2;
  return 1;
}

export function getAnswerScore(difficulty, streak) {
  const base = getDifficultyScoreMultiplier(difficulty);
  return streak > 0 && streak % STREAK_BONUS_AT === 0 ? base * 2 : base;
}
