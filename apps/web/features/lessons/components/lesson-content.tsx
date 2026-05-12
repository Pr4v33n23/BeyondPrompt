import Markdown from "markdown-to-jsx";

interface LessonContentProps {
  title: string;
  contentMarkdown: string;
}

export function LessonContent({ title, contentMarkdown }: LessonContentProps) {
  return (
    <article className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
      <h1 className="mb-4 text-2xl font-semibold tracking-tight">{title}</h1>
      <div className="prose prose-zinc max-w-none dark:prose-invert">
        <Markdown>{contentMarkdown}</Markdown>
      </div>
    </article>
  );
}
