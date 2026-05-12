import { createServerSupabaseClient } from "@/lib/auth/server";
import type { LessonProgress, LessonProgressStatus } from "@/lib/db/types";

export interface UserProgressStats {
  xp: number;
  streakDays: number;
  coursesInProgress: number;
  lessonsCompleted: number;
}

export async function upsertLessonProgress(
  userId: string,
  lessonId: string,
  status: LessonProgressStatus,
): Promise<void> {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("lesson_progress").upsert(
    {
      user_id: userId,
      lesson_id: lessonId,
      status,
      completed_at: status === "completed" ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,lesson_id" },
  );
  if (error) throw new Error(error.message);
}

export async function addXpEvent(
  userId: string,
  points: number,
  reason: string,
  lessonId?: string,
): Promise<void> {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase
    .from("xp_events")
    .insert({ user_id: userId, points, reason, lesson_id: lessonId ?? null });
  if (error) throw new Error(error.message);
}

export async function getUserProgressStats(userId: string): Promise<UserProgressStats> {
  const supabase = await createServerSupabaseClient();

  const [xpResult, progressResult] = await Promise.all([
    supabase.from("xp_events").select("points").eq("user_id", userId),
    supabase.from("lesson_progress").select("status").eq("user_id", userId),
  ]);

  const xp = ((xpResult.data ?? []) as { points: number }[]).reduce(
    (sum, row) => sum + row.points,
    0,
  );
  const rows = (progressResult.data ?? []) as { status: string }[];
  const lessonsCompleted = rows.filter((r) => r.status === "completed").length;
  const coursesInProgress = rows.filter((r) => r.status === "in_progress").length;

  return { xp, streakDays: 0, coursesInProgress, lessonsCompleted };
}

export async function getLessonProgress(
  userId: string,
  lessonId: string,
): Promise<LessonProgress | null> {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("lesson_progress")
    .select("*")
    .eq("user_id", userId)
    .eq("lesson_id", lessonId)
    .single();
  return (data as LessonProgress) ?? null;
}
