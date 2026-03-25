"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import {
  BirthPlanBuilderProvider,
  useBirthPlanBuilder,
} from "./birth-plan-builder-context";
import { StepFourPlaceholder } from "./step-four-placeholder";
import { StepOneUserInfo } from "./step-one-user-info";
import { StepThreeMedicalPreferences } from "./step-three-medical-preferences";
import { StepTwoBirthPreferences } from "./step-two-birth-preferences";

const benefits = [
  "Clarify your birth preferences",
  "Think through options you may not have considered",
  "Get a clean summary you can save and share",
  "Receive a copy by email when you finish",
];

const steps = [
  "Share a few details about yourself",
  "Answer guided questions step by step",
  "Receive a personalized summary to review and share",
];

const comingNextItems = [
  "Grouped question sections",
  "Labor preferences",
  "Support people and environment",
  "Summary page",
  "Email and send workflow",
];

function BirthPlanBuilderContent() {
  const { state, setCurrentStep } = useBirthPlanBuilder();
  const [isStepOneVisible, setIsStepOneVisible] = useState(false);
  const stepOneRef = useRef<HTMLDivElement>(null);

  function revealStepOne() {
    setIsStepOneVisible(true);
    setCurrentStep(1);

    window.setTimeout(() => {
      stepOneRef.current?.scrollIntoView?.({
        behavior: "smooth",
        block: "start",
      });
    }, 120);
  }

  return (
    <div className="bg-[#fcf8f3] text-[#35271f]">
      <section className="overflow-hidden px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div className="relative">
            <div className="absolute -left-6 top-10 hidden h-32 w-32 rounded-full bg-[#efe1d0] blur-2xl sm:block" />
            <div className="absolute bottom-0 right-0 hidden h-40 w-40 rounded-full bg-[#f6eadc] blur-3xl sm:block" />
            <div className="relative rounded-[2rem] bg-[linear-gradient(180deg,#fffaf5_0%,#f5ede4_100%)] p-8 shadow-[0_28px_70px_rgba(109,75,54,0.12)] sm:p-10">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8c6a52]">
                Birth Plan Builder
              </p>
              <h1 className="mt-5 max-w-3xl text-4xl leading-tight text-[#684835] [font-family:Georgia,'Times_New_Roman',serif] sm:text-5xl lg:text-6xl">
                Build Your Birth Plan
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-[#57453a]">
                Create a thoughtful, personalized birth plan that helps you
                organize your preferences, communicate your wishes, and feel
                more prepared for labor, birth, and postpartum.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <button
                  type="button"
                  onClick={revealStepOne}
                  className="inline-flex items-center justify-center rounded-full bg-[#7d5c3c] px-6 py-3 text-base font-semibold text-[#fffaf5] transition hover:bg-[#694a30]"
                >
                  Get Started
                </button>
                <Link
                  href="#birth-plan-builder-how-it-works"
                  className="inline-flex items-center justify-center rounded-full border border-[#cdb6a2] bg-white/70 px-6 py-3 text-base font-semibold text-[#5c4130] transition hover:bg-[#f7ecdf]"
                >
                  Learn How It Works
                </Link>
              </div>
            </div>
          </div>

          <aside className="rounded-[2rem] border border-[#e2d5c7] bg-[#fffaf5] p-8 shadow-[0_20px_55px_rgba(109,75,54,0.08)]">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8c6a52]">
              Why families use it
            </p>
            <ul className="mt-5 space-y-4" aria-label="Birth plan builder benefits">
              {benefits.map((benefit) => (
                <li
                  key={benefit}
                  className="rounded-[1.5rem] border border-[#eee1d4] bg-[#fffdfa] px-5 py-4 text-base leading-7 text-[#57453a] shadow-[0_14px_35px_rgba(109,75,54,0.06)]"
                >
                  {benefit}
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="mx-auto grid max-w-6xl gap-8 rounded-[2rem] bg-[#fffaf5] p-8 shadow-[0_20px_55px_rgba(109,75,54,0.08)] lg:grid-cols-[0.9fr_1.1fr] lg:p-10">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8c6a52]">
              Gentle structure
            </p>
            <h2 className="mt-4 text-3xl text-[#684835] [font-family:Georgia,'Times_New_Roman',serif] sm:text-4xl">
              A guided tool for making thoughtful choices, one section at a
              time.
            </h2>
          </div>
          <div className="space-y-4 text-lg leading-8 text-[#57453a]">
            <p>
              The Birth Plan Builder is designed to help you reflect on the
              decisions that matter most before labor begins. Instead of staring
              at a blank page, you will move through clear, guided prompts that
              help you think through support, environment, interventions, and
              postpartum wishes.
            </p>
            <p className="rounded-[1.5rem] border border-[#eadbcf] bg-[#f8efe6] px-5 py-4 text-base text-[#5e4536]">
              When you finish, you will receive a copy you can keep for
              yourself, review with your care team, and share with your doula.
            </p>
          </div>
        </div>
      </section>

      <div ref={stepOneRef}>
        <StepOneUserInfo
          isVisible={isStepOneVisible && state.currentStep === 1}
        />
        <StepTwoBirthPreferences
          isVisible={isStepOneVisible && state.currentStep === 2}
        />
        <StepThreeMedicalPreferences
          isVisible={isStepOneVisible && state.currentStep === 3}
        />
        <StepFourPlaceholder
          isVisible={isStepOneVisible && state.currentStep === 4}
        />
      </div>

      <section
        id="birth-plan-builder-how-it-works"
        className="px-4 py-10 sm:px-6 lg:px-8 lg:py-14"
        aria-labelledby="birth-plan-builder-how-it-works-heading"
      >
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8c6a52]">
              How it works
            </p>
            <h2
              id="birth-plan-builder-how-it-works-heading"
              className="mt-4 text-3xl text-[#684835] [font-family:Georgia,'Times_New_Roman',serif] sm:text-4xl"
            >
              A calm, guided process from first details to final summary.
            </h2>
          </div>

          <ol className="mt-8 grid gap-6 md:grid-cols-3">
            {steps.map((step, index) => (
              <li
                key={step}
                className="rounded-[1.75rem] border border-[#e2d5c7] bg-[#fffdfa] p-6 shadow-[0_18px_45px_rgba(109,75,54,0.08)]"
              >
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8c6a52]">
                  Step {index + 1}
                </p>
                <p className="mt-3 text-xl text-[#6d4b36] [font-family:Georgia,'Times_New_Roman',serif]">
                  {step}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section
        id="birth-plan-builder-coming-next"
        className="px-4 pb-16 pt-10 sm:px-6 lg:px-8 lg:pb-20"
        aria-labelledby="birth-plan-builder-coming-next-heading"
      >
        <div className="mx-auto max-w-6xl rounded-[2rem] bg-[#6d4b36] p-8 text-[#fff8f0] shadow-[0_24px_60px_rgba(73,49,35,0.22)] lg:p-10">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#ead7c4]">
                Coming next
              </p>
              <h2
                id="birth-plan-builder-coming-next-heading"
                className="mt-4 text-3xl [font-family:Georgia,'Times_New_Roman',serif] sm:text-4xl"
              >
                Step 1 is live, and the rest of the guided builder is ready to
                plug in.
              </h2>
            </div>
            <div className="rounded-full border border-[#d9c0ad] bg-[rgba(255,248,240,0.12)] px-4 py-2 text-sm font-medium text-[#fff3e7]">
              Future multi-step experience scaffold
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {comingNextItems.map((item) => (
              <div
                key={item}
                className="rounded-[1.5rem] border border-[rgba(255,245,236,0.18)] bg-[rgba(255,248,240,0.08)] px-5 py-5"
              >
                <p className="text-base font-medium text-[#fff7ef]">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export function BirthPlanBuilder() {
  return (
    <BirthPlanBuilderProvider>
      <BirthPlanBuilderContent />
    </BirthPlanBuilderProvider>
  );
}
