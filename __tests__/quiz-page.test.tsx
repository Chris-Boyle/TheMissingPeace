import { render, screen } from "@testing-library/react";
import QuizPage from "../src/app/quiz/page";

describe("Quiz page", () => {
  it("renders the standalone quiz experience and conversion CTA", () => {
    render(<QuizPage />);

    expect(
      screen.getByRole("heading", {
        name: /a gentle way to figure out what kind of support would help most/i,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /take the quiz/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /book a consultation/i })
    ).toBeInTheDocument();
  });
});
