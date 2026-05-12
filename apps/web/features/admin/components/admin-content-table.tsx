import type { Course } from "@/lib/db/types";

interface AdminContentTableProps {
  courses: Course[];
}

export function AdminContentTable({ courses }: AdminContentTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
      <table className="w-full text-left text-sm">
        <thead className="bg-zinc-100 dark:bg-zinc-900">
          <tr>
            <th className="px-4 py-3 font-semibold">Title</th>
            <th className="px-4 py-3 font-semibold">Slug</th>
            <th className="px-4 py-3 font-semibold">Status</th>
            <th className="px-4 py-3 font-semibold">Est. Minutes</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course.id} className="border-t border-zinc-200 dark:border-zinc-800">
              <td className="px-4 py-3">{course.title}</td>
              <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">{course.slug}</td>
              <td className="px-4 py-3">
                <span
                  className={
                    course.status === "published"
                      ? "inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "inline-flex items-center rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                  }
                >
                  {course.status}
                </span>
              </td>
              <td className="px-4 py-3">{course.estimated_minutes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
