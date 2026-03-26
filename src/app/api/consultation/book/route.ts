import { ConsultationBookingError } from "@/lib/consultation-booking/errors";
import { createConsultationBooking } from "@/lib/consultation-booking/service";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Record<string, unknown>;
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
      return Response.json(
        {
          error: error.message,
          code: error.code,
        },
        { status: error.status }
      );
    }

    return Response.json(
      {
        error:
          "We could not complete the booking right now. Please try another time or try again shortly.",
        code: "BOOKING_REQUEST_FAILED",
      },
      { status: 500 }
    );
  }
}
