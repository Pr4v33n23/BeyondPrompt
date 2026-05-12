import { describe, it, expect } from "vitest";
import { scoreQuizAttempt } from "@/server/services/quiz-scoring";

const questions = [
  {
    id: "q-1",
    options: [
      { id: "o-1", is_correct: true },
      { id: "o-2", is_correct: false },
    ],
  },
  {
    id: "q-2",
    options: [
      { id: "o-3", is_correct: false },
      { id: "o-4", is_correct: true },
    ],
  },
];

describe("scoreQuizAttempt", () => {
  it("returns score=2 when all answers correct", () => {
    const result = scoreQuizAttempt(questions, [
      { questionId: "q-1", optionId: "o-1" },
      { questionId: "q-2", optionId: "o-4" },
    ]);
    expect(result.score).toBe(2);
    expect(result.total).toBe(2);
    expect(result.results[0].isCorrect).toBe(true);
    expect(result.results[1].isCorrect).toBe(true);
  });

  it("returns score=0 when all answers wrong", () => {
    const result = scoreQuizAttempt(questions, [
      { questionId: "q-1", optionId: "o-2" },
      { questionId: "q-2", optionId: "o-3" },
    ]);
    expect(result.score).toBe(0);
    expect(result.total).toBe(2);
  });

  it("handles missing answer for a question (counts as wrong)", () => {
    const result = scoreQuizAttempt(questions, [{ questionId: "q-1", optionId: "o-1" }]);
    expect(result.score).toBe(1);
    expect(result.total).toBe(2);
    expect(result.results[1].isCorrect).toBe(false);
  });

  it("awards xpAwarded = score * 10", () => {
    const result = scoreQuizAttempt(questions, [
      { questionId: "q-1", optionId: "o-1" },
      { questionId: "q-2", optionId: "o-4" },
    ]);
    expect(result.xpAwarded).toBe(20);
  });

  it("handles empty questions list", () => {
    const result = scoreQuizAttempt([], []);
    expect(result.score).toBe(0);
    expect(result.total).toBe(0);
    expect(result.xpAwarded).toBe(0);
    expect(result.results).toHaveLength(0);
  });

  it("handles question with no correct option", () => {
    const result = scoreQuizAttempt(
      [{ id: "q-1", options: [{ id: "o-1", is_correct: false }] }],
      [{ questionId: "q-1", optionId: "o-1" }],
    );
    expect(result.score).toBe(0);
    expect(result.results[0].isCorrect).toBe(false);
  });
});
