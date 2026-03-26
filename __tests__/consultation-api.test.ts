/** @jest-environment node */

jest.mock("../src/lib/consultation-booking/service", () => ({
  getAvailableConsultationSlots: jest.fn(),
  createConsultationBooking: jest.fn(),
}));

import { GET } from "../src/app/api/consultation/availability/route";
import { POST } from "../src/app/api/consultation/book/route";
import {
  getAvailableConsultationSlots,
  createConsultationBooking,
} from "../src/lib/consultation-booking/service";

describe("consultation booking API routes", () => {
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
});
