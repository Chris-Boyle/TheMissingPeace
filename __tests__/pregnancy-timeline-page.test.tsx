import { render, screen } from "@testing-library/react";
import PregnancyTimelinePage from "../src/app/pregnancy-timeline/page";

describe("Pregnancy timeline page", () => {
  it("renders the standalone timeline tool and next-step CTAs", () => {
    render(<PregnancyTimelinePage />);

    expect(
      screen.getByRole("heading", {
        name: /see what is coming next in pregnancy with a calmer sense of timing/i,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /build my timeline/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /build your birth plan/i })
    ).toBeInTheDocument();
  });
});
