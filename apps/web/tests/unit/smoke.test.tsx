import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "@/app/page";

describe("home page", () => {
  it("renders scaffold heading", () => {
    render(<Home />);
    expect(
      screen.getByRole("heading", {
        name: /Production-grade learning platform scaffold/i,
      }),
    ).toBeInTheDocument();
  });
});
