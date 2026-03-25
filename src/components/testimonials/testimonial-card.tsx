import type { Testimonial } from "./testimonials-data";

type TestimonialCardProps = {
  testimonial: Testimonial;
  variant?: "excerpt" | "full";
};

export function TestimonialCard({
  testimonial,
  variant = "excerpt",
}: TestimonialCardProps) {
  const quote =
    variant === "full" && testimonial.fullQuote
      ? testimonial.fullQuote
      : testimonial.excerpt;

  return (
    <article className="relative flex h-full flex-col rounded-[1.75rem] border border-[#e2d5c7] bg-[linear-gradient(180deg,rgba(255,253,250,0.98)_0%,rgba(248,239,230,0.92)_100%)] p-6 shadow-[0_18px_45px_rgba(109,75,54,0.08)]">
      <div className="flex items-center justify-between gap-4">
        <div
          className="inline-flex items-center gap-1 text-sm tracking-[0.18em] text-[#d5a54a]"
          aria-label="5 out of 5 stars"
        >
          <span aria-hidden="true">★</span>
          <span aria-hidden="true">★</span>
          <span aria-hidden="true">★</span>
          <span aria-hidden="true">★</span>
          <span aria-hidden="true">★</span>
        </div>
        <span className="rounded-full border border-[#ead9c6] bg-white/80 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[#8c6a52]">
          {testimonial.sourceLabel ?? "Review"}
        </span>
      </div>

      <blockquote className="mt-5 flex-1 text-base leading-7 text-[#57453a]">
        <p>&ldquo;{quote}&rdquo;</p>
      </blockquote>

      <footer className="mt-5 border-t border-[#eadbcf] pt-4">
        <p className="text-base font-semibold text-[#6d4b36]">
          {testimonial.reviewerName}
        </p>
      </footer>
    </article>
  );
}
