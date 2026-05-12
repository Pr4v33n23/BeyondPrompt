import Link from "next/link";
import { BookOpen, Layers } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export interface CourseCardProps {
  course: {
    id: string;
    slug: string;
    title: string;
    description: string;
    moduleCount: number;
    lessonCount: number;
  };
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Link href={`/courses/${course.slug}`} className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900">
      <Card className="h-full transition-shadow hover:shadow-md">
        <CardHeader>
          <CardTitle>{course.title}</CardTitle>
          <CardDescription>{course.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-4 text-sm text-zinc-600 dark:text-zinc-400">
          <span className="inline-flex items-center gap-1">
            <Layers className="h-4 w-4" aria-hidden="true" />
            {course.moduleCount} modules
          </span>
          <span className="inline-flex items-center gap-1">
            <BookOpen className="h-4 w-4" aria-hidden="true" />
            {course.lessonCount} lessons
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}
