import { ConsultationBookingError } from "@/lib/consultation-booking/errors";
import type { StoredDoulaQuizResult } from "@/lib/quiz-storage";

export type ContactSubmissionInput = {
  fullName?: unknown;
  email?: unknown;
  phone?: unknown;
  dueDate?: unknown;
  contactMethod?: unknown;
  message?: unknown;
  company?: unknown;
  startedAt?: unknown;
  quizResult?: unknown;
};

export type ValidatedContactSubmission = {
  fullName: string;
  email: string;
  phone?: string;
  dueDate?: string;
  contactMethod?: string;
  message: string;
  company?: string;
  startedAt?: string;
  quizResult?: StoredDoulaQuizResult;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const urlPattern = /https?:\/\/|www\./gi;
const controlCharacterPattern = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/;

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getTrimmedString(
  value: unknown,
  options?: { maxLength?: number }
) {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();

  if (!trimmed) {
    return undefined;
  }

  if (options?.maxLength && trimmed.length > options.maxLength) {
    throw new ConsultationBookingError("One or more fields are too long.", {
      status: 400,
      code: "FIELD_TOO_LONG",
    });
  }

  return trimmed;
}

function validateQuizResult(value: unknown) {
  if (!isPlainObject(value)) {
    return undefined;
  }

  const answers = isPlainObject(value.answers) ? value.answers : undefined;
  const resultKey = getTrimmedString(value.resultKey, { maxLength: 80 });
  const resultHeadline = getTrimmedString(value.resultHeadline, {
    maxLength: 200,
  });
  const resultSummary = getTrimmedString(value.resultSummary, {
    maxLength: 1000,
  });
  const completedAt = getTrimmedString(value.completedAt, { maxLength: 80 });

  if (!answers && !resultKey && !resultHeadline && !resultSummary && !completedAt) {
    return undefined;
  }

  return {
    answers,
    resultKey,
    resultHeadline,
    resultSummary,
    completedAt,
  };
}

export function validateContactSubmission(payload: ContactSubmissionInput) {
  if (!isPlainObject(payload)) {
    throw new ConsultationBookingError("Invalid submission.", {
      status: 400,
      code: "INVALID_PAYLOAD",
    });
  }

  const fullName = getTrimmedString(payload.fullName, { maxLength: 120 });
  const email = getTrimmedString(payload.email, { maxLength: 254 });
  const phone = getTrimmedString(payload.phone, { maxLength: 40 });
  const dueDate = getTrimmedString(payload.dueDate, { maxLength: 20 });
  const contactMethod = getTrimmedString(payload.contactMethod, {
    maxLength: 40,
  });
  const message = getTrimmedString(payload.message, { maxLength: 4000 });
  const company = getTrimmedString(payload.company, { maxLength: 120 });
  const startedAt = getTrimmedString(payload.startedAt, { maxLength: 80 });

  if (!fullName) {
    throw new ConsultationBookingError("Please share your full name.", {
      status: 400,
      code: "FULL_NAME_REQUIRED",
    });
  }

  if (!email || !emailPattern.test(email)) {
    throw new ConsultationBookingError("Please enter a valid email address.", {
      status: 400,
      code: "EMAIL_INVALID",
    });
  }

  if (!message) {
    throw new ConsultationBookingError(
      "Please add a short message so I know how to support you.",
      {
        status: 400,
        code: "MESSAGE_REQUIRED",
      }
    );
  }

  if (company) {
    throw new ConsultationBookingError("Submission rejected.", {
      status: 400,
      code: "HONEYPOT_TRIGGERED",
    });
  }

  if (controlCharacterPattern.test(fullName) || controlCharacterPattern.test(message)) {
    throw new ConsultationBookingError("Invalid submission.", {
      status: 400,
      code: "INVALID_CHARACTERS",
    });
  }

  const detectedLinks = message.match(urlPattern)?.length ?? 0;

  if (detectedLinks > 5) {
    throw new ConsultationBookingError("Invalid submission.", {
      status: 400,
      code: "TOO_MANY_LINKS",
    });
  }

  if (startedAt && Number.isNaN(Date.parse(startedAt))) {
    throw new ConsultationBookingError("Invalid submission.", {
      status: 400,
      code: "START_TIME_INVALID",
    });
  }

  return {
    fullName,
    email: email.toLowerCase(),
    phone,
    dueDate,
    contactMethod,
    message,
    company,
    startedAt,
    quizResult: validateQuizResult(payload.quizResult),
  } satisfies ValidatedContactSubmission;
}
