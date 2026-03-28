import {
  jsonConsultationErrorResponse,
  sanitizeConsultationError,
} from "@/lib/consultation-booking/api";
import { ConsultationBookingError } from "@/lib/consultation-booking/errors";
import {
  applyConsultationRateLimit,
  buildConsultationRateLimitHeaders,
  CONSULTATION_SECURITY_CONFIG,
  getBodySizeFromRequest,
} from "@/lib/consultation-booking/security";
import { createConsultationBooking } from "@/lib/consultation-booking/service";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const rateLimit = await applyConsultationRateLimit(request, "booking");

    if (!rateLimit.allowed) {
      return jsonConsultationErrorResponse(
        "Too many booking attempts were made from this device. Please wait a moment and try again.",
        429,
        "RATE_LIMITED",
        buildConsultationRateLimitHeaders(rateLimit.retryAfterSeconds)
      );
    }

    let rawBody = "";

    try {
      rawBody = await request.text();
    } catch {
      return jsonConsultationErrorResponse(
        "Invalid request payload.",
        400,
        "INVALID_JSON"
      );
    }

    if (!rawBody.trim()) {
      return jsonConsultationErrorResponse(
        "Invalid request payload.",
        400,
        "INVALID_JSON"
      );
    }

    const bodySize = getBodySizeFromRequest(request, rawBody);

    if (bodySize > CONSULTATION_SECURITY_CONFIG.maxBodyBytes) {
      return jsonConsultationErrorResponse(
        "Invalid booking request.",
        400,
        "PAYLOAD_TOO_LARGE"
      );
    }

    let payload: Record<string, unknown>;

    try {
      payload = JSON.parse(rawBody) as Record<string, unknown>;
    } catch {
      return jsonConsultationErrorResponse(
        "Invalid request payload.",
        400,
        "INVALID_JSON"
      );
    }

    const result = await createConsultationBooking({
      fullName:
        typeof payload.fullName === "string" ? payload.fullName : undefined,
      email: typeof payload.email === "string" ? payload.email : undefined,
      phone: typeof payload.phone === "string" ? payload.phone : undefined,
      notes: typeof payload.notes === "string" ? payload.notes : undefined,
      consultationType:
        typeof payload.consultationType === "string"
          ? payload.consultationType
          : undefined,
      birthPlanSubmissionId:
        typeof payload.birthPlanSubmissionId === "string"
          ? payload.birthPlanSubmissionId
          : undefined,
      startTime:
        typeof payload.startTime === "string" ? payload.startTime : undefined,
    });

    return Response.json(result, { status: 201 });
  } catch (error) {
    if (error instanceof ConsultationBookingError) {
      const sanitized = sanitizeConsultationError(error);
      return jsonConsultationErrorResponse(
        sanitized.message,
        sanitized.status,
        sanitized.code
      );
    }

    console.error("Consultation booking request failed", error);

    return jsonConsultationErrorResponse(
      "We could not complete the booking right now. Please try another time or try again shortly.",
      500,
      "BOOKING_REQUEST_FAILED"
    );
  }
}
