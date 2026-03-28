/** @jest-environment node */

jest.mock("../src/lib/consultation-booking/service", () => ({
  getAvailableConsultationSlots: jest.fn(),
  createConsultationBooking: jest.fn(),
}));

jest.mock("../src/lib/consultation-booking/security", () => ({
  CONSULTATION_SECURITY_CONFIG: {
    maxBodyBytes: 24000,
    maxDateQueryLength: 32,
  },
  applyConsultationRateLimit: jest.fn(),
  buildConsultationRateLimitHeaders: jest.fn(() => ({
    "Retry-After": "60",
  })),
  getBodySizeFromRequest: jest.fn((_request: Request, rawBody: string) => rawBody.length),
}));

import { GET } from "../src/app/api/consultation/availability/route";
import { POST } from "../src/app/api/consultation/book/route";
import { ConsultationBookingError } from "../src/lib/consultation-booking/errors";
import {
  getAvailableConsultationSlots,
  createConsultationBooking,
} from "../src/lib/consultation-booking/service";
import {
  applyConsultationRateLimit,
  getBodySizeFromRequest,
} from "../src/lib/consultation-booking/security";

describe("consultation booking API routes", () => {
  beforeEach(() => {
    (getAvailableConsultationSlots as jest.Mock).mockReset();
    (createConsultationBooking as jest.Mock).mockReset();
    (applyConsultationRateLimit as jest.Mock).mockReset().mockResolvedValue({
      allowed: true,
      retryAfterSeconds: 60,
    });
    (getBodySizeFromRequest as jest.Mock).mockImplementation(
      (_request: Request, rawBody: string) => rawBody.length
    );
  });

  it("returns availability payloads", async () => {
    (getAvailableConsultationSlots as jest.Mock).mockResolvedValue({
      date: "2026-04-06",
      timeZone: "America/Chicago",
      slots: [
        {
          startTime: "2026-04-06T15:00:00.000Z",
          endTime: "2026-04-06T15:30:00.000Z",
          label: "10:00 AM",
        },
      ],
    });

    const response = await GET(
      new Request("http://localhost:3000/api/consultation/availability?date=2026-04-06")
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.slots).toHaveLength(1);
  });

  it("rejects invalid availability requests", async () => {
    const response = await GET(
      new Request("http://localhost:3000/api/consultation/availability")
    );
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.code).toBe("DATE_REQUIRED");
  });

  it("rate limits availability requests", async () => {
    (applyConsultationRateLimit as jest.Mock).mockResolvedValue({
      allowed: false,
      retryAfterSeconds: 60,
    });

    const response = await GET(
      new Request("http://localhost:3000/api/consultation/availability?date=2026-04-06")
    );
    const payload = await response.json();

    expect(response.status).toBe(429);
    expect(payload.code).toBe("RATE_LIMITED");
  });

  it("returns booking confirmations", async () => {
    (createConsultationBooking as jest.Mock).mockResolvedValue({
      displayTime: "Monday, April 6 at 10:00 AM",
      booking: {
        fullName: "Jamie Rivera",
        email: "jamie@example.com",
      },
    });

    const response = await POST(
      new Request("http://localhost:3000/api/consultation/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: "Jamie Rivera",
          email: "jamie@example.com",
          startTime: "2026-04-06T15:00:00.000Z",
        }),
      })
    );
    const payload = await response.json();

    expect(response.status).toBe(201);
    expect(payload.booking.fullName).toBe("Jamie Rivera");
  });

  it("returns 400 for malformed booking JSON", async () => {
    const response = await POST(
      new Request("http://localhost:3000/api/consultation/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: "{not-valid-json",
      })
    );
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.code).toBe("INVALID_JSON");
  });

  it("rejects oversized booking payloads", async () => {
    (getBodySizeFromRequest as jest.Mock).mockReturnValue(25000);

    const response = await POST(
      new Request("http://localhost:3000/api/consultation/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: "Jamie Rivera",
          email: "jamie@example.com",
          startTime: "2026-04-06T15:00:00.000Z",
        }),
      })
    );
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.code).toBe("PAYLOAD_TOO_LARGE");
  });

  it("rate limits booking requests", async () => {
    (applyConsultationRateLimit as jest.Mock).mockResolvedValue({
      allowed: false,
      retryAfterSeconds: 60,
    });

    const response = await POST(
      new Request("http://localhost:3000/api/consultation/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: "Jamie Rivera",
          email: "jamie@example.com",
          startTime: "2026-04-06T15:00:00.000Z",
        }),
      })
    );
    const payload = await response.json();

    expect(response.status).toBe(429);
    expect(payload.code).toBe("RATE_LIMITED");
  });

  it("returns sanitized provider errors", async () => {
    (createConsultationBooking as jest.Mock).mockRejectedValue(
      new ConsultationBookingError("Google Calendar request failed: boom", {
        status: 502,
        code: "GOOGLE_CALENDAR_REQUEST_FAILED",
      })
    );

    const response = await POST(
      new Request("http://localhost:3000/api/consultation/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: "Jamie Rivera",
          email: "jamie@example.com",
          startTime: "2026-04-06T15:00:00.000Z",
        }),
      })
    );
    const payload = await response.json();

    expect(response.status).toBe(502);
    expect(payload.error).toBe(
      "We could not complete that request right now. Please try again shortly."
    );
  });
});
