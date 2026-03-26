import { Suspense } from "react";
import { ConsultationBookingExperience } from "@/components/consultation-booking/consultation-booking-experience";
import {
  CONSULTATION_CONFIG,
  getConsultationTimeZone,
} from "@/lib/consultation-booking/config";
import { getNextBookableDate } from "@/lib/consultation-booking/time";

function ConsultationBookingFallback() {
  return (
    <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr]" aria-hidden="true">
      <section className="rounded-[2rem] bg-[#6d4b36] p-8 text-[#fff8f0] shadow-[0_24px_60px_rgba(73,49,35,0.22)]">
        <div className="h-4 w-36 rounded-full bg-[rgba(255,248,240,0.24)]" />
        <div className="mt-5 h-10 w-3/4 rounded-full bg-[rgba(255,248,240,0.18)]" />
        <div className="mt-4 h-4 w-full rounded-full bg-[rgba(255,248,240,0.14)]" />
        <div className="mt-3 h-4 w-5/6 rounded-full bg-[rgba(255,248,240,0.14)]" />
      </section>

      <section className="rounded-[2rem] border border-[#e2d5c7] bg-[#fffaf5] p-6 shadow-[0_20px_55px_rgba(109,75,54,0.08)] sm:p-8">
        <div className="space-y-5">
          <div className="h-4 w-28 rounded-full bg-[#efe4d8]" />
          <div className="h-14 w-full rounded-[1.25rem] bg-[#f4ede5]" />
          <div className="h-4 w-32 rounded-full bg-[#efe4d8]" />
          <div className="h-40 w-full rounded-[1.5rem] bg-[#f8f1ea]" />
          <div className="h-56 w-full rounded-[1.5rem] bg-[#f4ede5]" />
        </div>
      </section>
    </div>
  );
}

export default function ConsultationPage() {
  const timeZone = getConsultationTimeZone();
  const initialDate = getNextBookableDate(timeZone);

  return (
    <div className="bg-[#fcf8f3] px-4 py-12 text-[#35271f] sm:px-6 lg:px-8 lg:py-16">
      <section className="mx-auto max-w-6xl">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8c6a52]">
            Book a Consultation
          </p>
          <h1 className="mt-4 text-4xl text-[#684835] [font-family:Georgia,'Times_New_Roman',serif] sm:text-5xl">
            Reserve a thoughtful conversation without leaving the site.
          </h1>
          <p className="mt-6 text-lg leading-8 text-[#57453a]">
            Choose a weekday time that works for you, and we will hold a{" "}
            {CONSULTATION_CONFIG.durationMinutes}-minute consultation directly on
            the business calendar.
          </p>
        </div>

        <div className="mt-10">
          <Suspense fallback={<ConsultationBookingFallback />}>
            <ConsultationBookingExperience
              initialDate={initialDate}
              timeZone={timeZone}
            />
          </Suspense>
        </div>
      </section>
    </div>
  );
}
