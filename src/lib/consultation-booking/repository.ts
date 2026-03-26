import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { randomUUID } from "node:crypto";
import { DatabaseSync } from "node:sqlite";
import {
  CONSULTATION_STATUSES,
  getConsultationDatabasePath,
} from "./config";
import { ConsultationBookingError } from "./errors";
import type {
  BusyInterval,
  ConsultationBookingInput,
  ConsultationBookingRecord,
} from "./types";

type PendingBookingInput = ConsultationBookingInput & {
  consultationType: string;
  endTime: string;
  timezone: string;
};

let database: DatabaseSync | null = null;

function getDatabase() {
  if (database) {
    return database;
  }

  const databasePath = getConsultationDatabasePath();
  mkdirSync(dirname(databasePath), { recursive: true });
  database = new DatabaseSync(databasePath);
  database.exec(`
    CREATE TABLE IF NOT EXISTS consultation_bookings (
      id TEXT PRIMARY KEY,
      fullName TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      consultationType TEXT,
      notes TEXT,
      birthPlanSubmissionId TEXT,
      googleCalendarEventId TEXT,
      startTime TEXT NOT NULL,
      endTime TEXT NOT NULL,
      timezone TEXT NOT NULL,
      status TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );

    CREATE UNIQUE INDEX IF NOT EXISTS consultation_bookings_active_slot_idx
    ON consultation_bookings(startTime, endTime)
    WHERE status IN ('pending', 'confirmed');
  `);

  return database;
}

function mapBookingRow(row: ConsultationBookingRecord) {
  return row;
}

export interface ConsultationBookingRepository {
  getBusyIntervals(startTime: string, endTime: string): BusyInterval[];
  createPendingBooking(input: PendingBookingInput): ConsultationBookingRecord;
  confirmBooking(id: string, googleCalendarEventId: string): ConsultationBookingRecord;
  markFailed(id: string): void;
}

export class SqliteConsultationBookingRepository
  implements ConsultationBookingRepository
{
  getBusyIntervals(startTime: string, endTime: string) {
    const rows = getDatabase()
      .prepare(
        `
          SELECT startTime, endTime
          FROM consultation_bookings
          WHERE status IN ('pending', 'confirmed')
            AND startTime < ?
            AND endTime > ?
        `
      )
      .all<{ startTime: string; endTime: string }>(endTime, startTime);

    return rows.map((row) => ({
      start: row.startTime,
      end: row.endTime,
      source: "database" as const,
    }));
  }

  createPendingBooking(input: PendingBookingInput) {
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

    try {
      getDatabase()
        .prepare(
          `
            INSERT INTO consultation_bookings (
              id,
              fullName,
              email,
              phone,
              consultationType,
              notes,
              birthPlanSubmissionId,
              googleCalendarEventId,
              startTime,
              endTime,
              timezone,
              status,
              createdAt,
              updatedAt
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `
        )
        .run(
          booking.id,
          booking.fullName,
          booking.email,
          booking.phone,
          booking.consultationType,
          booking.notes,
          booking.birthPlanSubmissionId,
          booking.googleCalendarEventId,
          booking.startTime,
          booking.endTime,
          booking.timezone,
          booking.status,
          booking.createdAt,
          booking.updatedAt
        );
    } catch {
      throw new ConsultationBookingError(
        "That time was just booked. Please choose another available slot.",
        {
          status: 409,
          code: "SLOT_ALREADY_BOOKED",
        }
      );
    }

    return booking;
  }

  confirmBooking(id: string, googleCalendarEventId: string) {
    const updatedAt = new Date().toISOString();
    getDatabase()
      .prepare(
        `
          UPDATE consultation_bookings
          SET googleCalendarEventId = ?,
              status = ?,
              updatedAt = ?
          WHERE id = ?
        `
      )
      .run(
        googleCalendarEventId,
        CONSULTATION_STATUSES.confirmed,
        updatedAt,
        id
      );

    const row = getDatabase()
      .prepare(
        `
          SELECT *
          FROM consultation_bookings
          WHERE id = ?
        `
      )
      .get<ConsultationBookingRecord>(id);

    if (!row) {
      throw new ConsultationBookingError("Booking record not found after confirmation.", {
        status: 500,
        code: "BOOKING_CONFIRMATION_NOT_FOUND",
      });
    }

    return mapBookingRow(row);
  }

  markFailed(id: string) {
    getDatabase()
      .prepare(
        `
          UPDATE consultation_bookings
          SET status = ?,
              updatedAt = ?
          WHERE id = ?
        `
      )
      .run(CONSULTATION_STATUSES.failed, new Date().toISOString(), id);
  }
}

export function createConsultationBookingRepository() {
  return new SqliteConsultationBookingRepository();
}
