import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BirthPlanBuilderPage from "../src/app/birth-plan-builder/page";

describe("Birth Plan Builder page", () => {
  it("reveals step 1, advances to step 2, and captures birth preferences", async () => {
    const user = userEvent.setup();
    const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    render(<BirthPlanBuilderPage />);

    expect(
      screen.getByRole("heading", { name: /build your birth plan/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /get started/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /learn how it works/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/receive a copy by email when you finish/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /a calm, guided process/i })
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("heading", { name: /about you/i })
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /get started/i }));

    expect(
      screen.getByRole("heading", { name: /about you/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/step 1 of 5/i)).toBeInTheDocument();

    const continueButton = screen.getByRole("button", { name: /continue/i });
    expect(continueButton).toBeDisabled();

    await user.type(screen.getByLabelText(/full name/i), "Jane Doe");
    await user.type(screen.getByLabelText(/^email$/i), "invalid-email");
    await user.tab();

    expect(
      screen.getByText(/please enter a valid email so we can send your birth plan/i)
    ).toBeInTheDocument();

    await user.clear(screen.getByLabelText(/^email$/i));
    await user.type(screen.getByLabelText(/^email$/i), "jane@example.com");
    await user.type(screen.getByLabelText(/due date/i), "2026-07-01");

    expect(continueButton).toBeEnabled();

    await user.selectOptions(
      screen.getByLabelText(/planned birth location/i),
      "Birth Center"
    );
    await user.type(
      screen.getByLabelText(/partner \/ support person name/i),
      "Alex"
    );
    await user.click(continueButton);

    expect(logSpy).toHaveBeenCalledWith("Birth Plan Builder Step 1", {
      step: 1,
      section: "About You",
      userInfo: {
        fullName: "Jane Doe",
        email: "jane@example.com",
        dueDate: "2026-07-01",
        careProvider: "",
        plannedBirthLocation: "Birth Center",
        supportPersonName: "Alex",
      },
      nextStep: 2,
    });

    expect(
      screen.getByRole("heading", { name: /birth preferences/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/step 2 of 5/i)).toBeInTheDocument();
    expect(screen.getByText(/40% complete/i)).toBeInTheDocument();

    const stepTwoContinueButton = screen.getByRole("button", {
      name: /continue/i,
    });
    expect(stepTwoContinueButton).toBeDisabled();

    await user.click(screen.getByLabelText(/quiet room/i));
    await user.type(
      screen.getByLabelText(/who would you like present or nearby/i),
      "Alex, Jordan, and my doula"
    );

    expect(stepTwoContinueButton).toBeEnabled();
    await user.click(stepTwoContinueButton);

    expect(logSpy).toHaveBeenCalledWith("Birth Plan Builder Step 2", {
      step: 2,
      section: "Birth Preferences",
      birthPreferences: {
        environmentPreferences: ["Quiet room"],
        supportPeople: "Alex, Jordan, and my doula",
        supportNotes: "",
        comfortMeasures: [],
      },
      nextStep: 3,
    });
    expect(screen.getByText(/step 2 is saved/i)).toBeInTheDocument();

    expect(screen.getByText(/grouped question sections/i)).toBeInTheDocument();
    expect(screen.getByText(/email and send workflow/i)).toBeInTheDocument();

    logSpy.mockRestore();
  });
});
