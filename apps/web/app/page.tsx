import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-6 py-10">
      <section className="space-y-4">
        <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">BeyondPrompt MVP</p>
        <h1 className="text-4xl font-semibold tracking-tight">Production-grade learning platform scaffold</h1>
        <p className="max-w-2xl text-zinc-600 dark:text-zinc-400">
          The foundation is ready for authentication, learner journeys, quiz engine, and admin content operations.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Button asChild>
            <Link href="/dashboard">
              Open learner dashboard
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/courses">Browse courses</Link>
          </Button>
        </div>
      </section>
      <section className="grid gap-4 md:grid-cols-3">
        {["Authentication", "Course Delivery", "Assessment and Progress"].map((title) => (
          <Card key={title}>
            <CardHeader>
              <CardTitle>{title}</CardTitle>
              <CardDescription>Planned and scaffolded as independent feature boundaries.</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-zinc-600 dark:text-zinc-400">
              Modular architecture keeps the MVP maintainable and allows extraction into services as scale grows.
            </CardContent>
          </Card>
        ))}
      </section>
    </main>
  );
}
