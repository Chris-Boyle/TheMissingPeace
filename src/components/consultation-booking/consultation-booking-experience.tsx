"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { BookingConfirmation } from "./booking-confirmation";
import { TimeSlotPicker } from "./time-slot-picker";
import type { ConsultationSlot } from "@/lib/consultation-booking/types";

type ConsultationBookingExperienceProps = {
  initialDate: string;
  timeZone: string;
};

type BookingResponse = {
  displayTime: string;
  booking: {
    fullName: string;
    email: string;
  };
};

type FieldErrors = {
  fullName?: string;
  email?: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getEmptyStateMessage(date: string) {
  if (!date) {
    return "Choose a weekday to see available consultation times.";
  }

  return "No consultation times are available for this day. Please try another date.";
}

export function ConsultationBookingExperience(
  props: ConsultationBookingExperienceProps
) {
  const searchParams = useSearchParams();
  const [selectedDate, setSelectedDate] = useState(props.initialDate);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [slots, setSlots] = useState<ConsultationSlot[]>([]);
  const [availabilityError, setAvailabilityError] = useState<string | null>(
    null
  );
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<BookingResponse | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isBookingPending, startBookingTransition] = useTransition();

  const birthPlanSubmissionId = searchParams?.get("birthPlanSubmissionId") || null;

  useEffect(() => {
    const controller = new AbortController();

    async function loadSlots() {
      setIsLoadingSlots(true);
      setAvailabilityError(null);
      setSelectedSlot(null);

      try {
        const response = await fetch(
          `/api/consultation/availability?date=${selectedDate}`,
          {
            signal: controller.signal,
          }
        );
        const payload = (await response.json()) as {
          slots?: ConsultationSlot[];
          error?: string;
        };

        if (!response.ok) {
          throw new Error(
            payload.error ||
              "We could not load consultation times right now. Please try another date."
          );
        }

        setSlots(payload.slots || []);
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        setSlots([]);
        setAvailabilityError(
          error instanceof Error
            ? error.message
            : "We could not load consultation times right now."
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingSlots(false);
        }
      }
    }

    void loadSlots();

    return () => controller.abort();
  }, [selectedDate]);

  const selectedSlotDetails = useMemo(
    () => slots.find((slot) => slot.startTime === selectedSlot) || null,
    [selectedSlot, slots]
  );

  function validateForm() {
    const nextErrors: FieldErrors = {};

    if (!fullName.trim()) {
      nextErrors.fullName = "Please enter your full name.";
    }

    if (!email.trim() || !emailPattern.test(email)) {
      nextErrors.email = "Please enter a valid email address.";
    }

    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBookingError(null);

    if (!selectedSlot) {
      setBookingError("Please choose an available consultation time.");
      return;
    }

    if (!validateForm()) {
      return;
    }

    startBookingTransition(async () => {
      const response = await fetch("/api/consultation/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          notes,
          consultationType: "Initial Consultation",
          birthPlanSubmissionId,
          startTime: selectedSlot,
        }),
      });

      const payload = (await response.json()) as
        | BookingResponse
        | { error?: string };

      if (!response.ok) {
        setBookingError(
          "error" in payload && payload.error
            ? payload.error
            : "We could not complete the booking right now."
        );
        return;
      }

      setConfirmation(payload as BookingResponse);
      setBookingError(null);
    });
  }

  if (confirmation) {
    return (
      <BookingConfirmation
        fullName={confirmation.booking.fullName}
        email={confirmation.booking.email}
        displayTime={confirmation.displayTime}
      />
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
      <section className="rounded-[2rem] bg-[#6d4b36] p-8 text-[#fff8f0] shadow-[0_24px_60px_rgba(73,49,35,0.22)]">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#ead7c4]">
          Consultation Booking
        </p>
        <h2 className="mt-4 text-3xl [font-family:Georgia,'Times_New_Roman',serif]">
          A calm first step toward personalized support.
        </h2>
        <p className="mt-4 text-base leading-7 text-[#f6e8da]">
          Choose a time that feels manageable, share a few details, and reserve a
          private consultation directly on the site.
        </p>
        <div className="mt-8 rounded-[1.75rem] bg-[rgba(255,248,240,0.08)] p-5">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#ead7c4]">
            What this consultation is for
          </p>
          <p className="mt-3 text-sm leading-7 text-[#f6e8da]">
            We will talk through your goals, answer early questions, and explore
            how doula support could fit your birth and postpartum plans.
          </p>
          <ul className="mt-4 space-y-2 text-sm leading-6 text-[#fff3e8]">
            <li>30-minute consultation</li>
            <li>Weekday availability</li>
            <li>Times shown in {props.timeZone}</li>
          </ul>
        </div>
      </section>

      <section className="rounded-[2rem] border border-[#e2d5c7] bg-[#fffaf5] p-6 shadow-[0_20px_55px_rgba(109,75,54,0.08)] sm:p-8">
        <div className="grid gap-8">
          <div>
            <label
              htmlFor="consultation-date"
              className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8c6a52]"
            >
              Select a date
            </label>
            <input
              id="consultation-date"
              type="date"
              min={props.initialDate}
              value={selectedDate}
              onChange={(event) => setSelectedDate(event.target.value)}
              className="mt-3 w-full rounded-2xl border border-[#dccfc1] bg-white px-4 py-3 text-base text-[#4b3527] focus:outline-none focus:ring-2 focus:ring-[#a08c7d]"
            />
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8c6a52]">
              Available times
            </p>
            <div className="mt-3">
              <TimeSlotPicker
                slots={slots}
                selectedSlot={selectedSlot}
                onSelect={setSelectedSlot}
                isLoading={isLoadingSlots}
                error={availabilityError}
                emptyMessage={getEmptyStateMessage(selectedDate)}
              />
            </div>
          </div>

          <form className="grid gap-5" onSubmit={handleSubmit} noValidate>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8c6a52]">
                A few details
              </p>
              <p className="mt-2 text-sm leading-6 text-[#6f5a4c]">
                This helps keep your booking organized and prepares us to connect
                it later with your birth plan workflow.
              </p>
            </div>

            <div>
              <label
                htmlFor="consultation-full-name"
                className="mb-1 block text-sm font-medium text-[#3d2c1e]"
              >
                Full name
              </label>
              <input
                id="consultation-full-name"
                value={fullName}
                onChange={(event) => {
                  setFullName(event.target.value);
                  setFieldErrors((current) => ({ ...current, fullName: undefined }));
                }}
                className="w-full rounded-2xl border border-[#dccfc1] bg-white px-4 py-3 text-base text-[#4b3527] focus:outline-none focus:ring-2 focus:ring-[#a08c7d]"
                autoComplete="name"
              />
              {fieldErrors.fullName ? (
                <p className="mt-2 text-sm text-[#9a4f3e]">
                  {fieldErrors.fullName}
                </p>
              ) : null}
            </div>

            <div>
              <label
                htmlFor="consultation-email"
                className="mb-1 block text-sm font-medium text-[#3d2c1e]"
              >
                Email
              </label>
              <input
                id="consultation-email"
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setFieldErrors((current) => ({ ...current, email: undefined }));
                }}
                className="w-full rounded-2xl border border-[#dccfc1] bg-white px-4 py-3 text-base text-[#4b3527] focus:outline-none focus:ring-2 focus:ring-[#a08c7d]"
                autoComplete="email"
              />
              {fieldErrors.email ? (
                <p className="mt-2 text-sm text-[#9a4f3e]">{fieldErrors.email}</p>
              ) : null}
            </div>

            <div>
              <label
                htmlFor="consultation-phone"
                className="mb-1 block text-sm font-medium text-[#3d2c1e]"
              >
                Phone (optional)
              </label>
              <input
                id="consultation-phone"
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                className="w-full rounded-2xl border border-[#dccfc1] bg-white px-4 py-3 text-base text-[#4b3527] focus:outline-none focus:ring-2 focus:ring-[#a08c7d]"
                autoComplete="tel"
              />
            </div>

            <div>
              <label
                htmlFor="consultation-notes"
                className="mb-1 block text-sm font-medium text-[#3d2c1e]"
              >
                Short note (optional)
              </label>
              <textarea
                id="consultation-notes"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                rows={4}
                className="w-full rounded-2xl border border-[#dccfc1] bg-white px-4 py-3 text-base text-[#4b3527] focus:outline-none focus:ring-2 focus:ring-[#a08c7d]"
              />
            </div>

            {selectedSlotDetails ? (
              <p className="rounded-2xl bg-[#f7efe4] px-4 py-3 text-sm text-[#6d4b36]">
                Selected time:{" "}
                <span className="font-semibold">{selectedSlotDetails.label}</span>{" "}
                on {selectedDate}
              </p>
            ) : null}

            {bookingError ? (
              <p className="rounded-2xl bg-[#fff3ef] px-4 py-3 text-sm text-[#9a4f3e]">
                {bookingError}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={isBookingPending || isLoadingSlots}
              className="inline-flex items-center justify-center rounded-full bg-[#7d5c3c] px-6 py-3 text-base font-semibold text-[#fffaf5] transition hover:bg-[#694a30] disabled:cursor-not-allowed disabled:bg-[#b4a193]"
            >
              {isBookingPending ? "Confirming..." : "Confirm Consultation"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
