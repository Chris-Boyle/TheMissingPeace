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
      </div>
    </section>
  );
}
