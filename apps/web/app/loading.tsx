export default function GlobalLoading() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-64 rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-24 w-full rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-24 w-full rounded bg-zinc-200 dark:bg-zinc-800" />
      </div>
    </main>
  );
}
