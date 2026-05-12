import { requireUser } from "@/lib/auth/server";
import { AdminContentTable } from "@/features/admin/components/admin-content-table";
import { ContentEditorForm } from "@/features/admin/components/content-editor-form";
import { listCourses } from "@/server/data/mock-catalog";

export default async function AdminPage() {
  const user = await requireUser();
  const courses = listCourses();

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-6 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Admin Content Console</h1>
      <p className="text-zinc-600 dark:text-zinc-400">
        Authenticated as {user.email}. Role-based enforcement will be enabled after database/RLS setup.
      </p>
      <ContentEditorForm />
      <AdminContentTable courses={courses} />
    </main>
  );
}
