import Link from "next/link";
import { cn } from "@/lib/utils";
import type { CourseNode } from "@/server/data/mock-catalog";

interface LessonSidebarProps {
  course: CourseNode;
  activeLessonSlug: string;
}

export function LessonSidebar({ course, activeLessonSlug }: LessonSidebarProps) {
  return (
    <aside className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">Course outline</p>
      <div className="space-y-4">
        {course.modules.map((moduleItem) => (
          <div key={moduleItem.id} className="space-y-2">
            <h3 className="text-sm font-semibold">{moduleItem.title}</h3>
            <ul className="space-y-1">
              {moduleItem.lessons.map((lesson) => (
                <li key={lesson.id}>
                  <Link
                    href={`/courses/${course.slug}/lesson/${lesson.slug}`}
                    className={cn(
                      "block rounded-md px-2 py-1 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-900",
                      lesson.slug === activeLessonSlug && "bg-zinc-100 font-medium dark:bg-zinc-900",
                    )}
                  >
                    {lesson.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </aside>
  );
}
