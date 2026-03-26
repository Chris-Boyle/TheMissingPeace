import Link from "next/link";
import { PregnancyTimelineTool } from "@/components/pregnancy-timeline/PregnancyTimelineTool";

export default function PregnancyTimelinePage() {
  return (
    <div className="bg-[#fcf8f3] px-4 py-12 text-[#35271f] sm:px-6 lg:px-8 lg:py-16">
      <section className="mx-auto max-w-6xl">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8c6a52]">
            Pregnancy Timeline Tool
          </p>
          <h1 className="mt-4 text-4xl text-[#684835] [font-family:Georgia,'Times_New_Roman',serif] sm:text-5xl">
            See what is coming next in pregnancy with a calmer sense of timing.
          </h1>
          <p className="mt-6 text-lg leading-8 text-[#57453a]">
            Enter your due date to preview a supportive timeline of what season
            you are in now and what to focus on next.
          </p>
        </div>

        <PregnancyTimelineTool />

        <div className="mt-10 rounded-[2rem] bg-[#fffaf5] p-8 shadow-[0_20px_55px_rgba(109,75,54,0.08)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8c6a52]">
                Ready for more tailored planning?
              </p>
              <h2 className="mt-4 text-3xl text-[#684835] [font-family:Georgia,'Times_New_Roman',serif] sm:text-4xl">
                Turn your timeline into a more personal plan or talk through it
                together.
              </h2>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="/birth-plan-builder"
                className="inline-flex items-center justify-center rounded-full bg-[#7d5c3c] px-6 py-3 text-base font-semibold text-[#fffaf5] transition hover:bg-[#694a30]"
              >
                Build Your Birth Plan
              </Link>
              <Link
                href="/consultation"
                className="inline-flex items-center justify-center rounded-full border border-[#cdb6a2] bg-white px-6 py-3 text-base font-semibold text-[#5c4130] transition hover:bg-[#f7ecdf]"
              >
                Book a Consultation
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
