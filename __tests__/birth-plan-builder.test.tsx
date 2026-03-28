import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BirthPlanBuilderPage from "../src/app/birth-plan-builder/page";

describe("Birth Plan Builder page", () => {
  it("runs the full live builder flow and renders a final summary", async () => {
    const user = userEvent.setup();

    render(<BirthPlanBuilderPage />);

    expect(
      screen.getByRole("heading", { name: /build your birth plan/i })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: /about you/i })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/coming next|future multi-step|placeholder/i)
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /get started/i }));

    expect(screen.getByText(/step 1 of 4/i)).toBeInTheDocument();

    await user.type(screen.getByLabelText(/full name/i), "Jane Doe");
    await user.type(screen.getByLabelText(/^email$/i), "jane@example.com");
    await user.type(screen.getByLabelText(/due date/i), "2026-07-01");
    await user.selectOptions(
      screen.getByLabelText(/planned birth location/i),
      "Birth Center"
    );
    await user.type(
      screen.getByLabelText(/partner \/ support person name/i),
      "Alex"
    );

    await user.click(screen.getByRole("button", { name: /^continue$/i }));

    expect(
      screen.getByRole("heading", { name: /birth preferences/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/step 2 of 4/i)).toBeInTheDocument();

    await user.click(screen.getByLabelText(/quiet room/i));
    await user.type(
      screen.getByLabelText(/who would you like present or nearby/i),
      "Alex, Jordan, and my doula"
    );
    await user.click(screen.getByLabelText(/massage or counterpressure/i));

    await user.click(screen.getByRole("button", { name: /^continue$/i }));

    expect(
      screen.getByRole("heading", {
        name: /interventions & medical preferences/i,
      })
    ).toBeInTheDocument();
    expect(screen.getByText(/step 3 of 4/i)).toBeInTheDocument();

    await user.click(
      screen.getByLabelText(
        /i want to learn about all available pain relief options/i
      )
    );
    await user.click(
      screen.getByLabelText(
        /please explain options and give me time to decide if possible/i
      )
    );
    await user.type(
      screen.getByLabelText(/additional notes/i),
      "Please explain options slowly if plans need to change."
    );

    await user.click(
      screen.getByRole("button", { name: /review my summary/i })
    );

    expect(
      screen.getByRole("heading", { name: /review your birth plan/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/step 4 of 4/i)).toBeInTheDocument();
    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    expect(screen.getByText("Birth Center")).toBeInTheDocument();
    expect(
      screen.getByText("Alex, Jordan, and my doula")
    ).toBeInTheDocument();
    expect(
      screen.getByText(/all available pain relief options/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /book a consultation/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /ask a question/i })
    ).toBeInTheDocument();
  });

  it("preserves answers when moving back from the final summary", async () => {
    const user = userEvent.setup();

    render(<BirthPlanBuilderPage />);

    await user.click(screen.getByRole("button", { name: /get started/i }));
    await user.type(screen.getByLabelText(/full name/i), "Jamie Rivera");
    await user.type(screen.getByLabelText(/^email$/i), "jamie@example.com");
    await user.type(screen.getByLabelText(/due date/i), "2026-09-10");
    await user.click(screen.getByRole("button", { name: /^continue$/i }));

    await user.click(screen.getByLabelText(/dim lighting/i));
    await user.click(screen.getByRole("button", { name: /^continue$/i }));

    await user.click(
      screen.getByLabelText(/i am open to an epidural/i)
    );
    await user.click(
      screen.getByLabelText(/a mix of explanation and guidance feels best/i)
    );
    await user.click(
      screen.getByRole("button", { name: /review my summary/i })
    );

    await user.click(screen.getByRole("button", { name: /edit answers/i }));

    expect(
      screen.getByRole("heading", {
        name: /interventions & medical preferences/i,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(/i am open to an epidural/i)
    ).toBeChecked();
    expect(
      screen.getByLabelText(/a mix of explanation and guidance feels best/i)
    ).toBeChecked();

    await user.click(screen.getByRole("button", { name: /back/i }));

    expect(
      screen.getByRole("heading", { name: /birth preferences/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/dim lighting/i)).toBeChecked();
  });
});
