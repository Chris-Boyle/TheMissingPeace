import { randomUUID } from "node:crypto";
import { CONSULTATION_STATUSES } from "./config";
import { ConsultationBookingError } from "./errors";
import { getDateStringForInstant } from "./time";
import type {
  BusyInterval,
  ConsultationBookingInput,
  ConsultationBookingRecord,
} from "./types";
import {
  executeRedisCommand,
  executeRedisPipeline,
} from "@/lib/upstash-redis";

type PendingBookingInput = ConsultationBookingInput & {
  consultationType: string;
  endTime: string;
  timezone: string;
};

const PENDING_SLOT_TTL_MS = 15 * 60 * 1000;
const BOOKING_KEY_PREFIX = "consultation:booking";
const SLOT_KEY_PREFIX = "consultation:slot";
const DAY_KEY_PREFIX = "consultation:day";

function getBookingKey(id: string) {
  return `${BOOKING_KEY_PREFIX}:${id}`;
}

function getSlotKey(startTime: string) {
  return `${SLOT_KEY_PREFIX}:${startTime}`;
}

function getDayKey(date: string) {
  return `${DAY_KEY_PREFIX}:${date}`;
}

function getBookingDate(startTime: string, timeZone: string) {
  return getDateStringForInstant(new Date(startTime), timeZone);
}

function parseBookingRecord(value: unknown) {
  if (typeof value !== "string") {
    return null;
  }

  try {
    return JSON.parse(value) as ConsultationBookingRecord;
  } catch {
    return null;
  }
}

async function getBookingRecord(id: string) {
  const payload = await executeRedisCommand<string | null>("GET", getBookingKey(id));
  return parseBookingRecord(payload);
}

async function cleanupPendingWrite(booking: ConsultationBookingRecord) {
  const date = getBookingDate(booking.startTime, booking.timezone);

  await executeRedisPipeline([
    ["DEL", getSlotKey(booking.startTime)],
    ["DEL", getBookingKey(booking.id)],
    ["SREM", getDayKey(date), booking.id],
  ]);
}

export interface ConsultationBookingRepository {
  getBusyIntervals(
    startTime: string,
    endTime: string,
    timeZone: string
  ): Promise<BusyInterval[]>;
  createPendingBooking(
    input: PendingBookingInput
  ): Promise<ConsultationBookingRecord>;
  confirmBooking(
    id: string,
    googleCalendarEventId: string
  ): Promise<ConsultationBookingRecord>;
  markFailed(id: string): Promise<void>;
}

export class UpstashConsultationBookingRepository
  implements ConsultationBookingRepository
{
  async getBusyIntervals(startTime: string, endTime: string, timeZone: string) {
    const date = getBookingDate(startTime, timeZone);
    const bookingIds =
      (await executeRedisCommand<string[]>("SMEMBERS", getDayKey(date))) || [];

    if (bookingIds.length === 0) {
      return [];
    }

    const records = await executeRedisPipeline<string | null>(
      bookingIds.map((id) => ["GET", getBookingKey(id)])
    );

    return records
      .map(parseBookingRecord)
      .filter(
        (record): record is ConsultationBookingRecord =>
          record !== null &&
          (record.status === CONSULTATION_STATUSES.pending ||
            record.status === CONSULTATION_STATUSES.confirmed) &&
          record.startTime < endTime &&
          record.endTime > startTime
      )
      .map((record) => ({
        start: record.startTime,
        end: record.endTime,
        source: "database" as const,
      }));
  }

  async createPendingBooking(input: PendingBookingInput) {
    const booking: ConsultationBookingRecord = {
      id: randomUUID(),
      fullName: input.fullName,
      email: input.email,
      phone: input.phone || null,
      consultationType: input.consultationType || null,
      notes: input.notes || null,
      birthPlanSubmissionId: input.birthPlanSubmissionId || null,
      googleCalendarEventId: null,
      startTime: input.startTime,
      endTime: input.endTime,
      timezone: input.timezone,
      status: CONSULTATION_STATUSES.pending,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const dayKey = getDayKey(getBookingDate(booking.startTime, booking.timezone));
    const slotReservation = await executeRedisCommand<string | null>(
      "SET",
      getSlotKey(booking.startTime),
      booking.id,
      "NX",
      "PX",
      PENDING_SLOT_TTL_MS
    );

    if (slotReservation !== "OK") {
      throw new ConsultationBookingError(
        "That time was just booked. Please choose another available slot.",
        {
          status: 409,
          code: "SLOT_ALREADY_BOOKED",
        }
      );
    }

    try {
      await executeRedisPipeline([
        ["SET", getBookingKey(booking.id), JSON.stringify(booking)],
        ["SADD", dayKey, booking.id],
      ]);
    } catch {
      await cleanupPendingWrite(booking);
      throw new ConsultationBookingError(
        "We could not hold that time right now. Please try again.",
        {
          status: 503,
          code: "BOOKING_PERSISTENCE_FAILED",
        }
      );
    }

    return booking;
  }

  async confirmBooking(id: string, googleCalendarEventId: string) {
    const current = await getBookingRecord(id);

    if (!current) {
      throw new ConsultationBookingError(
        "We could not finalize that booking right now. Please try again.",
        {
          status: 503,
          code: "BOOKING_CONFIRMATION_FAILED",
        }
      );
    }

    const booking: ConsultationBookingRecord = {
      ...current,
      googleCalendarEventId,
      status: CONSULTATION_STATUSES.confirmed,
      updatedAt: new Date().toISOString(),
    };

    try {
      await executeRedisPipeline([
        ["SET", getBookingKey(booking.id), JSON.stringify(booking)],
        ["PERSIST", getSlotKey(booking.startTime)],
      ]);
    } catch {
      throw new ConsultationBookingError(
        "We could not finalize that booking right now. Please try again.",
        {
          status: 503,
          code: "BOOKING_CONFIRMATION_FAILED",
        }
      );
    }

    return booking;
  }

  async markFailed(id: string) {
    const current = await getBookingRecord(id);

    if (!current) {
      return;
    }

    const booking: ConsultationBookingRecord = {
      ...current,
      status: CONSULTATION_STATUSES.failed,
      updatedAt: new Date().toISOString(),
    };
    const dayKey = getDayKey(getBookingDate(booking.startTime, booking.timezone));

    await executeRedisPipeline([
      ["SET", getBookingKey(booking.id), JSON.stringify(booking)],
      ["DEL", getSlotKey(booking.startTime)],
      ["SREM", dayKey, booking.id],
    ]);
  }
}

export function createConsultationBookingRepository() {
  return new UpstashConsultationBookingRepository();
}
