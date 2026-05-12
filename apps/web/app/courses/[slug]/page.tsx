import { notFound } from "next/navigation";
import Link from "next/link";
import { getCourseWithModules } from "@/server/repositories/courses";
import { requireUser } from "@/lib/auth/server";
import { ChevronRight, BookOpen, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function CourseDetailPage({ params }: Props) {
  const { slug } = await params;
  await requireUser();
  const course = await getCourseWithModules(slug);
  if (!course) notFound();

  const firstLesson = course.modules[0]?.lessons[0];

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-6 py-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">{course.title}</h1>
        {course.description && (
          <p className="max-w-2xl text-zinc-600 dark:text-zinc-400">{course.description}</p>
        )}
        <div className="flex items-center gap-4 text-sm text-zinc-500">
          <span className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" aria-hidden="true" />
            {course.modules.length} modules
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" aria-hidden="true" />
            {course.estimated_minutes} min
          </span>
        </div>
      </div>

      {firstLesson && (
        <Button asChild>
          <Link href={`/courses/${slug}/lesson/${firstLesson.slug}`}>
            Start course
            <ChevronRight className="ml-2 h-4 w-4" aria-hidden="true" />
          </Link>
        </Button>
      )}

      <section className="space-y-4">
        {course.modules.map((mod) => (
          <Card key={mod.id}>
            <CardHeader>
              <CardTitle className="text-lg">{mod.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 p-2">
              {mod.lessons.map((lesson) => (
                <Link
                  key={lesson.id}
                  href={`/courses/${slug}/lesson/${lesson.slug}`}
                  className="flex items-center justify-between rounded-md px-3 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  <span>{lesson.title}</span>
                  <span className="text-zinc-500">{lesson.estimated_minutes} min</span>
                </Link>
              ))}
              {mod.lessons.length === 0 && (
                <p className="px-3 py-2 text-sm text-zinc-400">No lessons available.</p>
              )}
            </CardContent>
          </Card>
        ))}
      </section>
    </main>
  );
}
