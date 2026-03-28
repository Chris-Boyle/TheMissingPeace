/** @jest-environment node */

jest.mock("../src/lib/email/send-contact-email", () => ({
  sendContactEmails: jest.fn(),
}));

jest.mock("../src/lib/contact-security", () => ({
  CONTACT_SECURITY_CONFIG: {
    maxBodyBytes: 24_000,
    minimumCompletionMs: 4_000,
  },
  applyContactRateLimit: jest.fn(),
  buildRateLimitHeaders: jest.fn(() => ({
    "Retry-After": "600",
  })),
  getBodySizeFromRequest: jest.fn((_request: Request, rawBody: string) => rawBody.length),
}));

import { POST } from "../src/app/api/contact/route";
import {
  applyContactRateLimit,
  getBodySizeFromRequest,
} from "../src/lib/contact-security";
import { sendContactEmails } from "../src/lib/email/send-contact-email";

describe("contact API route", () => {
  beforeEach(() => {
    (sendContactEmails as jest.Mock).mockReset();
    (applyContactRateLimit as jest.Mock).mockReset().mockResolvedValue({
      allowed: true,
      resetAt: Date.now() + 600_000,
    });
    (getBodySizeFromRequest as jest.Mock).mockImplementation(
      (_request: Request, rawBody: string) => rawBody.length
    );
  });

  function buildContactRequest(
    body: Record<string, unknown> | string,
    init?: { headers?: Record<string, string> }
  ) {
    const serializedBody =
      typeof body === "string" ? body : JSON.stringify(body);

    return new Request("http://localhost:3000/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers ?? {}),
      },
      body: serializedBody,
    });
  }

  it("returns success for a valid submission", async () => {
    (sendContactEmails as jest.Mock).mockResolvedValue(undefined);

    const response = await POST(
      buildContactRequest({
        fullName: "Jamie Rivera",
        email: "jamie@example.com",
        message: "I would love to connect about support.",
        startedAt: new Date(Date.now() - 10_000).toISOString(),
      })
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.success).toBe(true);
    expect(sendContactEmails).toHaveBeenCalledTimes(1);
  });

  it("returns 400 for invalid payloads", async () => {
    const response = await POST(
      buildContactRequest({
        email: "jamie@example.com",
        message: "Missing a name should fail.",
      })
    );
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.code).toBe("FULL_NAME_REQUIRED");
    expect(sendContactEmails).not.toHaveBeenCalled();
  });

  it("returns 400 for malformed JSON", async () => {
    const request = buildContactRequest("{not-valid-json");

    const response = await POST(request);
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.code).toBe("INVALID_JSON");
  });

  it("rejects honeypot submissions", async () => {
    const response = await POST(
      buildContactRequest({
        fullName: "Jamie Rivera",
        email: "jamie@example.com",
        message: "This should be blocked.",
        company: "Spam Corp",
      })
    );
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.code).toBe("HONEYPOT_TRIGGERED");
    expect(sendContactEmails).not.toHaveBeenCalled();
  });

  it("rejects oversized payloads safely", async () => {
    (getBodySizeFromRequest as jest.Mock).mockReturnValue(25_000);

    const response = await POST(
      buildContactRequest(
        {
          fullName: "Jamie Rivera",
          email: "jamie@example.com",
          message: "Too large",
        },
        { headers: { "content-length": "25000" } }
      )
    );
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.code).toBe("PAYLOAD_TOO_LARGE");
    expect(sendContactEmails).not.toHaveBeenCalled();
  });

  it("rate limits repeated submissions from the same client", async () => {
    (applyContactRateLimit as jest.Mock).mockResolvedValue({
      allowed: false,
      resetAt: Date.now() + 600_000,
    });

    const blockedResponse = await POST(
      buildContactRequest(
        {
          fullName: "Jamie Rivera",
          email: "jamie@example.com",
          message: "Blocked attempt",
          startedAt: new Date(Date.now() - 10_000).toISOString(),
        },
        {
          headers: {
            "x-forwarded-for": "203.0.113.10",
          },
        }
      )
    );
    const payload = await blockedResponse.json();

    expect(blockedResponse.status).toBe(429);
    expect(payload.code).toBe("RATE_LIMITED");
    expect(blockedResponse.headers.get("Retry-After")).toBeTruthy();
  });

  it("returns a generic error when email delivery fails unexpectedly", async () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    (sendContactEmails as jest.Mock).mockRejectedValue(new Error("sendgrid blew up"));

    const response = await POST(
      buildContactRequest({
        fullName: "Jamie Rivera",
        email: "jamie@example.com",
        message: "I would love to connect about support.",
        startedAt: new Date(Date.now() - 10_000).toISOString(),
      })
    );
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload.code).toBe("CONTACT_SUBMISSION_FAILED");
    expect(payload.error).toBe(
      "Something went wrong sending your message. Please try again in a moment."
    );

    consoleErrorSpy.mockRestore();
  });

  it("returns a generic error when rate limiting infrastructure fails", async () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    (applyContactRateLimit as jest.Mock).mockRejectedValue(new Error("redis blew up"));

    const response = await POST(
      buildContactRequest({
        fullName: "Jamie Rivera",
        email: "jamie@example.com",
        message: "I would love to connect about support.",
        startedAt: new Date(Date.now() - 10_000).toISOString(),
      })
    );
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload.code).toBe("CONTACT_SUBMISSION_FAILED");
    expect(payload.error).toBe(
      "Something went wrong sending your message. Please try again in a moment."
    );

    consoleErrorSpy.mockRestore();
  });
});
