import { createServerSupabaseClient } from "@/lib/auth/server";
import type { QuizAttempt, QuizAttemptAnswer, QuizQuestion, QuizOption } from "@/lib/db/types";
import type { ScoredAttempt } from "@/server/services/quiz-scoring";

export interface QuizQuestionWithOptions extends QuizQuestion {
  quiz_options: QuizOption[];
}

export async function getLessonQuestionsWithOptions(
  lessonId: string,
): Promise<QuizQuestionWithOptions[]> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("quiz_questions")
    .select(`*, quiz_options (*)`)
    .eq("lesson_id", lessonId)
    .order("position", { ascending: true });
  if (error) throw new Error(error.message);
  return ((data ?? []) as QuizQuestionWithOptions[]).map((q) => ({
    ...q,
    quiz_options: q.quiz_options.sort((a, b) => a.position - b.position),
  }));
}

export async function saveQuizAttempt(
  userId: string,
  lessonId: string,
  scored: ScoredAttempt,
): Promise<QuizAttempt> {
  const supabase = await createServerSupabaseClient();

  const { data: attempt, error: attemptError } = await supabase
    .from("quiz_attempts")
    .insert({ user_id: userId, lesson_id: lessonId, score: scored.score, total: scored.total })
    .select()
    .single();
  if (attemptError) throw new Error(attemptError.message);

  const answers: Omit<QuizAttemptAnswer, "id" | "created_at">[] = scored.results.map((r) => ({
    attempt_id: (attempt as QuizAttempt).id,
    question_id: r.questionId,
    selected_option_id: r.selectedOptionId,
    is_correct: r.isCorrect,
  }));

  const { error: answersError } = await supabase.from("quiz_attempt_answers").insert(answers);
  if (answersError) throw new Error(answersError.message);

  return attempt as QuizAttempt;
}

export async function adminCreateQuestion(
  input: Pick<QuizQuestion, "lesson_id" | "prompt" | "explanation" | "position" | "allows_multiple">,
): Promise<QuizQuestion> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from("quiz_questions").insert(input).select().single();
  if (error) throw new Error(error.message);
  return data as QuizQuestion;
}

export async function adminCreateOption(
  input: Pick<QuizOption, "question_id" | "content" | "is_correct" | "position">,
): Promise<QuizOption> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from("quiz_options").insert(input).select().single();
  if (error) throw new Error(error.message);
  return data as QuizOption;
}

export async function adminDeleteQuestion(id: string): Promise<void> {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("quiz_questions").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
