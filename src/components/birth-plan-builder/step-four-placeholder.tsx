"use client";

import { ProgressHeader } from "./progress-header";

type StepFourPlaceholderProps = {
  isVisible: boolean;
};

export function StepFourPlaceholder({
  isVisible,
}: StepFourPlaceholderProps) {
  return (
    <section
      aria-labelledby="birth-plan-builder-step-four-heading"
      aria-hidden={!isVisible}
      className={`px-4 py-10 transition-all duration-500 sm:px-6 lg:px-8 lg:py-14 ${
        isVisible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none max-h-0 -translate-y-4 overflow-hidden py-0 opacity-0"
      }`}
    >
      <div className="mx-auto max-w-6xl">
        <div className="rounded-[2rem] border border-[#eadbce] bg-[linear-gradient(180deg,#fffaf5_0%,#f8efe6_100%)] p-5 shadow-[0_24px_60px_rgba(109,75,54,0.12)] sm:p-8 lg:p-10">
          <ProgressHeader
            currentStep={4}
            totalSteps={5}
            sectionLabel="Step 4 Coming Next"
            supportText="Your earlier answers are saved. The next section can build on them without losing anything."
          />

          <div className="mt-8 grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8c6a52]">
                Step 4
              </p>
              <h3
                id="birth-plan-builder-step-four-heading"
                className="text-3xl text-[#684835] [font-family:Georgia,'Times_New_Roman',serif]"
              >
                The next guided section is ready to plug in here.
              </h3>
              <p className="text-base leading-8 text-[#5d4a3e]">
                Step 3 now saves successfully and moves the builder forward. The
                next step can focus on postpartum, newborn, or immediate
                recovery preferences depending on how you want the builder to
                unfold.
              </p>
            </div>

            <div className="rounded-[1.75rem] bg-[#fffdfa] p-6 shadow-[0_18px_45px_rgba(109,75,54,0.08)] sm:p-8">
              <div className="rounded-[1.5rem] border border-[#eadbcf] bg-[#fbf6f0] px-5 py-5 text-sm leading-7 text-[#5d4a3e]">
                This placeholder keeps the flow intact while Step 4 is being
                designed.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
