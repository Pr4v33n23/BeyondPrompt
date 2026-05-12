import type { CourseSummary } from "@/server/data/mock-catalog";

interface AdminContentTableProps {
  courses: CourseSummary[];
}

export function AdminContentTable({ courses }: AdminContentTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
      <table className="w-full text-left text-sm">
        <thead className="bg-zinc-100 dark:bg-zinc-900">
          <tr>
            <th className="px-4 py-3 font-semibold">Title</th>
            <th className="px-4 py-3 font-semibold">Slug</th>
            <th className="px-4 py-3 font-semibold">Modules</th>
            <th className="px-4 py-3 font-semibold">Lessons</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course.id} className="border-t border-zinc-200 dark:border-zinc-800">
              <td className="px-4 py-3">{course.title}</td>
              <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">{course.slug}</td>
              <td className="px-4 py-3">{course.moduleCount}</td>
              <td className="px-4 py-3">{course.lessonCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
