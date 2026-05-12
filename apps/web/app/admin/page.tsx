import { requireAdmin } from "@/lib/auth/server";
import { AdminContentTable } from "@/features/admin/components/admin-content-table";
import { ContentEditorForm } from "@/features/admin/components/content-editor-form";
import { adminListCourses } from "@/server/repositories/courses";

export default async function AdminPage() {
  const user = await requireAdmin();
  const courses = await adminListCourses();

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-6 py-10">
      <div className="space-y-1">
        <h1 className="text-3xl font-semibold tracking-tight">Admin Content Console</h1>
        <p className="text-sm text-zinc-500">Signed in as {user.email}</p>
      </div>
      <ContentEditorForm />
      <AdminContentTable courses={courses} />
    </main>
  );
}
