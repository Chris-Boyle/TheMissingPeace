export const CONSULTATION_CONFIG = {
  durationMinutes: 30,
  bufferMinutes: 15,
  slotIncrementMinutes: 15,
  workingDays: [1, 2, 3, 4, 5],
  bookingStartHour: 9,
  bookingEndHour: 16,
  minimumNoticeDays: 1,
  defaultConsultationType: "Consultation",
} as const;

export const CONSULTATION_STATUSES = {
  pending: "pending",
  confirmed: "confirmed",
  cancelled: "cancelled",
  failed: "failed",
} as const;

export type ConsultationStatus =
  (typeof CONSULTATION_STATUSES)[keyof typeof CONSULTATION_STATUSES];

export function getConsultationTimeZone() {
  return process.env.CONSULTATION_TIMEZONE || "America/Chicago";
}

export function getConsultationCalendarId() {
  return process.env.GOOGLE_CALENDAR_ID || "primary";
}
