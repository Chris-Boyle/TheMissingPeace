import { ConsultationBookingError } from "@/lib/consultation-booking/errors";
import { getAvailableConsultationSlots } from "@/lib/consultation-booking/service";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");

    if (!date) {
      throw new ConsultationBookingError("A date query parameter is required.", {
        status: 400,
        code: "DATE_REQUIRED",
      });
    }

    const availability = await getAvailableConsultationSlots(date);
    return Response.json(availability);
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
          "We could not load consultation times right now. Please try again shortly.",
        code: "AVAILABILITY_REQUEST_FAILED",
      },
      { status: 500 }
    );
  }
}
