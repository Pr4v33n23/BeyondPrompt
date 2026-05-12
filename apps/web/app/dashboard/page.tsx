import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressHeader } from "@/features/progress/components/progress-header";
import { requireUser } from "@/lib/auth/server";
import { getUserProgressStats } from "@/server/repositories/progress";
import { listPublishedCourses } from "@/server/repositories/courses";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default async function DashboardPage() {
  const user = await requireUser();
  const [stats, courses] = await Promise.all([
    getUserProgressStats(user.id),
    listPublishedCourses(),
  ]);

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-6 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Learner Dashboard</h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">Signed in as {user.email}</p>

      <ProgressHeader xp={stats.xp} streakDays={stats.streakDays} />

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader><CardTitle>Total XP</CardTitle></CardHeader>
          <CardContent className="text-3xl font-bold">{stats.xp}</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Courses In Progress</CardTitle></CardHeader>
          <CardContent className="text-3xl font-bold">{stats.coursesInProgress}</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Lessons Completed</CardTitle></CardHeader>
          <CardContent className="text-3xl font-bold">{stats.lessonsCompleted}</CardContent>
        </Card>
      </div>

      {courses.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Available Courses</h2>
          <div className="flex flex-wrap gap-3">
            {courses.slice(0, 3).map((course) => (
              <Button key={course.id} variant="outline" asChild>
                <Link href={`/courses/${course.slug}`}>
                  {course.title}
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
