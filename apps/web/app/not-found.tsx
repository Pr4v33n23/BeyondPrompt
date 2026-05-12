import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col items-start justify-center gap-4 px-6 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Page not found</h1>
      <p className="text-zinc-600 dark:text-zinc-400">
        The content may be unpublished or the URL might be incorrect.
      </p>
      <Button asChild>
        <Link href="/courses">Back to course catalog</Link>
      </Button>
    </main>
  );
}
