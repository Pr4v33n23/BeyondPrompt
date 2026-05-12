import { Trophy, Flame } from "lucide-react";

interface ProgressHeaderProps {
  xp: number;
  streakDays: number;
}

export function ProgressHeader({ xp, streakDays }: ProgressHeaderProps) {
  return (
    <section className="grid gap-3 md:grid-cols-2">
      <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
        <p className="text-xs uppercase tracking-wide text-zinc-500">XP Total</p>
        <p className="mt-2 inline-flex items-center gap-2 text-2xl font-bold">
          <Trophy className="h-5 w-5" aria-hidden="true" />
          {xp}
        </p>
      </div>
      <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
        <p className="text-xs uppercase tracking-wide text-zinc-500">Current streak</p>
        <p className="mt-2 inline-flex items-center gap-2 text-2xl font-bold">
          <Flame className="h-5 w-5" aria-hidden="true" />
          {streakDays} days
        </p>
      </div>
    </section>
  );
}
