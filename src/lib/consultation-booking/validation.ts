import { CONSULTATION_CONFIG } from "./config";
import { ConsultationBookingError } from "./errors";
import { getDateStringForInstant, getWeekdayForDate, isPastOrSameDay } from "./time";
import type { ConsultationBookingInput } from "./types";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateAvailabilityDate(date: string, timeZone: string, now = new Date()) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new ConsultationBookingError("Please choose a valid date.", {
      status: 400,
      code: "INVALID_DATE",
    });
  }

  if (isPastOrSameDay(date, timeZone, now)) {
    throw new ConsultationBookingError(
      "Same-day booking is not available. Please choose a future weekday.",
      {
        status: 400,
        code: "DATE_TOO_SOON",
      }
    );
  }

  const weekday = getWeekdayForDate(date);

  if (!CONSULTATION_CONFIG.workingDays.some((workingDay) => workingDay === weekday)) {
    throw new ConsultationBookingError(
      "Consultations are available Monday through Friday.",
      {
        status: 400,
        code: "WEEKEND_NOT_AVAILABLE",
      }
    );
  }
}

export function validateBookingInput(
  payload: Partial<ConsultationBookingInput>,
  timeZone: string,
  now = new Date()
) {
  if (!payload.fullName?.trim()) {
    throw new ConsultationBookingError("Please enter your full name.", {
      status: 400,
      code: "FULL_NAME_REQUIRED",
    });
  }

  if (!payload.email?.trim() || !emailPattern.test(payload.email)) {
    throw new ConsultationBookingError("Please enter a valid email address.", {
      status: 400,
      code: "EMAIL_INVALID",
    });
  }

  if (!payload.startTime) {
    throw new ConsultationBookingError("Please choose a consultation time.", {
      status: 400,
      code: "START_TIME_REQUIRED",
    });
  }

  const startTime = new Date(payload.startTime);

  if (Number.isNaN(startTime.getTime())) {
    throw new ConsultationBookingError("Please choose a valid consultation time.", {
      status: 400,
      code: "START_TIME_INVALID",
    });
  }

  const slotDate = getDateStringForInstant(startTime, timeZone);
  validateAvailabilityDate(slotDate, timeZone, now);

  return {
    fullName: payload.fullName.trim(),
    email: payload.email.trim().toLowerCase(),
    phone: payload.phone?.trim() || undefined,
    notes: payload.notes?.trim() || undefined,
    consultationType:
      payload.consultationType?.trim() ||
      CONSULTATION_CONFIG.defaultConsultationType,
    birthPlanSubmissionId: payload.birthPlanSubmissionId?.trim() || null,
    startTime: startTime.toISOString(),
  };
}
