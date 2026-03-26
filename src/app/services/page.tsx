import Link from "next/link";
import { ContextualTestimonialStrip } from "@/components/testimonials/contextual-testimonial-strip";
import { getTestimonialsForPlacement } from "@/content/testimonials";

const pricingTestimonials = getTestimonialsForPlacement("pricing", {
  featuredOnly: true,
  limit: 2,
});

export default function ServicesPage() {
  return (
    <section className="w-full bg-[#fcf8f3] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12">
        <header className="mx-auto max-w-3xl text-center">
          <h1 className="font-serif text-4xl tracking-[0.04em] text-[#6d4b36] sm:text-5xl">
            Peaceful Offerings
          </h1>
        </header>

        <div className="grid gap-8 md:grid-cols-2">
          <article className="rounded-[2rem] border border-[#e2d5c7] bg-[#fffdfa] p-8 shadow-[0_18px_45px_rgba(109,75,54,0.08)]">
            <h2 className="font-serif text-3xl text-[#6d4b36]">
              Foundational Peace Package
            </h2>
            <p className="mt-4 text-base leading-8 text-[#4d3c31] sm:text-lg">
              The Foundational Peace Package covers your journey from
              preparation to recovery. We include 2 prenatal planning sessions,
              continuous labor and birth support, and 1 postpartum check-in.
              Your peace of mind is guaranteed with unlimited call and text
              support available throughout your entire pregnancy.
            </p>
          </article>

          <article className="rounded-[2rem] border border-[#e2d5c7] bg-[#fffdfa] p-8 shadow-[0_18px_45px_rgba(109,75,54,0.08)]">
            <h2 className="font-serif text-3xl text-[#6d4b36]">
              Total Peace Package
            </h2>
            <p className="mt-4 text-base leading-8 text-[#4d3c31] sm:text-lg">
              This package includes all the continuous support of the
              Foundational Package, with a major upgrade on preparation. You
              receive everything included in that package, plus 2 additional
              prenatal visits specifically for private, personalized Childbirth
              Education classes for you and your partner. This is the ultimate
              path to informed choice and confident advocacy.
            </p>
          </article>
        </div>

        <ContextualTestimonialStrip
          heading="Support that still feels steady when birth takes a turn."
          intro="Families often hesitate at pricing because they are weighing real value. These excerpts are here to show how support, advocacy, and flexibility landed when plans changed."
          testimonials={pricingTestimonials}
          headingId="services-testimonials-heading"
          includeSchema
          ctaHref="/contact"
          ctaLabel="Ask About Packages"
        />

        <article className="rounded-[2.5rem] border border-[#d8cab9] bg-[#f7efe4] px-8 py-10 shadow-[0_20px_50px_rgba(93,62,39,0.08)] sm:px-10">
          <h2 className="font-serif text-3xl text-[#6d4b36]">
            Bereavement Support
          </h2>
          <p className="mt-4 max-w-4xl text-base leading-8 text-[#4d3c31] sm:text-lg">
            For families navigating the unimaginable pain of pregnancy loss, in
            any trimester. This offering provides empathetic, non-judgmental
            support and a peaceful presence from someone who truly understands.
            All bereavement services are offered completely free of charge. My
            heart and experience are here to support you through this painful
            journey.
          </p>
        </article>

        <section className="rounded-[2rem] bg-[#6d4b36] px-8 py-10 text-[#fff8f0] shadow-[0_24px_60px_rgba(73,49,35,0.22)]">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#ead7c4]">
                Need help choosing?
              </p>
              <h2 className="mt-4 font-serif text-3xl sm:text-4xl">
                Book a consultation and talk through the level of doula support
                that fits your family best.
              </h2>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full bg-[#fff8f0] px-6 py-3 text-base font-semibold text-[#5e4130] transition hover:bg-[#f6eadc]"
            >
              Book a Consultation
            </Link>
          </div>
        </section>
      </div>
    </section>
  );
}
