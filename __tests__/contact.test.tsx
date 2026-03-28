import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ContactPage } from "../src/components/contact/contact-page";
import { DOULA_QUIZ_STORAGE_KEY } from "../src/lib/quiz-storage";

describe("Contact page", () => {
  const fetchMock = jest.fn();

  beforeEach(() => {
    fetchMock.mockReset();
    global.fetch = fetchMock as unknown as typeof fetch;
    window.localStorage.clear();
  });

  it("validates required fields before submitting", async () => {
    const user = userEvent.setup();
    render(<ContactPage />);

    await user.click(screen.getByRole("button", { name: /send message/i }));

    expect(screen.getByText("Please share your name.")).toBeInTheDocument();
    expect(
      screen.getByText("Please provide an email address.")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Please add a short message so I know how to support you.")
    ).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("submits to the contact API and includes saved quiz results when present", async () => {
    const user = userEvent.setup();
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        message:
          "Thanks for reaching out. We received your message and sent a confirmation to your email.",
      }),
    });
    window.localStorage.setItem(
      DOULA_QUIZ_STORAGE_KEY,
      JSON.stringify({
        answers: {
          "birth-feeling": ["anxious"],
        },
        resultKey: "high-support",
        resultHeadline: "You’d really benefit from having a doula by your side",
        resultSummary: "A steady support presence would likely feel meaningful.",
        completedAt: "2026-03-25T12:00:00.000Z",
      })
    );

    render(<ContactPage />);

    await user.type(screen.getByLabelText(/full name/i), "Jane Doe");
    await user.type(screen.getByLabelText(/^email$/i), "jane@example.com");
    await user.type(screen.getByLabelText(/phone number/i), "555-111-2222");
    await user.selectOptions(
      screen.getByLabelText(/preferred contact method/i),
      "phone"
    );
    await user.type(
      screen.getByLabelText(/personal message/i),
      "I would love to learn more about support."
    );

    await user.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    const [url, options] = fetchMock.mock.calls[0] as [
      string,
      RequestInit & { body: string },
    ];

    expect(url).toBe("/api/contact");
    expect(options.method).toBe("POST");

    const payload = JSON.parse(options.body);

    expect(payload).toMatchObject({
      fullName: "Jane Doe",
      email: "jane@example.com",
      phone: "555-111-2222",
      contactMethod: "phone",
      message: "I would love to learn more about support.",
    });
    expect(payload.quizResult.resultKey).toBe("high-support");

    expect(
      await screen.findByText(
        /thanks for reaching out\. we received your message and sent a confirmation to your email\./i
      )
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/full name/i)).toHaveValue("");
  });

  it("shows a friendly error and preserves values when the request fails", async () => {
    const user = userEvent.setup();
    fetchMock.mockResolvedValue({
      ok: false,
      json: async () => ({
        error:
          "Something went wrong sending your message. Please try again in a moment.",
      }),
    });

    render(<ContactPage />);

    await user.type(screen.getByLabelText(/full name/i), "Jane Doe");
    await user.type(screen.getByLabelText(/^email$/i), "jane@example.com");
    await user.type(
      screen.getByLabelText(/personal message/i),
      "Checking in about availability."
    );

    await user.click(screen.getByRole("button", { name: /send message/i }));

    expect(
      await screen.findByText(
        /something went wrong sending your message\. please try again in a moment\./i
      )
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/full name/i)).toHaveValue("Jane Doe");
    expect(screen.getByRole("button", { name: /send message/i })).toBeEnabled();
  });
});
