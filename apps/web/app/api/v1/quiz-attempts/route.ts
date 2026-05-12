import { NextResponse } from "next/server";
import { quizAttemptSchema } from "@/lib/api/contracts";
import { apiErrors } from "@/lib/api/errors";
import { fail, ok } from "@/lib/api/response";
import { requireUser } from "@/lib/auth/server";
import { getLessonQuestionsWithOptions, saveQuizAttempt } from "@/server/repositories/quiz";
import { upsertLessonProgress, addXpEvent } from "@/server/repositories/progress";
import { scoreQuizAttempt } from "@/server/services/quiz-scoring";

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const payload = await request.json();
    const parsed = quizAttemptSchema.safeParse(payload);
    if (!parsed.success) {
      return NextResponse.json(fail(apiErrors.validation(parsed.error.flatten())), { status: 400 });
    }

    const rawQuestions = await getLessonQuestionsWithOptions(parsed.data.lessonId);
    const questions = rawQuestions.map((q) => ({
      id: q.id,
      options: q.quiz_options.map((o) => ({ id: o.id, is_correct: o.is_correct })),
    }));
    const scored = scoreQuizAttempt(questions, parsed.data.answers);
    const attempt = await saveQuizAttempt(user.id, parsed.data.lessonId, scored);

    if (scored.xpAwarded > 0) {
      await addXpEvent(user.id, scored.xpAwarded, "quiz_pass", parsed.data.lessonId);
    }
    if (scored.score === scored.total && scored.total > 0) {
      await upsertLessonProgress(user.id, parsed.data.lessonId, "completed");
    }

    return NextResponse.json(
      ok({
        attemptId: attempt.id,
        lessonId: parsed.data.lessonId,
        score: scored.score,
        total: scored.total,
        xpAwarded: scored.xpAwarded,
        results: scored.results.map((r) => ({
          questionId: r.questionId,
          isCorrect: r.isCorrect,
          correctOptionId: r.correctOptionId,
        })),
        submittedAt: attempt.submitted_at,
      }),
    );
  } catch (err) {
    if (err instanceof Error && err.message.startsWith("NEXT_REDIRECT")) throw err;
    return NextResponse.json(
      fail(apiErrors.internal(err instanceof Error ? err.message : "Unknown error")),
      { status: 500 },
    );
  }
}
