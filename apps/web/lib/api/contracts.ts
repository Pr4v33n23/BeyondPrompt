import { z } from "zod";

export const courseSchema = z.object({
  id: z.string().uuid().or(z.string()),
  slug: z.string(),
  title: z.string(),
  description: z.string().nullable().optional(),
});

export const lessonCompleteSchema = z.object({
  lessonId: z.string().uuid().or(z.string()),
});

export const quizAttemptSchema = z.object({
  lessonId: z.string().uuid().or(z.string()),
  answers: z.array(
    z.object({
      questionId: z.string().uuid().or(z.string()),
      optionId: z.string().uuid().or(z.string()),
    }),
  ),
});
