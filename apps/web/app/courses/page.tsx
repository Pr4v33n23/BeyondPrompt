import { CourseCard } from "@/features/courses/components/course-card";

const placeholderCourses = [
  {
    id: "1",
    slug: "prompt-engineering-basics",
    title: "Prompt Engineering Basics",
    description: "Learn repeatable prompting techniques with practical examples.",
    moduleCount: 4,
    lessonCount: 16,
  },
];

export default function CoursesPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-6 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Course Catalog</h1>
      <section className="grid gap-4 md:grid-cols-2">
        {placeholderCourses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </section>
    </main>
  );
}
