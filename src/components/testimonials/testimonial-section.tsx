import Link from "next/link";
import type { Testimonial } from "@/content/testimonials";
import {
  featuredTestimonials,
  getVideoTestimonials,
} from "@/content/testimonials";
import { ReviewSchemaScript } from "./review-schema-script";
import { TestimonialCard } from "./testimonial-card";
import { VideoTestimonialCard } from "./video-testimonial-card";

type TestimonialSectionProps = {
  heading?: string;
  intro?: string;
  testimonials?: Testimonial[];
  variant?: "excerpt" | "quote" | "full";
  ctaHref?: string;
  ctaLabel?: string;
  className?: string;
  headingId?: string;
  includeSchema?: boolean;
  showFeaturedVideo?: boolean;
};

export function TestimonialSection({
  heading = "Families feel supported, informed, and cared for",
  intro = "Pregnancy, birth, and postpartum can bring a lot of questions, emotions, and decisions. These families shared what it was like to have Meagan by their side.",
  testimonials = featuredTestimonials,
  variant = "quote",
  ctaHref,
  ctaLabel,
  className = "px-4 py-10 sm:px-6 lg:px-8 lg:py-14",
  headingId = "testimonials-heading",
  includeSchema = false,
  showFeaturedVideo = true,
}: TestimonialSectionProps) {
  const featuredVideo = showFeaturedVideo
    ? getVideoTestimonials({ featuredOnly: true, limit: 1 })[0]
    : undefined;

  return (
    <section className={className} aria-labelledby={headingId}>
      {includeSchema ? <ReviewSchemaScript testimonials={testimonials} /> : null}

      <div className="mx-auto max-w-6xl rounded-[2rem] bg-[linear-gradient(180deg,#fffaf5_0%,#f4eadf_100%)] p-8 shadow-[0_20px_55px_rgba(109,75,54,0.08)] lg:p-10">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-3 rounded-full border border-[#e3d4c4] bg-white/75 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#8c6a52]">
              <span className="h-2 w-2 rounded-full bg-[#d5a54a]" aria-hidden="true" />
              Google Reviews
            </div>
            <h2
              id={headingId}
              className="mt-5 text-3xl text-[#684835] [font-family:Georgia,'Times_New_Roman',serif] sm:text-4xl"
            >
              {heading}
            </h2>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-[#57453a]">
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

        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {testimonials.map((testimonial) => (
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
              variant={variant}
            />
          ))}
        </div>

        {featuredVideo ? (
          <div className="mt-8 border-t border-[#e4d7ca] pt-8">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8c6a52]">
                Video Story
              </p>
              <h3 className="mt-3 text-2xl text-[#684835] [font-family:Georgia,'Times_New_Roman',serif] sm:text-3xl">
                See how the support felt in real time.
              </h3>
            </div>
            <div className="mt-6 max-w-3xl">
              <VideoTestimonialCard testimonial={featuredVideo} />
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

export { TestimonialSection as TestimonialsSection };
