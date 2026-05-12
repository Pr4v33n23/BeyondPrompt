import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CourseCard } from "@/features/courses/components/course-card";

const mockCourse = {
  id: "course-1",
  slug: "intro-to-ai",
  title: "Introduction to AI",
  description: "Learn the fundamentals of artificial intelligence.",
  moduleCount: 4,
  lessonCount: 12,
};

describe("CourseCard", () => {
  it("renders course title", () => {
    const { getByText } = render(<CourseCard course={mockCourse} />);
    expect(getByText("Introduction to AI")).toBeInTheDocument();
  });

  it("renders course description", () => {
    const { getByText } = render(<CourseCard course={mockCourse} />);
    expect(
      getByText("Learn the fundamentals of artificial intelligence."),
    ).toBeInTheDocument();
  });

  it("has a link to the course detail page", () => {
    const { getByRole } = render(<CourseCard course={mockCourse} />);
    const link = getByRole("link");
    expect(link).toHaveAttribute("href", "/courses/intro-to-ai");
  });
});
