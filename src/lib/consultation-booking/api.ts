import { ConsultationBookingError } from "./errors";

export function jsonConsultationErrorResponse(
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

export function sanitizeConsultationError(error: ConsultationBookingError) {
  if (error.status >= 500) {
    return {
      message:
        "We could not complete that request right now. Please try again shortly.",
      status: error.status,
      code: error.code,
    };
  }

  return {
    message: error.message,
    status: error.status,
    code: error.code,
  };
}
