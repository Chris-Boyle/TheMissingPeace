"use client";

import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { useBirthPlanBuilder } from "./birth-plan-builder-context";
import { ProgressHeader } from "./progress-header";
import {
  initialBirthPreferences,
  type BirthPreferences,
  type BirthEnvironmentPreference,
  type ComfortMeasure,
} from "./types";

type StepTwoBirthPreferencesProps = {
  isVisible: boolean;
};

const environmentOptions: BirthEnvironmentPreference[] = [
  "Quiet room",
  "Dim lighting",
  "Music or calming sounds",
  "Freedom to move",
  "Minimal interruptions",
];

const comfortMeasureOptions: ComfortMeasure[] = [
  "Breathing guidance",
  "Position changes",
  "Massage or counterpressure",
  "Shower or tub",
  "Birth ball or peanut ball",
];

function hasStepTwoInput(values: BirthPreferences) {
  return (
    values.environmentPreferences.length > 0 ||
    values.comfortMeasures.length > 0 ||
    values.supportPeople.trim().length > 0 ||
    values.supportNotes.trim().length > 0
  );
}

export function StepTwoBirthPreferences({
  isVisible,
}: StepTwoBirthPreferencesProps) {
  const { state, saveBirthPreferences, setCurrentStep } = useBirthPlanBuilder();
  const [values, setValues] = useState<BirthPreferences>(
    hasStepTwoInput(state.birthPreferences)
      ? state.birthPreferences
      : initialBirthPreferences
  );
  const isReadyToContinue = useMemo(() => hasStepTwoInput(values), [values]);

  useEffect(() => {
    if (!isVisible) {
      return;
    }

    saveBirthPreferences(values);
  }, [isVisible, saveBirthPreferences, values]);

  function toggleArrayValue(
    field: "environmentPreferences" | "comfortMeasures",
    value: BirthEnvironmentPreference | ComfortMeasure
  ) {
    setValues((previous) => {
      if (field === "environmentPreferences") {
        const nextEnvironmentPreferences =
          previous.environmentPreferences.includes(
            value as BirthEnvironmentPreference
          )
            ? previous.environmentPreferences.filter((entry) => entry !== value)
            : [
                ...previous.environmentPreferences,
                value as BirthEnvironmentPreference,
              ];

        return {
          ...previous,
          environmentPreferences: nextEnvironmentPreferences,
        };
      }

      const nextComfortMeasures = previous.comfortMeasures.includes(
        value as ComfortMeasure
      )
        ? previous.comfortMeasures.filter((entry) => entry !== value)
        : [...previous.comfortMeasures, value as ComfortMeasure];

      return {
        ...previous,
        comfortMeasures: nextComfortMeasures,
      };
    });
  }

  function handleTextChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = event.target;

    setValues((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isReadyToContinue) {
      return;
    }

    setCurrentStep(3);
  }

  return (
    <section
      aria-labelledby="birth-plan-builder-step-two-heading"
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
            currentStep={2}
            totalSteps={4}
            sectionLabel="Birth Preferences"
          />

          <div className="mt-8 grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8c6a52]">
                Step 2
              </p>
              <h3
                id="birth-plan-builder-step-two-heading"
                className="text-3xl text-[#684835] [font-family:Georgia,'Times_New_Roman',serif]"
              >
                Shape the space, support, and comfort you want around you.
              </h3>
              <p className="text-base leading-8 text-[#5d4a3e]">
                This section helps you name the kind of atmosphere and support
                that helps you feel safest and most grounded during labor.
              </p>
              <div className="rounded-[1.5rem] border border-[#eadbcf] bg-[#fffdfa] px-5 py-4 text-sm leading-7 text-[#5d4a3e]">
                Choose as many options as feel supportive. This is meant to
                guide thoughtful conversations, not box you into rigid rules.
              </div>
            </div>

            <form
              className="rounded-[1.75rem] bg-[#fffdfa] p-6 shadow-[0_18px_45px_rgba(109,75,54,0.08)] sm:p-8"
              noValidate
              onSubmit={handleSubmit}
            >
              <fieldset className="space-y-8">
                <legend className="sr-only">
                  Birth plan builder birth preferences
                </legend>

                <div className="rounded-[1.5rem] border border-[#efe1d4] bg-[#fbf6f0] p-5">
                  <h4 className="text-lg text-[#684835] [font-family:Georgia,'Times_New_Roman',serif]">
                    Environment
                  </h4>
                  <p className="mt-2 text-sm leading-7 text-[#6b584b]">
                    Pick the room qualities that help you feel calm, focused,
                    and supported.
                  </p>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {environmentOptions.map((option) => {
                      const checked = values.environmentPreferences.includes(option);

                      return (
                        <label
                          key={option}
                          className={`flex cursor-pointer items-start gap-3 rounded-[1.25rem] border px-4 py-4 text-sm transition ${
                            checked
                              ? "border-[#c69879] bg-[#f7ecdf] text-[#4f3829]"
                              : "border-[#e3d6ca] bg-white text-[#5f4a3d]"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() =>
                              toggleArrayValue("environmentPreferences", option)
                            }
                            className="mt-1 h-4 w-4 rounded border-[#b78a6c] text-[#7d5c3c] focus:ring-[#e8cfc8]"
                          />
                          <span>{option}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="rounded-[1.5rem] border border-[#efe1d4] bg-[#fbf6f0] p-5">
                  <h4 className="text-lg text-[#684835] [font-family:Georgia,'Times_New_Roman',serif]">
                    Support People
                  </h4>
                  <div className="mt-5 space-y-5">
                    <div>
                      <label
                        htmlFor="supportPeople"
                        className="block text-sm font-medium text-[#4b382c]"
                      >
                        Who would you like present or nearby?
                      </label>
                      <textarea
                        id="supportPeople"
                        name="supportPeople"
                        rows={3}
                        value={values.supportPeople}
                        onChange={handleTextChange}
                        className="mt-2 w-full rounded-2xl border border-[#dfd0c1] bg-white px-4 py-3 text-base text-[#35271f] outline-none transition focus:border-[#b78a6c] focus:ring-2 focus:ring-[#e8cfc8]"
                      />
                      <p className="mt-2 text-sm text-[#746255]">
                        You can list a partner, doula, family members, or anyone
                        else you want included.
                      </p>
                    </div>

                    <div>
                      <label
                        htmlFor="supportNotes"
                        className="block text-sm font-medium text-[#4b382c]"
                      >
                        How would you like your support team to help?
                      </label>
                      <textarea
                        id="supportNotes"
                        name="supportNotes"
                        rows={3}
                        value={values.supportNotes}
                        onChange={handleTextChange}
                        className="mt-2 w-full rounded-2xl border border-[#dfd0c1] bg-white px-4 py-3 text-base text-[#35271f] outline-none transition focus:border-[#b78a6c] focus:ring-2 focus:ring-[#e8cfc8]"
                      />
                    </div>
                  </div>
                </div>

                <div className="rounded-[1.5rem] border border-[#efe1d4] bg-[#fbf6f0] p-5">
                  <h4 className="text-lg text-[#684835] [font-family:Georgia,'Times_New_Roman',serif]">
                    Comfort Measures
                  </h4>
                  <p className="mt-2 text-sm leading-7 text-[#6b584b]">
                    Choose the comfort tools you would like available or offered
                    during labor.
                  </p>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {comfortMeasureOptions.map((option) => {
                      const checked = values.comfortMeasures.includes(option);

                      return (
                        <label
                          key={option}
                          className={`flex cursor-pointer items-start gap-3 rounded-[1.25rem] border px-4 py-4 text-sm transition ${
                            checked
                              ? "border-[#c69879] bg-[#f7ecdf] text-[#4f3829]"
                              : "border-[#e3d6ca] bg-white text-[#5f4a3d]"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() =>
                              toggleArrayValue("comfortMeasures", option)
                            }
                            className="mt-1 h-4 w-4 rounded border-[#b78a6c] text-[#7d5c3c] focus:ring-[#e8cfc8]"
                          />
                          <span>{option}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </fieldset>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="inline-flex items-center justify-center rounded-full border border-[#cdb6a2] bg-white px-5 py-3 text-base font-semibold text-[#5c4130] transition hover:bg-[#f7ecdf]"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={!isReadyToContinue}
                  className="inline-flex items-center justify-center rounded-full bg-[#7d5c3c] px-6 py-3 text-base font-semibold text-[#fffaf5] transition hover:bg-[#694a30] disabled:cursor-not-allowed disabled:bg-[#cbb6a6] disabled:text-[#f8f1eb]"
                >
                  Continue
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
