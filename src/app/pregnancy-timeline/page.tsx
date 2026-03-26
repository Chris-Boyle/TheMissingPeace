import type { Metadata } from "next";
import Link from "next/link";
import { PregnancyTimelineTool } from "@/components/pregnancy-timeline/PregnancyTimelineTool";

export const metadata: Metadata = {
  title: "Your Pregnancy Timeline | The Missing Peace",
  description:
    "Explore your pregnancy timeline, understand each trimester, and prepare for birth with supportive guidance from The Missing Peace.",
};

const trimesterSections = [
  {
    title: "First Trimester",
    copy:
      "The first trimester often feels like a quiet beginning filled with adjustment, questions, and the need for reassurance. This is a good time to choose your provider, start noticing what support helps you feel steadier, and make room for rest.",
  },
  {
    title: "Second Trimester",
    copy:
      "The second trimester is often where planning starts to feel more possible. Many families begin learning about birth options, gathering questions, and shaping the kind of support they want close by.",
  },
  {
    title: "Third Trimester",
    copy:
      "The third trimester usually brings a stronger sense that birth is becoming real. This is when preferences, comfort measures, logistics, and emotional preparation begin to matter more clearly.",
  },
];

const latePregnancyPoints = [
  "Pack what you want on hand for labor, recovery, and the first day or two after birth.",
  "Review comfort measures, support roles, and how you want decision-making to feel in labor.",
  "Think through postpartum help now, not later, so recovery feels more supported and less rushed.",
];

const doulaSupportStages = [
  {
    title: "Early pregnancy",
    copy:
      "A doula can offer a calm place to process questions, begin planning, and feel less alone in the unknowns.",
  },
  {
    title: "Mid-pregnancy",
    copy:
      "This is often the best season for education, birth plan conversations, and building confidence around your options.",
  },
  {
    title: "Late pregnancy and birth",
    copy:
      "As labor approaches, doula support can help keep preparation grounded, preferences visible, and emotional support steady.",
  },
];

export default function PregnancyTimelinePage() {
  return (
    <div className="bg-[#fcf8f3] px-4 py-12 text-[#35271f] sm:px-6 lg:px-8 lg:py-16">
      <section className="mx-auto max-w-6xl">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8c6a52]">
            Pregnancy Timeline
          </p>
          <h1 className="mt-4 text-4xl text-[#684835] [font-family:Georgia,'Times_New_Roman',serif] sm:text-5xl">
            Your Pregnancy Timeline
          </h1>
          <p className="mt-6 text-lg leading-8 text-[#57453a]">
            Enter your due date to see where you are now, what season of
            pregnancy you are in, and what might feel helpful to prepare next.
          </p>
        </div>

        <PregnancyTimelineTool />

        <section className="mt-14 grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8c6a52]">
              Pregnancy timeline by trimester
            </p>
            <h2 className="mt-4 text-3xl text-[#684835] [font-family:Georgia,'Times_New_Roman',serif] sm:text-4xl">
              What each stage of pregnancy often asks of you.
            </h2>
          </div>
          <div className="space-y-8">
            {trimesterSections.map((section) => (
              <article
                key={section.title}
                className="border-t border-[#eadbcf] pt-5"
              >
                <h3 className="text-2xl text-[#6d4b36] [font-family:Georgia,'Times_New_Roman',serif]">
                  {section.title}
                </h3>
                <p className="mt-3 text-base leading-8 text-[#57453a]">
                  {section.copy}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-14 grid gap-10 rounded-[2rem] bg-[#fffaf5] p-8 shadow-[0_20px_55px_rgba(109,75,54,0.08)] lg:grid-cols-[0.92fr_1.08fr] lg:p-10">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8c6a52]">
              Late pregnancy preparation
            </p>
            <h2 className="mt-4 text-3xl text-[#684835] [font-family:Georgia,'Times_New_Roman',serif] sm:text-4xl">
              What to prepare for as birth gets closer.
            </h2>
            <p className="mt-4 text-lg leading-8 text-[#57453a]">
              A pregnancy timeline becomes especially helpful in the final
              stretch, when preferences, logistics, and postpartum planning all
              start arriving at once.
            </p>
          </div>
          <div>
            <ul className="divide-y divide-[#eadbcf] border-y border-[#eadbcf]">
              {latePregnancyPoints.map((point) => (
                <li key={point} className="py-4 text-base leading-7 text-[#5d4a3e]">
                  {point}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <h3 className="text-xl text-[#6d4b36] [font-family:Georgia,'Times_New_Roman',serif]">
                When to start your birth plan
              </h3>
              <p className="mt-3 text-base leading-8 text-[#57453a]">
                Most families benefit from starting a birth plan in the second
                or early third trimester, while there is still time to think
                clearly, ask questions, and shape preferences without feeling
                rushed.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-14 grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8c6a52]">
              Doula support along the way
            </p>
            <h2 className="mt-4 text-3xl text-[#684835] [font-family:Georgia,'Times_New_Roman',serif] sm:text-4xl">
              How a doula can support you at each stage.
            </h2>
          </div>
          <div className="space-y-8">
            {doulaSupportStages.map((stage) => (
              <article key={stage.title} className="border-t border-[#eadbcf] pt-5">
                <h3 className="text-2xl text-[#6d4b36] [font-family:Georgia,'Times_New_Roman',serif]">
                  {stage.title}
                </h3>
                <p className="mt-3 text-base leading-8 text-[#57453a]">
                  {stage.copy}
                </p>
              </article>
            ))}
          </div>
        </section>

        <div className="mt-14 rounded-[2rem] bg-[#fffaf5] p-8 shadow-[0_20px_55px_rgba(109,75,54,0.08)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8c6a52]">
                Ready for your next step?
              </p>
              <h2 className="mt-4 text-3xl text-[#684835] [font-family:Georgia,'Times_New_Roman',serif] sm:text-4xl">
                Turn your pregnancy timeline into a clearer plan or a more
                personal conversation.
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
