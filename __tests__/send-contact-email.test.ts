/** @jest-environment node */

import { sendContactEmails } from "../src/lib/email/send-contact-email";

describe("sendContactEmails", () => {
  const fetchMock = jest.fn();
  const originalEnv = process.env;

  beforeEach(() => {
    fetchMock.mockReset();
    global.fetch = fetchMock as unknown as typeof fetch;
    process.env = {
      ...originalEnv,
      SENDGRID_API_KEY: "test-sendgrid-key",
      CONTACT_FROM_EMAIL: "hello@themissingpeace.com",
      CONTACT_TO_EMAIL: "missingpeacekc@gmail.com",
    };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("sends confirmation and internal notification emails with quiz context", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      text: async () => "",
    });

    await sendContactEmails({
      fullName: "Jamie Rivera",
      email: "jamie@example.com",
      phone: "555-222-3333",
      dueDate: "2026-07-01",
      contactMethod: "email",
      message: "I would love to talk about doula support.",
      quizResult: {
        answers: {
          "birth-feeling": ["anxious"],
        },
        resultKey: "high-support",
        resultHeadline: "You’d really benefit from having a doula by your side",
        resultSummary: "A calm, steady support presence would help.",
        completedAt: "2026-03-25T12:00:00.000Z",
      },
    });

    expect(fetchMock).toHaveBeenCalledTimes(2);

    const firstPayload = JSON.parse(fetchMock.mock.calls[0][1].body as string);
    const secondPayload = JSON.parse(fetchMock.mock.calls[1][1].body as string);

    expect(firstPayload.personalizations[0].to[0].email).toBe(
      "jamie@example.com"
    );
    expect(firstPayload.subject).toBe(
      "We received your message | The Missing Peace"
    );
    expect(firstPayload.content[0].value).toContain(
      "Quiz result: You’d really benefit from having a doula by your side"
    );

    expect(secondPayload.personalizations[0].to[0].email).toBe(
      "missingpeacekc@gmail.com"
    );
    expect(secondPayload.subject).toBe(
      "New Contact Form Submission - Jamie Rivera"
    );
    expect(secondPayload.content[0].value).toContain("Result key: high-support");
    expect(secondPayload.content[0].value).toContain(
      '"birth-feeling": [\n    "anxious"\n  ]'
    );
  });
});
