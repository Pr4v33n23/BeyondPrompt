import Link from "next/link";
import { notFound } from "next/navigation";
import { getCourseBySlug } from "@/server/data/mock-catalog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CoursePageProps {
  params: Promise<{ slug: string }>;
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { slug } = await params;
  const course = getCourseBySlug(slug);
  if (!course) {
    notFound();
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-6 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">{course.title}</h1>
      <p className="max-w-2xl text-zinc-600 dark:text-zinc-400">{course.description}</p>
      <section className="space-y-4">
        {course.modules.map((moduleItem) => (
          <Card key={moduleItem.id}>
            <CardHeader>
              <CardTitle>{moduleItem.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {moduleItem.lessons.map((lesson) => (
                <Link
                  key={lesson.id}
                  href={`/courses/${course.slug}/lesson/${lesson.slug}`}
                  className="block rounded-md border border-zinc-200 px-3 py-2 text-sm hover:bg-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-900"
                >
                  {lesson.title}
                </Link>
              ))}
            </CardContent>
          </Card>
        ))}
      </section>
    </main>
  );
}
