import { createServerSupabaseClient } from "@/lib/auth/server";
import type { Lesson, QuizQuestion, QuizOption } from "@/lib/db/types";

export interface LessonWithQuiz extends Lesson {
  quiz_questions: Array<QuizQuestion & { quiz_options: QuizOption[] }>;
}

export async function getLessonWithQuiz(lessonId: string): Promise<LessonWithQuiz | null> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("lessons")
    .select(
      `id, module_id, slug, title, description, content_markdown, estimated_minutes, position, status, created_at, updated_at,
       quiz_questions (
         id, lesson_id, prompt, explanation, position, allows_multiple, created_at, updated_at,
         quiz_options (
           id, question_id, content, is_correct, position, created_at
         )
       )`,
    )
    .eq("id", lessonId)
    .eq("status", "published")
    .single();

  if (error || !data) return null;

  const lesson = data as unknown as LessonWithQuiz;
  lesson.quiz_questions = lesson.quiz_questions
    .sort((a, b) => a.position - b.position)
    .map((q) => ({
      ...q,
      quiz_options: q.quiz_options.sort((a, b) => a.position - b.position),
    }));

  return lesson;
}

export async function adminCreateLesson(
  input: Pick<Lesson, "module_id" | "slug" | "title" | "position"> & {
    content_markdown: string | null;
  },
): Promise<Lesson> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("lessons")
    .insert({ ...input, status: "draft" })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as Lesson;
}

export async function adminUpdateLesson(
  id: string,
  input: Partial<
    Pick<Lesson, "title" | "content_markdown" | "status" | "position" | "estimated_minutes">
  >,
): Promise<Lesson> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("lessons")
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as Lesson;
}

export async function adminDeleteLesson(id: string): Promise<void> {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("lessons").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
