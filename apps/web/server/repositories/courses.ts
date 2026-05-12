import { createServerSupabaseClient } from "@/lib/auth/server";
import type { Course, Module, Lesson } from "@/lib/db/types";

export interface CourseWithModules extends Course {
  modules: Array<
    Module & {
      lessons: Array<Pick<Lesson, "id" | "slug" | "title" | "estimated_minutes" | "position" | "status">>;
    }
  >;
}

export async function listPublishedCourses(): Promise<Course[]> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("courses")
    .select("id, slug, title, description, cover_url, estimated_minutes, status, created_at, updated_at")
    .eq("status", "published")
    .order("created_at", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as Course[];
}

export async function getCourseWithModules(slug: string): Promise<CourseWithModules | null> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("courses")
    .select(
      `id, slug, title, description, cover_url, estimated_minutes, status, created_at, updated_at,
       modules (
         id, course_id, slug, title, description, position, status, created_at, updated_at,
         lessons (
           id, module_id, slug, title, description, estimated_minutes, position, status
         )
       )`,
    )
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error || !data) return null;

  const course = data as unknown as CourseWithModules;
  course.modules = course.modules
    .filter((m) => m.status === "published")
    .sort((a, b) => a.position - b.position)
    .map((m) => ({
      ...m,
      lessons: m.lessons
        .filter((l) => l.status === "published")
        .sort((a, b) => a.position - b.position),
    }));

  return course;
}

export async function adminListCourses(): Promise<Course[]> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("courses")
    .select("id, slug, title, description, status, estimated_minutes, created_at, updated_at")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as Course[];
}

export async function adminCreateCourse(
  input: Pick<Course, "slug" | "title" | "description">,
): Promise<Course> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("courses")
    .insert({ ...input, status: "draft" })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as Course;
}

export async function adminUpdateCourse(
  id: string,
  input: Partial<Pick<Course, "title" | "description" | "status" | "estimated_minutes">>,
): Promise<Course> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("courses")
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as Course;
}

export async function adminDeleteCourse(id: string): Promise<void> {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("courses").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
