import type { Metadata } from "next";
import Link from "next/link";
import { DoulaQuiz } from "@/components/quiz/DoulaQuiz";
import { buildPageMetadata } from "@/lib/seo/site";

export const metadata: Metadata = buildPageMetadata({
  title: "Doula Support Quiz",
  description:
    "Take a quick doula support quiz to understand what kind of reassurance, education, and guidance could feel most helpful right now.",
  path: "/quiz",
});

export default function QuizPage() {
  return (
    <div className="bg-[#fcf8f3] px-4 py-12 text-[#35271f] sm:px-6 lg:px-8 lg:py-16">
      <section className="mx-auto max-w-6xl">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8c6a52]">
            Doula Support Quiz
          </p>
          <h1 className="mt-4 text-4xl text-[#684835] [font-family:Georgia,'Times_New_Roman',serif] sm:text-5xl">
            A gentle way to figure out what kind of support would help most.
          </h1>
          <p className="mt-6 text-lg leading-8 text-[#57453a]">
            This short quiz helps you reflect on how prepared, supported, and
            reassured you feel right now, then points you toward your next best
            step.
          </p>
        </div>

        <DoulaQuiz />

        <div className="mt-10 rounded-[2rem] bg-[#6d4b36] px-8 py-10 text-[#fff8f0] shadow-[0_24px_60px_rgba(73,49,35,0.22)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#ead7c4]">
                Want personal guidance?
              </p>
              <h2 className="mt-4 text-3xl [font-family:Georgia,'Times_New_Roman',serif] sm:text-4xl">
                Book a consultation when you are ready to talk through your next
                steps.
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
        </div>
      </section>
    </div>
  );
}
