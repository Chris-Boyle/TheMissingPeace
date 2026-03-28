/** @jest-environment node */

import { buildSlotsFromBusinessRules } from "../src/lib/consultation-booking/slots";
import {
  createConsultationBooking,
  getAvailableConsultationSlots,
} from "../src/lib/consultation-booking/service";
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
        deleteEvent: async () => undefined,
      },
      repository: {
        getBusyIntervals: async () => [
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
            deleteEvent: async () => undefined,
          },
          repository: {
            getBusyIntervals: async () => [],
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

  it("marks the booking failed if event creation errors", async () => {
    const markFailed = jest.fn().mockResolvedValue(undefined);

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
            queryBusyTimes: async () => [],
            createEvent: async () => {
              throw new ConsultationBookingError(
                "Calendar integration is not available right now.",
                { status: 502, code: "GOOGLE_CALENDAR_REQUEST_FAILED" }
              );
            },
            deleteEvent: async () => undefined,
          },
          repository: {
            getBusyIntervals: async () => [],
            createPendingBooking: jest.fn().mockResolvedValue({
              id: "booking_123",
              fullName: "Jamie Rivera",
              email: "jamie@example.com",
              phone: null,
              consultationType: "Consultation",
              notes: null,
              birthPlanSubmissionId: null,
              googleCalendarEventId: null,
              startTime: "2026-04-06T15:00:00.000Z",
              endTime: "2026-04-06T15:30:00.000Z",
              timezone: timeZone,
              status: "pending",
              createdAt: "2026-04-01T12:00:00.000Z",
              updatedAt: "2026-04-01T12:00:00.000Z",
            }),
            confirmBooking: jest.fn(),
            markFailed,
          },
        }
      )
    ).rejects.toMatchObject({
      code: "GOOGLE_CALENDAR_REQUEST_FAILED",
    });

    expect(markFailed).toHaveBeenCalledWith("booking_123");
  });

  it("deletes the Google event if confirmation fails after event creation", async () => {
    const deleteEvent = jest.fn().mockResolvedValue(undefined);
    const markFailed = jest.fn().mockResolvedValue(undefined);

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
            queryBusyTimes: async () => [],
            createEvent: async () => ({ id: "evt_123" }),
            deleteEvent,
          },
          repository: {
            getBusyIntervals: async () => [],
            createPendingBooking: jest.fn().mockResolvedValue({
              id: "booking_123",
              fullName: "Jamie Rivera",
              email: "jamie@example.com",
              phone: null,
              consultationType: "Consultation",
              notes: null,
              birthPlanSubmissionId: null,
              googleCalendarEventId: null,
              startTime: "2026-04-06T15:00:00.000Z",
              endTime: "2026-04-06T15:30:00.000Z",
              timezone: timeZone,
              status: "pending",
              createdAt: "2026-04-01T12:00:00.000Z",
              updatedAt: "2026-04-01T12:00:00.000Z",
            }),
            confirmBooking: jest.fn().mockRejectedValue(
              new ConsultationBookingError(
                "We could not finalize that booking right now. Please try again.",
                {
                  status: 503,
                  code: "BOOKING_CONFIRMATION_FAILED",
                }
              )
            ),
            markFailed,
          },
        }
      )
    ).rejects.toMatchObject({
      code: "BOOKING_CONFIRMATION_FAILED",
    });

    expect(deleteEvent).toHaveBeenCalledWith("evt_123");
    expect(markFailed).toHaveBeenCalledWith("booking_123");
  });
});
