import type { ConsultationStatus } from "./config";

export type BusyInterval = {
  start: string;
  end: string;
  source?: "google" | "database";
};

export type ConsultationSlot = {
  startTime: string;
  endTime: string;
  label: string;
};

export type ConsultationAvailabilityResult = {
  date: string;
  timeZone: string;
  slots: ConsultationSlot[];
};

export type ConsultationBookingInput = {
  fullName: string;
  email: string;
  phone?: string;
  notes?: string;
  consultationType?: string;
  birthPlanSubmissionId?: string | null;
  startTime: string;
};

export type ConsultationBookingRecord = {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  consultationType: string | null;
  notes: string | null;
  birthPlanSubmissionId: string | null;
  googleCalendarEventId: string | null;
  startTime: string;
  endTime: string;
  timezone: string;
  status: ConsultationStatus;
  createdAt: string;
  updatedAt: string;
};

export type ConsultationBookingConfirmation = {
  booking: ConsultationBookingRecord;
  displayTime: string;
};
