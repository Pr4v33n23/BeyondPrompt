export type AppRole = "learner" | "admin";
export type ContentStatus = "draft" | "published";
export type LessonProgressStatus = "not_started" | "in_progress" | "completed";

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  role: AppRole;
  created_at: string;
  updated_at: string;
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  cover_url: string | null;
  estimated_minutes: number;
  status: ContentStatus;
  created_at: string;
  updated_at: string;
}

export interface Module {
  id: string;
  course_id: string;
  slug: string;
  title: string;
  description: string | null;
  position: number;
  status: ContentStatus;
  created_at: string;
  updated_at: string;
}

export interface Lesson {
  id: string;
  module_id: string;
  slug: string;
  title: string;
  description: string | null;
  content_markdown: string | null;
  estimated_minutes: number;
  position: number;
  status: ContentStatus;
  created_at: string;
  updated_at: string;
}

export interface QuizQuestion {
  id: string;
  lesson_id: string;
  prompt: string;
  explanation: string | null;
  position: number;
  allows_multiple: boolean;
  created_at: string;
  updated_at: string;
}

export interface QuizOption {
  id: string;
  question_id: string;
  content: string;
  is_correct: boolean;
  position: number;
  created_at: string;
}

export interface LessonProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  status: LessonProgressStatus;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface QuizAttempt {
  id: string;
  user_id: string;
  lesson_id: string;
  score: number;
  total: number;
  submitted_at: string;
}

export interface QuizAttemptAnswer {
  id: string;
  attempt_id: string;
  question_id: string;
  selected_option_id: string | null;
  is_correct: boolean;
  created_at: string;
}

export interface XpEvent {
  id: string;
  user_id: string;
  lesson_id: string | null;
  points: number;
  reason: string;
  created_at: string;
}
