import Link from "next/link";
import type { Testimonial } from "@/content/testimonials";
import { TestimonialCard } from "./testimonial-card";
import { ReviewSchemaScript } from "./review-schema-script";

type ContextualTestimonialStripProps = {
  heading: string;
  intro: string;
  testimonials: Testimonial[];
  ctaHref?: string;
  ctaLabel?: string;
  className?: string;
  headingId?: string;
  includeSchema?: boolean;
};

export function ContextualTestimonialStrip({
  heading,
  intro,
  testimonials,
  ctaHref,
  ctaLabel,
  className = "",
  headingId = "contextual-testimonials-heading",
  includeSchema = false,
}: ContextualTestimonialStripProps) {
  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section
      className={className}
      aria-labelledby={headingId}
    >
      {includeSchema ? <ReviewSchemaScript testimonials={testimonials} /> : null}

      <div className="rounded-[2rem] border border-[#e4d7ca] bg-[linear-gradient(180deg,#fffaf5_0%,#f4eadf_100%)] p-6 shadow-[0_18px_40px_rgba(109,75,54,0.08)] sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8c6a52]">
              Voices from Google Reviews
            </p>
            <h2
              id={headingId}
              className="mt-3 text-3xl text-[#684835] [font-family:Georgia,'Times_New_Roman',serif] sm:text-4xl"
            >
              {heading}
            </h2>
            <p className="mt-3 text-base leading-7 text-[#5a493d] sm:text-lg">
              {intro}
            </p>
          </div>

          {ctaHref && ctaLabel ? (
            <Link
              href={ctaHref}
              className="inline-flex items-center justify-center rounded-full border border-[#cdb6a2] bg-[#fffaf5] px-5 py-3 text-base font-semibold text-[#5c4130] transition hover:bg-white"
            >
              {ctaLabel}
            </Link>
          ) : null}
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {testimonials.map((testimonial) => (
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
              compact
            />
          ))}
        </div>
      </div>
    </section>
  );
}
