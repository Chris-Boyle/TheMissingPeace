import Image from "next/image";
import Link from "next/link";
import { PregnancyTimelineTool } from "@/components/pregnancy-timeline/PregnancyTimelineTool";
import { DoulaQuiz } from "@/components/quiz/DoulaQuiz";
import { getTestimonialsForPlacement } from "@/content/testimonials";
import { TestimonialsSection } from "@/components/testimonials/testimonials-section";

const services = [
  {
    title: "Birth Doula Support",
    description:
      "Steady emotional, physical, and informational support from pregnancy through labor and birth.",
  },
  {
    title: "Postpartum Guidance",
    description:
      "A calm check-in space for recovery, newborn transitions, and early family adjustment.",
  },
  {
    title: "Childbirth Education",
    description:
      "Private, practical classes designed to help you make informed decisions with confidence.",
  },
  {
    title: "Bereavement Care",
    description:
      "Compassionate support for families experiencing pregnancy loss, offered free of charge.",
  },
];

const events = [
  {
    title: "Comfort Measures Workshop",
    date: "April 12",
    description:
      "An evening session on breathing, positioning, and partner support tools for labor.",
  },
  {
    title: "Birth Planning Circle",
    date: "April 26",
    description:
      "A small-group conversation focused on preferences, advocacy, and creating a peaceful plan.",
  },
  {
    title: "Postpartum Preparation Chat",
    date: "May 10",
    description:
      "Guidance on recovery rhythms, feeding support, and building a gentle support system at home.",
  },
];

const homepageTestimonials = getTestimonialsForPlacement("homepage", {
  featuredOnly: true,
  limit: 4,
});

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
              <h1 className="mt-5 max-w-xl text-4xl leading-tight text-[#684835] [font-family:Georgia,'Times_New_Roman',serif] sm:text-5xl lg:text-6xl">
                Calm care, clear guidance, and a peaceful presence for your
                growing family.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-[#57453a]">
                The Missing Peace offers doula care rooted in warmth, advocacy,
                and steady reassurance so you can move through pregnancy, birth,
                and postpartum with confidence.
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
        <div className="mx-auto grid w-full max-w-6xl gap-8 rounded-[2rem] bg-[#fffaf5] p-8 shadow-[0_20px_55px_rgba(109,75,54,0.08)] lg:grid-cols-[0.9fr_1.1fr] lg:p-10">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8c6a52]">
              Meet Your Doula
            </p>
            <h2 className="mt-4 text-3xl text-[#684835] [font-family:Georgia,'Times_New_Roman',serif] sm:text-4xl">
              Support that feels informed, grounded, and personal.
            </h2>
          </div>
          <p className="text-lg leading-8 text-[#57453a]">
            As a certified doula, I offer compassionate care that centers your
            choices and your peace. My approach combines practical preparation,
            calm advocacy, and wholehearted presence so you feel heard,
            equipped, and supported from the first planning conversation to the
            earliest days of recovery.
          </p>
        </div>
      </section>

      <PregnancyTimelineTool />

      <DoulaQuiz />

      <TestimonialsSection
        testimonials={homepageTestimonials}
        ctaHref="/contact"
        ctaLabel="Schedule a Consultation"
        includeSchema
      />

      <section className="px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8c6a52]">
              Services
            </p>
            <h2 className="mt-4 text-3xl text-[#684835] [font-family:Georgia,'Times_New_Roman',serif] sm:text-4xl">
              Practical offerings designed to bring steadiness to your journey.
            </h2>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {services.map((service) => (
              <article
                key={service.title}
                className="rounded-[1.75rem] border border-[#e2d5c7] bg-[#fffdfa] p-6 shadow-[0_18px_45px_rgba(109,75,54,0.08)]"
              >
                <h3 className="text-2xl text-[#6d4b36] [font-family:Georgia,'Times_New_Roman',serif]">
                  {service.title}
                </h3>
                <p className="mt-3 text-base leading-7 text-[#57453a]">
                  {service.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="mx-auto max-w-6xl rounded-[2rem] bg-[#f7efe4] p-8 shadow-[0_20px_55px_rgba(109,75,54,0.08)] lg:p-10">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8c6a52]">
                Upcoming Events
              </p>
              <h2 className="mt-4 text-3xl text-[#684835] [font-family:Georgia,'Times_New_Roman',serif] sm:text-4xl">
                Gather, learn, and prepare in a warm community setting.
              </h2>
            </div>
            <Link
              href="/blog"
              className="inline-flex items-center justify-center rounded-full border border-[#cdb6a2] bg-[#fffaf5] px-5 py-3 text-base font-semibold text-[#5c4130] transition hover:bg-white"
            >
              View Resources
            </Link>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {events.map((event) => (
              <article
                key={event.title}
                className="rounded-[1.5rem] bg-[#fffaf5] p-6 shadow-[0_14px_35px_rgba(109,75,54,0.08)]"
              >
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8c6a52]">
                  {event.date}
                </p>
                <h3 className="mt-3 text-2xl text-[#6d4b36] [font-family:Georgia,'Times_New_Roman',serif]">
                  {event.title}
                </h3>
                <p className="mt-3 text-base leading-7 text-[#57453a]">
                  {event.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 pt-10 sm:px-6 lg:px-8 lg:pb-20">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 rounded-[2rem] bg-[#6d4b36] px-8 py-10 text-[#fff8f0] shadow-[0_24px_60px_rgba(73,49,35,0.22)] lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#ead7c4]">
              Ready to begin?
            </p>
            <h2 className="mt-4 text-3xl [font-family:Georgia,'Times_New_Roman',serif] sm:text-4xl">
              Book a consultation and create a support plan that fits your
              family.
            </h2>
          </div>
          <Link
            href="/consultation"
            className="inline-flex items-center justify-center rounded-full bg-[#fff8f0] px-6 py-3 text-base font-semibold text-[#5e4130] transition hover:bg-[#f6eadc]"
          >
            Book a Consultation
          </Link>
        </div>
      </section>
    </div>
  );
}
