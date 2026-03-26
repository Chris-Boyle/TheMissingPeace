/** @jest-environment node */

import { buildSlotsFromBusinessRules } from "../src/lib/consultation-booking/slots";
import { getAvailableConsultationSlots, createConsultationBooking } from "../src/lib/consultation-booking/service";
import { validateAvailabilityDate } from "../src/lib/consultation-booking/validation";
import { ConsultationBookingError } from "../src/lib/consultation-booking/errors";

describe("consultation booking business rules", () => {
  const timeZone = "America/Chicago";

  it("removes slots that conflict with the configured buffer window", () => {
    const slots = buildSlotsFromBusinessRules({
      date: "2026-04-06",
      timeZone,
      busyIntervals: [
        {
          start: "2026-04-06T15:00:00.000Z",
          end: "2026-04-06T15:30:00.000Z",
        },
      ],
    });

    expect(slots.some((slot) => slot.label === "10:30 AM")).toBe(false);
    expect(slots.some((slot) => slot.label === "10:45 AM")).toBe(true);
  });

  it("rejects weekend availability requests", () => {
    expect(() =>
      validateAvailabilityDate(
        "2026-04-04",
        timeZone,
        new Date("2026-04-01T12:00:00.000Z")
      )
    ).toThrow(ConsultationBookingError);
  });

  it("returns weekday availability from injected calendar and repository data", async () => {
    const result = await getAvailableConsultationSlots("2026-04-06", {
      timeZone,
      now: () => new Date("2026-04-01T12:00:00.000Z"),
      calendarClient: {
        queryBusyTimes: async () => [
          {
            start: "2026-04-06T16:00:00.000Z",
            end: "2026-04-06T16:30:00.000Z",
            source: "google",
          },
        ],
        createEvent: async () => ({ id: "unused" }),
      },
      repository: {
        getBusyIntervals: () => [
          {
            start: "2026-04-06T18:00:00.000Z",
            end: "2026-04-06T18:30:00.000Z",
            source: "database",
          },
        ],
        createPendingBooking: jest.fn(),
        confirmBooking: jest.fn(),
        markFailed: jest.fn(),
      },
    });

    expect(result.date).toBe("2026-04-06");
    expect(result.slots.length).toBeGreaterThan(0);
    expect(result.slots.some((slot) => slot.label === "11:00 AM")).toBe(false);
  });

  it("revalidates the slot before booking and returns a friendly conflict", async () => {
    await expect(
      createConsultationBooking(
        {
          fullName: "Jamie Rivera",
          email: "jamie@example.com",
          startTime: "2026-04-06T15:00:00.000Z",
        },
        {
          timeZone,
          now: () => new Date("2026-04-01T12:00:00.000Z"),
          calendarClient: {
            queryBusyTimes: async () => [
              {
                start: "2026-04-06T15:00:00.000Z",
                end: "2026-04-06T15:30:00.000Z",
                source: "google",
              },
            ],
            createEvent: async () => ({ id: "evt_123" }),
          },
          repository: {
            getBusyIntervals: () => [],
            createPendingBooking: jest.fn(),
            confirmBooking: jest.fn(),
            markFailed: jest.fn(),
          },
        }
      )
    ).rejects.toMatchObject({
      status: 409,
      code: "SLOT_NO_LONGER_AVAILABLE",
    });
  });
});
