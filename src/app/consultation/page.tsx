import { ConsultationBookingExperience } from "@/components/consultation-booking/consultation-booking-experience";
import {
  CONSULTATION_CONFIG,
  getConsultationTimeZone,
} from "@/lib/consultation-booking/config";
import { getNextBookableDate } from "@/lib/consultation-booking/time";

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
          <ConsultationBookingExperience
            initialDate={initialDate}
            timeZone={timeZone}
          />
        </div>
      </section>
    </div>
  );
}
