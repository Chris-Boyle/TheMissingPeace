import Image from "next/image";
import Link from "next/link";
import { getTestimonialsForPlacement } from "@/content/testimonials";
import { ReviewSchemaScript } from "@/components/testimonials/review-schema-script";

const homepageTestimonials = getTestimonialsForPlacement("homepage", {
  featuredOnly: true,
  limit: 3,
});

const trustPoints = [
  "Certified birth and VBAC doula support rooted in calm advocacy",
  "Thoughtful guidance for pregnancy, labor, birth, and early postpartum",
  "Tools and planning support that help families feel prepared without pressure",
];

const timelineHighlights = [
  "See where you are now in pregnancy and what may feel helpful next.",
  "Use the full timeline page when you want a calmer, more grounded sense of timing.",
];

export default function Home() {
  return (
    <div className="bg-[#fcf8f3] text-[#35271f]">
      <section className="overflow-hidden px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="relative">
            <div className="absolute -left-6 top-10 hidden h-32 w-32 rounded-full bg-[#efe1d0] blur-2xl sm:block" />
            <div className="absolute bottom-0 right-0 hidden h-40 w-40 rounded-full bg-[#f6eadc] blur-3xl sm:block" />
            <div className="relative rounded-[2rem] bg-[linear-gradient(180deg,#fffaf5_0%,#f6eee3_100%)] p-8 shadow-[0_28px_70px_rgba(109,75,54,0.12)] sm:p-10">
              <Image
                src="/the-missing-peace-logo.webp"
                alt="The Missing Peace Birth Doula"
                width={420}
                height={210}
                priority
                sizes="(min-width: 640px) 280px, 220px"
                className="mx-auto h-auto w-[220px] sm:w-[280px]"
              />
              <p className="mt-4 text-sm font-semibold uppercase tracking-[0.24em] text-[#8c6a52]">
                Gentle support for every season of birth
              </p>
              <h1 className="mt-5 max-w-3xl text-4xl leading-tight text-[#684835] [font-family:Georgia,'Times_New_Roman',serif] sm:text-5xl lg:text-6xl">
                Calm care, clear guidance, and a peaceful presence for your
                growing family.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-[#57453a]">
                The Missing Peace offers warm, grounded doula support so you can
                move through pregnancy and birth feeling informed, reassured, and
                well supported.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/consultation"
                  className="inline-flex items-center justify-center rounded-full bg-[#7d5c3c] px-6 py-3 text-base font-semibold text-[#fffaf5] transition hover:bg-[#694a30]"
                >
                  Book a Consultation
                </Link>
                <Link
                  href="/services"
                  className="inline-flex items-center justify-center rounded-full border border-[#cdb6a2] bg-white/70 px-6 py-3 text-base font-semibold text-[#5c4130] transition hover:bg-[#f7ecdf]"
                >
                  Explore Services
                </Link>
              </div>
            </div>
          </div>

          <div className="mx-auto w-full max-w-xl">
            <div className="relative overflow-hidden rounded-[2rem] border border-[#e2d5c7] bg-[#fffaf5] p-4 shadow-[0_24px_60px_rgba(109,75,54,0.12)]">
              <div className="absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,rgba(246,234,220,0.9),rgba(246,234,220,0))]" />
              <Image
                src="/welcoming-doula.svg"
                alt="Welcoming portrait illustration of a doula holding a newborn"
                width={900}
                height={1100}
                priority
                className="h-auto w-full rounded-[1.5rem] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="mx-auto grid w-full max-w-6xl gap-10 rounded-[2rem] bg-[#fffaf5] p-8 shadow-[0_20px_55px_rgba(109,75,54,0.08)] lg:grid-cols-[0.88fr_1.12fr] lg:p-12">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8c6a52]">
              Why families choose this support
            </p>
            <h2 className="mt-4 text-3xl text-[#684835] [font-family:Georgia,'Times_New_Roman',serif] sm:text-4xl">
              Support that feels steady, personal, and deeply informed.
            </h2>
          </div>
          <div className="max-w-3xl">
            <p className="text-lg leading-8 text-[#57453a]">
              This support is designed to bring clarity without overwhelm,
              helping families feel more grounded in their choices, more
              prepared for labor, and more cared for through every shift in the
              plan.
            </p>
            <ul className="mt-8 divide-y divide-[#eadbcf] border-y border-[#eadbcf]">
              {trustPoints.map((point) => (
                <li
                  key={point}
                  className="py-4 text-base leading-7 text-[#5d4a3e]"
                >
                  {point}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <Link
                href="/consultation"
                className="inline-flex items-center justify-center rounded-full bg-[#7d5c3c] px-6 py-3 text-base font-semibold text-[#fffaf5] transition hover:bg-[#694a30]"
              >
                Book a Consultation
              </Link>
              <Link
                href="/birth-plan-builder"
                className="inline-flex items-center justify-center rounded-full border border-[#d7c3b0] bg-transparent px-6 py-3 text-base font-semibold text-[#6a4a36] transition hover:bg-[#f7ecdf]"
              >
                Build Your Birth Plan
              </Link>
              <Link
                href="/about"
                className="text-sm font-medium text-[#7b624f] underline decoration-[#ccb39b] underline-offset-4 transition hover:text-[#5c4130]"
              >
                Meet Your Doula
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="mx-auto grid max-w-6xl gap-10 rounded-[2rem] bg-[#f7efe4] p-8 shadow-[0_20px_55px_rgba(109,75,54,0.08)] lg:grid-cols-[0.9fr_1.1fr] lg:p-12">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8c6a52]">
              Not sure where to start?
            </p>
            <h2 className="mt-4 text-3xl text-[#684835] [font-family:Georgia,'Times_New_Roman',serif] sm:text-4xl">
              Start with your pregnancy timeline and get your bearings.
            </h2>
            <p className="mt-4 text-lg leading-8 text-[#57453a]">
              If you want a gentle place to begin, the pregnancy timeline gives
              you a clearer sense of what stage you are in and what to prepare
              for next.
            </p>
          </div>
          <div className="max-w-3xl">
            <ul className="mt-1 divide-y divide-[#e2d5c7] border-y border-[#e2d5c7]">
              {timelineHighlights.map((point) => (
                <li
                  key={point}
                  className="py-4 text-base leading-7 text-[#5d4a3e]"
                >
                  {point}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <Link
                href="/pregnancy-timeline"
                className="inline-flex items-center justify-center rounded-full bg-[#7d5c3c] px-6 py-3 text-base font-semibold text-[#fffaf5] transition hover:bg-[#694a30]"
              >
                View Your Pregnancy Timeline
              </Link>
            </div>
            <div className="mt-8 border-t border-[#dccdbd] pt-6">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8c6a52]">
                Not sure if a doula is right for you?
              </p>
              <p className="mt-3 max-w-2xl text-base leading-7 text-[#5d4a3e]">
                Take a quick quiz to see what kind of support would feel most
                helpful for your birth.
              </p>
              <Link
                href="/quiz"
                className="mt-4 inline-flex items-center justify-center rounded-full border border-[#d7c3b0] bg-transparent px-5 py-2.5 text-sm font-semibold text-[#6a4a36] transition hover:bg-[#f7ecdf]"
              >
                Take the Quiz
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <section
          className="mx-auto max-w-6xl border-t border-[#eadbcf] pt-10 lg:pt-12"
          aria-labelledby="homepage-trust-heading"
        >
          <ReviewSchemaScript testimonials={homepageTestimonials} />
          <div className="grid gap-10 lg:grid-cols-[0.88fr_1.12fr]">
            <div className="max-w-xl">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8c6a52]">
                What families carried with them
              </p>
              <h2
                id="homepage-trust-heading"
                className="mt-4 text-3xl text-[#684835] [font-family:Georgia,'Times_New_Roman',serif] sm:text-4xl"
              >
                Reassurance, advocacy, and steadiness when it mattered most.
              </h2>
              <p className="mt-4 text-lg leading-8 text-[#57453a]">
                For families still deciding what kind of support they need, this
                is often the clearest picture of what the experience actually
                felt like.
              </p>
              <Link
                href="/consultation"
                className="mt-8 inline-flex items-center text-sm font-medium text-[#7b624f] underline decoration-[#ccb39b] underline-offset-4 transition hover:text-[#5c4130]"
              >
                Book a Consultation
              </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {homepageTestimonials.map((testimonial) => (
                <article
                  key={testimonial.id}
                  className="border-t border-[#e2d5c7] pt-5"
                >
                  <p className="text-sm tracking-[0.16em] text-[#d5a54a]">
                    {"★".repeat(testimonial.starRating)}
                  </p>
                  <blockquote className="mt-4 text-base leading-7 text-[#57453a]">
                    <p>&ldquo;{testimonial.quote}&rdquo;</p>
                  </blockquote>
                  <p className="mt-4 text-sm font-semibold text-[#6d4b36]">
                    {testimonial.reviewerName}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </section>

      <section className="px-4 pb-16 pt-10 sm:px-6 lg:px-8 lg:pb-20">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 rounded-[2rem] bg-[#6d4b36] px-8 py-10 text-[#fff8f0] shadow-[0_24px_60px_rgba(73,49,35,0.22)] lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#ead7c4]">
              Ready to begin?
            </p>
            <h2 className="mt-4 text-3xl [font-family:Georgia,'Times_New_Roman',serif] sm:text-4xl">
              Book a consultation or start building a plan that helps you feel
              more grounded before birth.
            </h2>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              href="/consultation"
              className="inline-flex items-center justify-center rounded-full bg-[#fff8f0] px-6 py-3 text-base font-semibold text-[#5e4130] transition hover:bg-[#f6eadc]"
            >
              Book a Consultation
            </Link>
            <Link
              href="/birth-plan-builder"
              className="inline-flex items-center justify-center rounded-full border border-[#d9c0ad] bg-[rgba(255,248,240,0.08)] px-6 py-3 text-base font-semibold text-[#fff7ef] transition hover:bg-[rgba(255,248,240,0.14)]"
            >
              Build Your Birth Plan
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
