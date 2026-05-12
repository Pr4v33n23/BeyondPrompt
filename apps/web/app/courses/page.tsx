import { CourseCard } from "@/features/courses/components/course-card";
import { listPublishedCourses } from "@/server/repositories/courses";

export default async function CoursesPage() {
  const courses = await listPublishedCourses();

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-6 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Course Catalog</h1>
      {courses.length === 0 ? (
        <p className="text-zinc-500">No courses available yet.</p>
      ) : (
        <section className="grid gap-4 md:grid-cols-2">
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              course={{
                id: course.id,
                slug: course.slug,
                title: course.title,
                description: course.description ?? "",
                moduleCount: 0,
                lessonCount: 0,
              }}
            />
          ))}
        </section>
      )}
    </main>
  );
}
