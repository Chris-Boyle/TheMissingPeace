import { render, screen } from "@testing-library/react";
import PregnancyTimelinePage from "../src/app/pregnancy-timeline/page";

describe("Pregnancy timeline page", () => {
  it("renders the standalone timeline tool and next-step CTAs", () => {
    render(<PregnancyTimelinePage />);

    expect(
      screen.getByRole("heading", {
        name: /your pregnancy timeline/i,
        level: 1,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /build my timeline/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: /what each stage of pregnancy often asks of you/i,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /build your birth plan/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /book a consultation/i })
    ).toBeInTheDocument();
  });
});
