import type { Testimonial } from "@/content/testimonials";

type TestimonialCardProps = {
  testimonial: Testimonial;
  variant?: "excerpt" | "quote" | "full";
  compact?: boolean;
};

export function TestimonialCard({
  testimonial,
  variant = "quote",
  compact = false,
}: TestimonialCardProps) {
  const quote =
    variant === "full" && testimonial.fullQuote
      ? testimonial.fullQuote
      : testimonial.quote;

  return (
    <article
      className={[
        "relative flex h-full flex-col rounded-[1.75rem] border border-[#e2d5c7]",
        "bg-[linear-gradient(180deg,rgba(255,253,250,0.98)_0%,rgba(248,239,230,0.92)_100%)]",
        compact ? "p-5 shadow-[0_14px_34px_rgba(109,75,54,0.08)]" : "p-6 shadow-[0_18px_45px_rgba(109,75,54,0.08)]",
      ].join(" ")}
    >
      <div className="flex items-center justify-between gap-4">
        <div
          className="inline-flex items-center gap-1 text-sm tracking-[0.18em] text-[#d5a54a]"
          aria-label={`${testimonial.starRating} out of 5 stars`}
        >
          {Array.from({ length: testimonial.starRating }).map((_, index) => (
            <span key={index} aria-hidden="true">
              ★
            </span>
          ))}
        </div>
        <span className="rounded-full border border-[#ead9c6] bg-white/80 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[#8c6a52]">
          {testimonial.reviewSource} Review
        </span>
      </div>

      <blockquote
        className={[
          "mt-5 flex-1 text-[#57453a]",
          compact ? "text-[0.98rem] leading-7" : "text-base leading-7",
        ].join(" ")}
      >
        <p>&ldquo;{quote}&rdquo;</p>
      </blockquote>

      <footer className="mt-5 border-t border-[#eadbcf] pt-4">
        <p className="text-base font-semibold text-[#6d4b36]">
          {testimonial.reviewerName}
        </p>
        {testimonial.location ? (
          <p className="mt-1 text-sm text-[#7d6554]">{testimonial.location}</p>
        ) : null}
      </footer>
    </article>
  );
}
