import { createServerSupabaseClient } from "@/lib/auth/server";
import type { Module } from "@/lib/db/types";

export async function adminCreateModule(
  input: Pick<Module, "course_id" | "slug" | "title" | "position">,
): Promise<Module> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("modules")
    .insert({ ...input, status: "draft" })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as Module;
}

export async function adminUpdateModule(
  id: string,
  input: Partial<Pick<Module, "title" | "status" | "position">>,
): Promise<Module> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("modules")
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as Module;
}

export async function adminDeleteModule(id: string): Promise<void> {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("modules").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
