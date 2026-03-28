import {
  jsonConsultationErrorResponse,
  sanitizeConsultationError,
} from "@/lib/consultation-booking/api";
import { ConsultationBookingError } from "@/lib/consultation-booking/errors";
import {
  applyConsultationRateLimit,
  buildConsultationRateLimitHeaders,
  CONSULTATION_SECURITY_CONFIG,
} from "@/lib/consultation-booking/security";
import { getAvailableConsultationSlots } from "@/lib/consultation-booking/service";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const rateLimit = await applyConsultationRateLimit(request, "availability");

    if (!rateLimit.allowed) {
      return jsonConsultationErrorResponse(
        "Consultation times are loading too often from this device. Please try again in a moment.",
        429,
        "RATE_LIMITED",
        buildConsultationRateLimitHeaders(rateLimit.retryAfterSeconds)
      );
    }

    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");

    if (!date) {
      throw new ConsultationBookingError("A date query parameter is required.", {
        status: 400,
        code: "DATE_REQUIRED",
        });
    }

    if (date.length > CONSULTATION_SECURITY_CONFIG.maxDateQueryLength) {
      throw new ConsultationBookingError("Please choose a valid date.", {
        status: 400,
        code: "INVALID_DATE",
      });
    }

    const availability = await getAvailableConsultationSlots(date);
    return Response.json(availability);
  } catch (error) {
    if (error instanceof ConsultationBookingError) {
      const sanitized = sanitizeConsultationError(error);
      return jsonConsultationErrorResponse(
        sanitized.message,
        sanitized.status,
        sanitized.code
      );
    }

    console.error("Consultation availability request failed", error);

    return jsonConsultationErrorResponse(
      "We could not load consultation times right now. Please try again shortly.",
      500,
      "AVAILABILITY_REQUEST_FAILED"
    );
  }
}
