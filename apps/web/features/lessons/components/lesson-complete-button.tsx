"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

interface Props {
  lessonId: string;
}

export function LessonCompleteButton({ lessonId }: Props) {
  const [pending, setPending] = useState(false);
  const router = useRouter();

  async function handleComplete() {
    setPending(true);
    try {
      const res = await fetch("/api/v1/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId }),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success("Lesson completed! +5 XP");
      router.refresh();
    } catch {
      toast.error("Could not save progress. Try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <Button onClick={handleComplete} disabled={pending} className="gap-2">
      <CheckCircle className="h-4 w-4" aria-hidden="true" />
      {pending ? "Saving..." : "Mark as complete"}
    </Button>
  );
}
