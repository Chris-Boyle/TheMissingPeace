import { ConsultationBookingError } from "@/lib/consultation-booking/errors";
import {
  applyContactRateLimit,
  buildRateLimitHeaders,
  CONTACT_SECURITY_CONFIG,
  getBodySizeFromRequest,
} from "@/lib/contact-security";
import { sendContactEmails } from "@/lib/email/send-contact-email";
import { validateContactSubmission } from "@/lib/validation/contact";

export const runtime = "nodejs";

function jsonErrorResponse(
  message: string,
  status: number,
  code: string,
  headers?: HeadersInit
) {
  return Response.json(
    {
      error: message,
      code,
    },
    {
      status,
      headers,
    }
  );
}

export async function POST(request: Request) {
  try {
    const rateLimit = await applyContactRateLimit(request);

    if (!rateLimit.allowed) {
      return jsonErrorResponse(
        "Too many messages were sent from this device. Please try again in a little while.",
        429,
        "RATE_LIMITED",
        buildRateLimitHeaders(rateLimit.resetAt)
      );
    }
  } catch (error) {
    console.error("Contact security check failed", {
      error,
    });

    return jsonErrorResponse(
      "Something went wrong sending your message. Please try again in a moment.",
      500,
      "CONTACT_SUBMISSION_FAILED"
    );
  }

  let rawBody = "";

  try {
    rawBody = await request.text();
  } catch {
    return jsonErrorResponse("Invalid request payload.", 400, "INVALID_JSON");
  }

  if (!rawBody.trim()) {
    return jsonErrorResponse("Invalid request payload.", 400, "INVALID_JSON");
  }

  const bodySize = getBodySizeFromRequest(request, rawBody);

  if (bodySize > CONTACT_SECURITY_CONFIG.maxBodyBytes) {
    return jsonErrorResponse("Invalid submission.", 400, "PAYLOAD_TOO_LARGE");
  }

  let payload: unknown;

  try {
    payload = JSON.parse(rawBody) as unknown;
  } catch {
    return jsonErrorResponse("Invalid request payload.", 400, "INVALID_JSON");
  }

  try {
    const submission = validateContactSubmission(payload as Record<string, unknown>);

    if (
      submission.startedAt &&
      Date.now() - new Date(submission.startedAt).getTime() <
        CONTACT_SECURITY_CONFIG.minimumCompletionMs
    ) {
      return jsonErrorResponse("Invalid submission.", 400, "SUBMISSION_TOO_FAST");
    }

    await sendContactEmails(submission);

    return Response.json({
      success: true,
      message:
        "Thanks for reaching out. We received your message and sent a confirmation to your email.",
    });
  } catch (error) {
    if (error instanceof ConsultationBookingError) {
      return jsonErrorResponse(error.message, error.status, error.code);
    }

    console.error("Contact submission failed", {
      error,
      hasBody: Boolean(rawBody),
    });

    return jsonErrorResponse(
      "Something went wrong sending your message. Please try again in a moment.",
      500,
      "CONTACT_SUBMISSION_FAILED"
    );
  }
}
