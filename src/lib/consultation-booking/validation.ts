import { CONSULTATION_CONFIG } from "./config";
import { ConsultationBookingError } from "./errors";
import { getDateStringForInstant, getWeekdayForDate, isPastOrSameDay } from "./time";
import type { ConsultationBookingInput } from "./types";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const controlCharacterPattern = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/;

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
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new ConsultationBookingError("Invalid booking request.", {
      status: 400,
      code: "INVALID_BOOKING_PAYLOAD",
    });
  }

  if (!payload.fullName?.trim()) {
    throw new ConsultationBookingError("Please enter your full name.", {
      status: 400,
      code: "FULL_NAME_REQUIRED",
    });
  }

  if (payload.fullName.trim().length > 120 || controlCharacterPattern.test(payload.fullName)) {
    throw new ConsultationBookingError("Please enter a valid full name.", {
      status: 400,
      code: "FULL_NAME_INVALID",
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

  const phone = payload.phone?.trim() || undefined;
  const notes = payload.notes?.trim() || undefined;
  const consultationType =
    payload.consultationType?.trim() ||
    CONSULTATION_CONFIG.defaultConsultationType;
  const birthPlanSubmissionId = payload.birthPlanSubmissionId?.trim() || null;

  if (phone && (phone.length > 40 || controlCharacterPattern.test(phone))) {
    throw new ConsultationBookingError("Please enter a valid phone number.", {
      status: 400,
      code: "PHONE_INVALID",
    });
  }

  if (notes && (notes.length > 2000 || controlCharacterPattern.test(notes))) {
    throw new ConsultationBookingError("Please keep notes a little shorter.", {
      status: 400,
      code: "NOTES_INVALID",
    });
  }

  if (
    consultationType.length > 80 ||
    controlCharacterPattern.test(consultationType)
  ) {
    throw new ConsultationBookingError("Please choose a valid consultation type.", {
      status: 400,
      code: "CONSULTATION_TYPE_INVALID",
    });
  }

  if (
    birthPlanSubmissionId &&
    (birthPlanSubmissionId.length > 120 ||
      controlCharacterPattern.test(birthPlanSubmissionId))
  ) {
    throw new ConsultationBookingError("Invalid booking request.", {
      status: 400,
      code: "BIRTH_PLAN_SUBMISSION_INVALID",
    });
  }

  return {
    fullName: payload.fullName.trim(),
    email: payload.email.trim().toLowerCase(),
    phone,
    notes,
    consultationType,
    birthPlanSubmissionId,
    startTime: startTime.toISOString(),
  };
}
