import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth/server";
import { getCourseWithModules } from "@/server/repositories/courses";
import { getLessonWithQuiz } from "@/server/repositories/lessons";
import { getLessonProgress } from "@/server/repositories/progress";
import { LessonContent } from "@/features/lessons/components/lesson-content";
import { LessonSidebar } from "@/features/lessons/components/lesson-sidebar";
import { QuizPanel } from "@/features/quizzes/components/quiz-panel";
import { LessonCompleteButton } from "@/features/lessons/components/lesson-complete-button";

interface Props {
  params: Promise<{ slug: string; lessonSlug: string }>;
}

export default async function LessonPage({ params }: Props) {
  const { slug, lessonSlug } = await params;
  const user = await requireUser();

  const course = await getCourseWithModules(slug);
  if (!course) notFound();

  let lessonMeta: {
    lesson: (typeof course.modules)[0]["lessons"][0];
    module: (typeof course.modules)[0];
  } | null = null;

  for (const mod of course.modules) {
    const found = mod.lessons.find((l) => l.slug === lessonSlug);
    if (found) {
      lessonMeta = { lesson: found, module: mod };
      break;
    }
  }
  if (!lessonMeta) notFound();

  const [lessonWithQuiz, progress] = await Promise.all([
    getLessonWithQuiz(lessonMeta.lesson.id),
    getLessonProgress(user.id, lessonMeta.lesson.id),
  ]);
  if (!lessonWithQuiz) notFound();

  const isCompleted = progress?.status === "completed";

  const quizQuestions = lessonWithQuiz.quiz_questions.map((q) => ({
    id: q.id,
    prompt: q.prompt,
    explanation: q.explanation ?? "",
    options: q.quiz_options.map((o) => ({
      id: o.id,
      content: o.content,
      isCorrect: o.is_correct,
    })),
  }));

  const sidebarModules = course.modules.map((mod) => ({
    id: mod.id,
    title: mod.title,
    lessons: mod.lessons.map((l) => ({ id: l.id, slug: l.slug, title: l.title })),
  }));

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 gap-8 px-6 py-10">
      <aside className="hidden w-64 shrink-0 lg:block" aria-label="Course navigation">
        <LessonSidebar
          courseSlug={slug}
          currentLessonId={lessonMeta.lesson.id}
          modules={sidebarModules}
        />
      </aside>

      <article className="min-w-0 flex-1 space-y-8">
        <header className="space-y-1">
          <p className="text-sm text-zinc-500">{lessonMeta.module.title}</p>
          {isCompleted && (
            <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
              Completed
            </span>
          )}
        </header>

        <LessonContent
          title={lessonWithQuiz.title}
          contentMarkdown={lessonWithQuiz.content_markdown ?? ""}
        />

        {quizQuestions.length > 0 && (
          <section aria-label="Knowledge check">
            <h2 className="mb-4 text-xl font-semibold">Knowledge Check</h2>
            <QuizPanel lessonId={lessonMeta.lesson.id} questions={quizQuestions} />
          </section>
        )}

        {!isCompleted && quizQuestions.length === 0 && (
          <LessonCompleteButton lessonId={lessonMeta.lesson.id} />
        )}
      </article>
    </div>
  );
}
