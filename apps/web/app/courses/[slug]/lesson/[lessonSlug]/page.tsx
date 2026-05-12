import { notFound } from "next/navigation";
import { LessonContent } from "@/features/lessons/components/lesson-content";
import { LessonSidebar } from "@/features/lessons/components/lesson-sidebar";
import { QuizPanel } from "@/features/quizzes/components/quiz-panel";
import { getLessonBySlug } from "@/server/data/mock-catalog";

interface LessonPageProps {
  params: Promise<{ slug: string; lessonSlug: string }>;
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { slug, lessonSlug } = await params;
  const result = getLessonBySlug(slug, lessonSlug);
  if (!result) {
    notFound();
  }

  return (
    <main className="mx-auto grid w-full max-w-6xl flex-1 gap-6 px-6 py-10 lg:grid-cols-[280px_1fr]">
      <LessonSidebar course={result.course} activeLessonSlug={result.lesson.slug} />
      <div className="space-y-6">
        <LessonContent title={result.lesson.title} contentMarkdown={result.lesson.contentMarkdown} />
        <QuizPanel questions={result.lesson.quiz} />
      </div>
    </main>
  );
}
