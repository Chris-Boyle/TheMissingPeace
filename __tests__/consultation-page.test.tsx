import { render, screen } from "@testing-library/react";
import ConsultationPage from "../src/app/consultation/page";

describe("Consultation page", () => {
  it("renders the booking intro and form sections", () => {
    render(<ConsultationPage />);

    expect(
      screen.getByRole("heading", {
        name: /reserve a thoughtful conversation without leaving the site/i,
      })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/select a date/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /confirm consultation/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/what this consultation is for/i)
    ).toBeInTheDocument();
  });
});
