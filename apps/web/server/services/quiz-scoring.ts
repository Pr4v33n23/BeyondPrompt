interface QuestionWithOptions {
  id: string;
  options: { id: string; is_correct: boolean }[];
}

interface SubmittedAnswer {
  questionId: string;
  optionId: string;
}

export interface QuizResult {
  questionId: string;
  selectedOptionId: string | null;
  correctOptionId: string | null;
  isCorrect: boolean;
}

export interface ScoredAttempt {
  score: number;
  total: number;
  xpAwarded: number;
  results: QuizResult[];
}

export function scoreQuizAttempt(
  questions: QuestionWithOptions[],
  answers: SubmittedAnswer[],
): ScoredAttempt {
  const answerMap = new Map(answers.map((a) => [a.questionId, a.optionId]));

  const results: QuizResult[] = questions.map((q) => {
    const correctOption = q.options.find((o) => o.is_correct);
    const selectedOptionId = answerMap.get(q.id) ?? null;
    const isCorrect = selectedOptionId !== null && selectedOptionId === correctOption?.id;
    return {
      questionId: q.id,
      selectedOptionId,
      correctOptionId: correctOption?.id ?? null,
      isCorrect,
    };
  });

  const score = results.filter((r) => r.isCorrect).length;
  return { score, total: questions.length, xpAwarded: score * 10, results };
}
