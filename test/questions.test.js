import test from "node:test";
import assert from "node:assert/strict";
import {
  TOTAL_QUESTIONS,
  generateQuestion,
  generateRoundPlan,
  getAnswerScore,
  getDifficultyScoreMultiplier,
} from "../questions.js";

function seededRandom(seed = 123456789) {
  let value = seed >>> 0;
  return () => {
    value = (1664525 * value + 1013904223) >>> 0;
    return value / 2 ** 32;
  };
}

const operations = ["+", "−", "×", "÷"];

test("all generated questions use positive values and valid answers", () => {
  for (const difficulty of ["easy", "medium", "hard"]) {
    for (const operation of operations) {
      const random = seededRandom();
      for (let index = 0; index < 500; index += 1) {
        const question = generateQuestion(difficulty, operation, random);
        assert.ok(question.a > 0);
        assert.ok(question.b > 0);
        assert.ok(question.answer > 0);
        if (operation === "÷") {
          assert.equal(question.a % question.b, 0);
          assert.equal(question.a / question.b, question.answer);
        }
      }
    }
  }
});

test("easy questions respect their limits", () => {
  const random = seededRandom(1);
  for (const operation of operations) {
    for (let index = 0; index < 500; index += 1) {
      const question = generateQuestion("easy", operation, random);
      if (operation === "+") assert.ok(question.answer <= 20);
      if (operation === "−") assert.ok(question.a <= 20);
      if (operation === "×") assert.ok(question.a <= 6 && question.b <= 6);
      if (operation === "÷") assert.ok(question.b <= 6 && question.answer <= 6);
    }
  }
});

test("medium and hard questions respect their caps", () => {
  const random = seededRandom(2);
  for (let index = 0; index < 1000; index += 1) {
    const mediumAdd = generateQuestion("medium", "+", random);
    const mediumSub = generateQuestion("medium", "−", random);
    assert.ok(mediumAdd.answer <= 30);
    assert.ok(mediumSub.a <= 30);

    const hardAdd = generateQuestion("hard", "+", random);
    const hardSub = generateQuestion("hard", "−", random);
    const hardMultiply = generateQuestion("hard", "×", random);
    const hardDivide = generateQuestion("hard", "÷", random);
    assert.ok(hardAdd.answer <= 100);
    assert.ok(hardSub.a <= 100);
    assert.ok(hardMultiply.answer <= 100);
    assert.ok(hardDivide.a <= 100);
  }
});

test("round plans contain ten controlled and non-repeating questions", () => {
  for (const difficulty of ["easy", "medium", "hard"]) {
    const plan = generateRoundPlan(difficulty, seededRandom(42));
    assert.equal(plan.length, TOTAL_QUESTIONS);
    for (let index = 1; index < plan.length; index += 1) {
      assert.notDeepEqual(
        [plan[index].a, plan[index].op, plan[index].b],
        [plan[index - 1].a, plan[index - 1].op, plan[index - 1].b],
      );
    }
    const counts = Object.fromEntries(operations.map((op) => [op, plan.filter((q) => q.op === op).length]));
    assert.equal(counts["×"] + counts["÷"] > counts["+"] + counts["−"], difficulty !== "easy");
    if (difficulty === "easy") {
      assert.ok(Math.max(...Object.values(counts)) - Math.min(...Object.values(counts)) <= 1);
    }
  }
});

test("easy operation extras rotate to an equal long-term mix", () => {
  const totals = Object.fromEntries(operations.map((operation) => [operation, 0]));
  for (let round = 1; round <= 4; round += 1) {
    generateRoundPlan("easy", seededRandom(round), round).forEach((question) => {
      totals[question.op] += 1;
    });
  }
  assert.deepEqual(totals, { "+": 10, "−": 10, "×": 10, "÷": 10 });
});

test("difficulty multipliers and streak bonuses are applied", () => {
  assert.equal(getDifficultyScoreMultiplier("easy"), 1);
  assert.equal(getDifficultyScoreMultiplier("medium"), 1.1);
  assert.equal(getDifficultyScoreMultiplier("hard"), 1.2);
  assert.equal(getAnswerScore("easy", 2), 1);
  assert.equal(getAnswerScore("easy", 3), 2);
  assert.equal(getAnswerScore("hard", 6), 2.4);
});
