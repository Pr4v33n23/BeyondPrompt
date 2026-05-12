"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ContentEditorForm() {
  const [status, setStatus] = useState<string | null>(null);

  async function onSubmit(formData: FormData) {
    const payload = {
      title: String(formData.get("title") ?? ""),
      slug: String(formData.get("slug") ?? ""),
      description: String(formData.get("description") ?? ""),
    };
    const response = await fetch("/api/v1/admin/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setStatus(response.ok ? "Course created (demo response)." : "Failed to create course.");
  }

  return (
    <form action={onSubmit} className="space-y-4 rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
      <h2 className="text-lg font-semibold">Create course</h2>
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="slug">Slug</Label>
        <Input id="slug" name="slug" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input id="description" name="description" required />
      </div>
      <Button type="submit">Save draft</Button>
      {status ? <p className="text-sm text-zinc-600 dark:text-zinc-400">{status}</p> : null}
    </form>
  );
}
