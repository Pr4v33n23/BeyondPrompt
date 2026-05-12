import { NextResponse } from "next/server";
import { quizAttemptSchema } from "@/lib/api/contracts";
import { apiErrors } from "@/lib/api/errors";
import { fail, ok } from "@/lib/api/response";
import { getLessonBySlug } from "@/server/data/mock-catalog";

export async function POST(request: Request) {
  const payload = await request.json();
  const parsed = quizAttemptSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(fail(apiErrors.validation(parsed.error.flatten())), { status: 400 });
  }

  const lessonRecord = getLessonBySlug("prompt-engineering-basics", "what-makes-a-good-prompt");
  const questions = lessonRecord?.lesson.quiz ?? [];
  const answerLookup = new Map(parsed.data.answers.map((a) => [a.questionId, a.optionId]));

  const score = questions.reduce((acc, question) => {
    const chosenOptionId = answerLookup.get(question.id);
    const correct = question.options.find((option) => option.isCorrect)?.id;
    return acc + (chosenOptionId === correct ? 1 : 0);
  }, 0);

  return NextResponse.json(
    ok({
      lessonId: parsed.data.lessonId,
      score,
      total: questions.length,
      submittedAt: new Date().toISOString(),
    }),
  );
}
