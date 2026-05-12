import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressHeader } from "@/features/progress/components/progress-header";
import { requireUser } from "@/lib/auth/server";

export default async function DashboardPage() {
  const user = await requireUser();

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-6 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Learner Dashboard</h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">Signed in as {user.email}</p>
      <ProgressHeader xp={120} streakDays={3} />
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Current XP</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">0</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Courses In Progress</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">0</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Lessons Completed</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">0</CardContent>
        </Card>
      </div>
    </main>
  );
}
