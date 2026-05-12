export interface CourseSummary {
  id: string;
  slug: string;
  title: string;
  description: string;
  moduleCount: number;
  lessonCount: number;
}

export interface LessonNode {
  id: string;
  slug: string;
  title: string;
  contentMarkdown: string;
  quiz: {
    id: string;
    prompt: string;
    explanation: string;
    options: { id: string; content: string; isCorrect: boolean }[];
  }[];
}

export interface ModuleNode {
  id: string;
  title: string;
  lessons: LessonNode[];
}

export interface CourseNode {
  id: string;
  slug: string;
  title: string;
  description: string;
  modules: ModuleNode[];
}

export const courseGraph: CourseNode[] = [
  {
    id: "course-1",
    slug: "prompt-engineering-basics",
    title: "Prompt Engineering Basics",
    description: "Learn repeatable prompt patterns that produce stable outputs.",
    modules: [
      {
        id: "module-1",
        title: "Foundations",
        lessons: [
          {
            id: "lesson-1",
            slug: "what-makes-a-good-prompt",
            title: "What Makes a Good Prompt",
            contentMarkdown:
              "# What Makes a Good Prompt\n\nGreat prompts include context, constraints, and output format.",
            quiz: [
              {
                id: "q-1",
                prompt: "Which characteristic improves output reliability?",
                explanation: "Constraints make model behavior more deterministic.",
                options: [
                  { id: "o-1", content: "Add clear constraints", isCorrect: true },
                  { id: "o-2", content: "Use only vague instructions", isCorrect: false },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];

export function listCourses(): CourseSummary[] {
  return courseGraph.map((course) => ({
    id: course.id,
    slug: course.slug,
    title: course.title,
    description: course.description,
    moduleCount: course.modules.length,
    lessonCount: course.modules.reduce((acc, moduleItem) => acc + moduleItem.lessons.length, 0),
  }));
}

export function getCourseBySlug(slug: string) {
  return courseGraph.find((course) => course.slug === slug) ?? null;
}

export function getLessonBySlug(courseSlug: string, lessonSlug: string) {
  const course = getCourseBySlug(courseSlug);
  if (!course) {
    return null;
  }
  for (const moduleItem of course.modules) {
    const lesson = moduleItem.lessons.find((entry) => entry.slug === lessonSlug);
    if (lesson) {
      return { course, module: moduleItem, lesson };
    }
  }
  return null;
}
