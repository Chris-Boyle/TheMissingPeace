export class ConsultationBookingError extends Error {
  status: number;
  code: string;

  constructor(message: string, options?: { status?: number; code?: string }) {
    super(message);
    this.name = "ConsultationBookingError";
    this.status = options?.status ?? 400;
    this.code = options?.code ?? "CONSULTATION_BOOKING_ERROR";
  }
}
