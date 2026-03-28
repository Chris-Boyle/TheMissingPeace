"use client";

import Link from "next/link";
import { useBirthPlanBuilder } from "./birth-plan-builder-context";
import { ProgressHeader } from "./progress-header";

type StepFourSummaryProps = {
  isVisible: boolean;
};

function SummaryList({
  items,
  emptyText,
}: {
  items: string[];
  emptyText: string;
}) {
  if (items.length === 0) {
    return <p className="text-base leading-7 text-[#6b584b]">{emptyText}</p>;
  }

  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li
          key={item}
          className="rounded-[1rem] border border-[#eadbcf] bg-[#fffdfa] px-4 py-3 text-base leading-7 text-[#5d4a3e]"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

function SummaryField({
  label,
  value,
  emptyText = "Not added yet",
}: {
  label: string;
  value?: string;
  emptyText?: string;
}) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#8c6a52]">
        {label}
      </p>
      <p className="text-base leading-7 text-[#5d4a3e]">
        {value?.trim() ? value : emptyText}
      </p>
    </div>
  );
}

export function StepFourSummary({ isVisible }: StepFourSummaryProps) {
  const { state, setCurrentStep, resetBuilder } = useBirthPlanBuilder();
  const { userInfo, birthPreferences, medicalPreferences } = state;

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
            totalSteps={4}
            sectionLabel="Review Your Birth Plan"
            supportText="This summary brings your answers together so you can review them calmly before your next conversation."
          />

          <div className="mt-8 grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8c6a52]">
                Final Review
              </p>
              <h3
                id="birth-plan-builder-step-four-heading"
                className="text-3xl text-[#684835] [font-family:Georgia,'Times_New_Roman',serif]"
              >
                A clear summary you can bring into your next decision.
              </h3>
              <p className="text-base leading-8 text-[#5d4a3e]">
                Your answers are organized below so you can review what matters
                most, edit anything that needs changing, and decide on the next
                kind of support you want.
              </p>
              <div className="rounded-[1.5rem] border border-[#eadbcf] bg-[#fffdfa] px-5 py-4 text-sm leading-7 text-[#5d4a3e]">
                This summary is meant to guide thoughtful conversations with
                your doula, provider, and support team. You can always refine it
                as your pregnancy unfolds.
              </div>
            </div>

            <div className="space-y-6 rounded-[1.75rem] bg-[#fffdfa] p-6 shadow-[0_18px_45px_rgba(109,75,54,0.08)] sm:p-8">
              <section className="rounded-[1.5rem] border border-[#efe1d4] bg-[#fbf6f0] p-5">
                <h4 className="text-xl text-[#684835] [font-family:Georgia,'Times_New_Roman',serif]">
                  About You
                </h4>
                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                  <SummaryField label="Full Name" value={userInfo.fullName} />
                  <SummaryField label="Email" value={userInfo.email} />
                  <SummaryField label="Due Date" value={userInfo.dueDate} />
                  <SummaryField
                    label="Care Provider"
                    value={userInfo.careProvider}
                  />
                  <SummaryField
                    label="Planned Birth Location"
                    value={userInfo.plannedBirthLocation}
                  />
                  <SummaryField
                    label="Support Person"
                    value={userInfo.supportPersonName}
                  />
                </div>
              </section>

              <section className="rounded-[1.5rem] border border-[#efe1d4] bg-[#fbf6f0] p-5">
                <h4 className="text-xl text-[#684835] [font-family:Georgia,'Times_New_Roman',serif]">
                  Birth Preferences
                </h4>
                <div className="mt-5 space-y-5">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#8c6a52]">
                      Environment
                    </p>
                    <div className="mt-3">
                      <SummaryList
                        items={birthPreferences.environmentPreferences}
                        emptyText="No environment preferences added yet."
                      />
                    </div>
                  </div>
                  <SummaryField
                    label="Support People"
                    value={birthPreferences.supportPeople}
                  />
                  <SummaryField
                    label="How You Want Support"
                    value={birthPreferences.supportNotes}
                  />
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#8c6a52]">
                      Comfort Measures
                    </p>
                    <div className="mt-3">
                      <SummaryList
                        items={birthPreferences.comfortMeasures}
                        emptyText="No comfort measures added yet."
                      />
                    </div>
                  </div>
                </div>
              </section>

              <section className="rounded-[1.5rem] border border-[#efe1d4] bg-[#fbf6f0] p-5">
                <h4 className="text-xl text-[#684835] [font-family:Georgia,'Times_New_Roman',serif]">
                  Medical and Decision-Making Preferences
                </h4>
                <div className="mt-5 space-y-5">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#8c6a52]">
                      Pain Management
                    </p>
                    <div className="mt-3">
                      <SummaryList
                        items={medicalPreferences.painManagementPreferences}
                        emptyText="No pain management preferences added yet."
                      />
                    </div>
                  </div>
                  <SummaryField
                    label="Induction Preference"
                    value={medicalPreferences.inductionPreference}
                  />
                  <SummaryField
                    label="Labor Augmentation"
                    value={medicalPreferences.laborAugmentationPreference}
                  />
                  <SummaryField
                    label="Assisted Delivery"
                    value={medicalPreferences.assistedDeliveryPreference}
                  />
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#8c6a52]">
                      Cesarean Preferences
                    </p>
                    <div className="mt-3">
                      <SummaryList
                        items={medicalPreferences.cesareanPreferences}
                        emptyText="No cesarean preferences added yet."
                      />
                    </div>
                  </div>
                  <SummaryField
                    label="Cesarean Notes"
                    value={medicalPreferences.cesareanNotes}
                  />
                  <SummaryField
                    label="Decision-Making Preference"
                    value={medicalPreferences.decisionMakingPreference}
                  />
                  <SummaryField
                    label="Additional Notes"
                    value={medicalPreferences.additionalNotes}
                  />
                </div>
              </section>

              <div className="flex flex-col gap-4 border-t border-[#e6d8cb] pt-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="inline-flex items-center justify-center rounded-full border border-[#cdb6a2] bg-white px-5 py-3 text-base font-semibold text-[#5c4130] transition hover:bg-[#f7ecdf]"
                  >
                    Edit Answers
                  </button>
                  <button
                    type="button"
                    onClick={resetBuilder}
                    className="text-sm font-medium text-[#7b624f] underline decoration-[#ccb39b] underline-offset-4 transition hover:text-[#5c4130]"
                  >
                    Start Over
                  </button>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/consultation"
                    className="inline-flex items-center justify-center rounded-full bg-[#7d5c3c] px-6 py-3 text-base font-semibold text-[#fffaf5] transition hover:bg-[#694a30]"
                  >
                    Book a Consultation
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center rounded-full border border-[#d7c3b0] bg-transparent px-6 py-3 text-base font-semibold text-[#6a4a36] transition hover:bg-[#f7ecdf]"
                  >
                    Ask a Question
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
