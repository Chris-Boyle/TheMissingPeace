"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { useBirthPlanBuilder } from "./birth-plan-builder-context";
import { ProgressHeader } from "./progress-header";
import {
  initialMedicalPreferences,
  type CesareanPreference,
  type DecisionMakingPreference,
  type MedicalPreferences,
  type PainManagementPreference,
} from "./types";

type StepThreeMedicalPreferencesProps = {
  isVisible: boolean;
};

const painManagementOptions: PainManagementPreference[] = [
  "I prefer to avoid pain medication if possible",
  "I am open to an epidural",
  "I want to learn about all available pain relief options",
  "I would like to use natural comfort techniques first",
  "I am unsure and want to decide in the moment",
];

const inductionOptions = [
  "I prefer to avoid induction unless medically necessary",
  "I am open to induction if recommended",
  "I want to discuss the pros and cons with my provider",
  "I am unsure",
] as const;

const laborAugmentationOptions = [
  "I prefer to try position changes, rest, hydration, or movement first",
  "I am open to medical options if needed",
  "I want to understand each option before making a decision",
  "I am unsure",
] as const;

const assistedDeliveryOptions = [
  "I want the care team to explain why it is recommended before moving forward",
  "I am open to it if medically appropriate",
  "I prefer to avoid it unless urgent",
  "I am unsure",
] as const;

const cesareanCheckboxOptions: CesareanPreference[] = [
  "Clear communication throughout the procedure",
  "My support person present if possible",
  "Skin-to-skin in the operating or recovery room if possible",
  "Delayed newborn procedures when appropriate",
  "I am not sure yet",
];

const decisionMakingOptions: DecisionMakingPreference[] = [
  "Please explain options and give me time to decide if possible",
  "Please include my partner/support person in discussions",
  "I prefer straightforward recommendations from the care team",
  "A mix of explanation and guidance feels best",
  "I am unsure",
];

function hasStepThreeInput(values: MedicalPreferences) {
  return (
    values.painManagementPreferences.length > 0 ||
    Boolean(values.inductionPreference) ||
    Boolean(values.laborAugmentationPreference) ||
    Boolean(values.assistedDeliveryPreference) ||
    values.cesareanPreferences.length > 0 ||
    values.cesareanNotes.trim().length > 0 ||
    Boolean(values.decisionMakingPreference) ||
    values.additionalNotes.trim().length > 0
  );
}

export function StepThreeMedicalPreferences({
  isVisible,
}: StepThreeMedicalPreferencesProps) {
  const { state, saveMedicalPreferences, setCurrentStep } = useBirthPlanBuilder();
  const [values, setValues] = useState<MedicalPreferences>(
    hasStepThreeInput(state.medicalPreferences)
      ? state.medicalPreferences
      : initialMedicalPreferences
  );
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isVisible) {
      firstFieldRef.current?.focus();
    }
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) {
      return;
    }

    saveMedicalPreferences(values);
  }, [isVisible, saveMedicalPreferences, values]);

  const painManagementError =
    hasSubmitted && values.painManagementPreferences.length === 0
      ? "Choose at least one option so we can note how you would like pain relief conversations handled."
      : undefined;

  const decisionMakingError =
    hasSubmitted && !values.decisionMakingPreference
      ? "Choose the communication style that feels most supportive to you."
      : undefined;

  const isReadyToContinue = useMemo(
    () =>
      values.painManagementPreferences.length > 0 &&
      Boolean(values.decisionMakingPreference),
    [values.decisionMakingPreference, values.painManagementPreferences.length]
  );

  function togglePainManagementPreference(value: PainManagementPreference) {
    setValues((previous) => {
      const nextPainManagementPreferences =
        previous.painManagementPreferences.includes(value)
          ? previous.painManagementPreferences.filter((entry) => entry !== value)
          : [...previous.painManagementPreferences, value];

      return {
        ...previous,
        painManagementPreferences: nextPainManagementPreferences,
      };
    });
  }

  function toggleCesareanPreference(value: CesareanPreference) {
    setValues((previous) => {
      const nextCesareanPreferences = previous.cesareanPreferences.includes(value)
        ? previous.cesareanPreferences.filter((entry) => entry !== value)
        : [...previous.cesareanPreferences, value];

      return {
        ...previous,
        cesareanPreferences: nextCesareanPreferences,
      };
    });
  }

  function handleTextChange(event: ChangeEvent<HTMLTextAreaElement>) {
    const { name, value } = event.target;

    setValues((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handleSingleChoiceChange(
    field:
      | "inductionPreference"
      | "laborAugmentationPreference"
      | "assistedDeliveryPreference"
      | "decisionMakingPreference",
    value: string
  ) {
    setValues((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setHasSubmitted(true);

    if (!isReadyToContinue) {
      return;
    }

    setCurrentStep(4);
  }

  return (
    <section
      aria-labelledby="birth-plan-builder-step-three-heading"
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
            currentStep={3}
            totalSteps={4}
            sectionLabel="Interventions & Medical Preferences"
            supportText="These are preferences, not guarantees. You can always talk through any of them with your provider."
          />

          <div className="mt-8 grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8c6a52]">
                Step 3
              </p>
              <h3
                id="birth-plan-builder-step-three-heading"
                className="text-3xl text-[#684835] [font-family:Georgia,'Times_New_Roman',serif]"
              >
                Think through medical decisions in a calm, informed way.
              </h3>
              <p className="text-base leading-8 text-[#5d4a3e]">
                This section helps you think through common medical options and
                interventions that may come up during labor and birth. These are
                simply your preferences and can be updated anytime.
              </p>
              <div className="rounded-[1.5rem] border border-[#eadbcf] bg-[#fffdfa] px-5 py-4 text-sm leading-7 text-[#5d4a3e]">
                You do not have to know everything perfectly. If you are still
                sorting through options, choosing unsure is a valid place to be.
              </div>
            </div>

            <form
              className="rounded-[1.75rem] bg-[#fffdfa] p-6 shadow-[0_18px_45px_rgba(109,75,54,0.08)] sm:p-8"
              noValidate
              onSubmit={handleSubmit}
            >
              <fieldset className="space-y-8">
                <legend className="sr-only">
                  Birth plan builder medical preferences
                </legend>

                <fieldset className="rounded-[1.5rem] border border-[#efe1d4] bg-[#fbf6f0] p-5">
                  <legend className="text-lg text-[#684835] [font-family:Georgia,'Times_New_Roman',serif]">
                    Pain Management Preferences
                  </legend>
                  <p className="mt-2 text-sm leading-7 text-[#6b584b]">
                    Choose the approaches or conversations you would like
                    reflected in your plan.
                  </p>
                  <div
                    className="mt-5 grid gap-3"
                    aria-describedby={
                      painManagementError ? "pain-management-error" : undefined
                    }
                  >
                    {painManagementOptions.map((option, index) => {
                      const checked =
                        values.painManagementPreferences.includes(option);

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
                            ref={index === 0 ? firstFieldRef : undefined}
                            type="checkbox"
                            checked={checked}
                            onChange={() => togglePainManagementPreference(option)}
                            className="mt-1 h-4 w-4 rounded border-[#b78a6c] text-[#7d5c3c] focus:ring-[#e8cfc8]"
                          />
                          <span>{option}</span>
                        </label>
                      );
                    })}
                  </div>
                  {painManagementError ? (
                    <p
                      id="pain-management-error"
                      className="mt-3 text-sm text-[#a14f3a]"
                    >
                      {painManagementError}
                    </p>
                  ) : (
                    <p className="mt-3 text-sm text-[#746255]">
                      You can select more than one answer if that reflects how
                      you want decisions around comfort to unfold.
                    </p>
                  )}
                </fieldset>

                <fieldset className="rounded-[1.5rem] border border-[#efe1d4] bg-[#fbf6f0] p-5">
                  <legend className="text-lg text-[#684835] [font-family:Georgia,'Times_New_Roman',serif]">
                    Induction Preferences
                  </legend>
                  <div className="mt-5 grid gap-3">
                    {inductionOptions.map((option) => (
                      <label
                        key={option}
                        className={`flex cursor-pointer items-start gap-3 rounded-[1.25rem] border px-4 py-4 text-sm transition ${
                          values.inductionPreference === option
                            ? "border-[#c69879] bg-[#f7ecdf] text-[#4f3829]"
                            : "border-[#e3d6ca] bg-white text-[#5f4a3d]"
                        }`}
                      >
                        <input
                          type="radio"
                          name="inductionPreference"
                          value={option}
                          checked={values.inductionPreference === option}
                          onChange={() =>
                            handleSingleChoiceChange("inductionPreference", option)
                          }
                          className="mt-1 h-4 w-4 border-[#b78a6c] text-[#7d5c3c] focus:ring-[#e8cfc8]"
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>

                <fieldset className="rounded-[1.5rem] border border-[#efe1d4] bg-[#fbf6f0] p-5">
                  <legend className="text-lg text-[#684835] [font-family:Georgia,'Times_New_Roman',serif]">
                    Labor Augmentation Preferences
                  </legend>
                  <p className="mt-2 text-sm leading-7 text-[#6b584b]">
                    If labor is progressing slowly, how would you like support
                    around next steps?
                  </p>
                  <div className="mt-5 grid gap-3">
                    {laborAugmentationOptions.map((option) => (
                      <label
                        key={option}
                        className={`flex cursor-pointer items-start gap-3 rounded-[1.25rem] border px-4 py-4 text-sm transition ${
                          values.laborAugmentationPreference === option
                            ? "border-[#c69879] bg-[#f7ecdf] text-[#4f3829]"
                            : "border-[#e3d6ca] bg-white text-[#5f4a3d]"
                        }`}
                      >
                        <input
                          type="radio"
                          name="laborAugmentationPreference"
                          value={option}
                          checked={values.laborAugmentationPreference === option}
                          onChange={() =>
                            handleSingleChoiceChange(
                              "laborAugmentationPreference",
                              option
                            )
                          }
                          className="mt-1 h-4 w-4 border-[#b78a6c] text-[#7d5c3c] focus:ring-[#e8cfc8]"
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>

                <fieldset className="rounded-[1.5rem] border border-[#efe1d4] bg-[#fbf6f0] p-5">
                  <legend className="text-lg text-[#684835] [font-family:Georgia,'Times_New_Roman',serif]">
                    Assisted Delivery Preferences
                  </legend>
                  <p className="mt-2 text-sm leading-7 text-[#6b584b]">
                    If an assisted vaginal delivery is suggested, what feels most
                    aligned with your preferences?
                  </p>
                  <div className="mt-5 grid gap-3">
                    {assistedDeliveryOptions.map((option) => (
                      <label
                        key={option}
                        className={`flex cursor-pointer items-start gap-3 rounded-[1.25rem] border px-4 py-4 text-sm transition ${
                          values.assistedDeliveryPreference === option
                            ? "border-[#c69879] bg-[#f7ecdf] text-[#4f3829]"
                            : "border-[#e3d6ca] bg-white text-[#5f4a3d]"
                        }`}
                      >
                        <input
                          type="radio"
                          name="assistedDeliveryPreference"
                          value={option}
                          checked={values.assistedDeliveryPreference === option}
                          onChange={() =>
                            handleSingleChoiceChange(
                              "assistedDeliveryPreference",
                              option
                            )
                          }
                          className="mt-1 h-4 w-4 border-[#b78a6c] text-[#7d5c3c] focus:ring-[#e8cfc8]"
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>

                <fieldset className="rounded-[1.5rem] border border-[#efe1d4] bg-[#fbf6f0] p-5">
                  <legend className="text-lg text-[#684835] [font-family:Georgia,'Times_New_Roman',serif]">
                    Cesarean Birth Preferences
                  </legend>
                  <p className="mt-2 text-sm leading-7 text-[#6b584b]">
                    If a cesarean birth becomes necessary, are there any
                    preferences you would like noted?
                  </p>
                  <div className="mt-5 grid gap-3">
                    {cesareanCheckboxOptions.map((option) => {
                      const checked = values.cesareanPreferences.includes(option);

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
                            onChange={() => toggleCesareanPreference(option)}
                            className="mt-1 h-4 w-4 rounded border-[#b78a6c] text-[#7d5c3c] focus:ring-[#e8cfc8]"
                          />
                          <span>{option}</span>
                        </label>
                      );
                    })}
                  </div>
                  <div className="mt-5">
                    <label
                      htmlFor="cesareanNotes"
                      className="block text-sm font-medium text-[#4b382c]"
                    >
                      Additional cesarean preferences or questions
                    </label>
                    <textarea
                      id="cesareanNotes"
                      name="cesareanNotes"
                      rows={4}
                      value={values.cesareanNotes}
                      onChange={handleTextChange}
                      className="mt-2 w-full rounded-2xl border border-[#dfd0c1] bg-white px-4 py-3 text-base text-[#35271f] outline-none transition focus:border-[#b78a6c] focus:ring-2 focus:ring-[#e8cfc8]"
                    />
                  </div>
                </fieldset>

                <fieldset className="rounded-[1.5rem] border border-[#efe1d4] bg-[#fbf6f0] p-5">
                  <legend className="text-lg text-[#684835] [font-family:Georgia,'Times_New_Roman',serif]">
                    Decision-Making Preferences
                  </legend>
                  <p className="mt-2 text-sm leading-7 text-[#6b584b]">
                    When decisions need to be made during labor, what kind of
                    communication feels best to you?
                  </p>
                  <div
                    className="mt-5 grid gap-3"
                    aria-describedby={
                      decisionMakingError ? "decision-making-error" : undefined
                    }
                  >
                    {decisionMakingOptions.map((option) => (
                      <label
                        key={option}
                        className={`flex cursor-pointer items-start gap-3 rounded-[1.25rem] border px-4 py-4 text-sm transition ${
                          values.decisionMakingPreference === option
                            ? "border-[#c69879] bg-[#f7ecdf] text-[#4f3829]"
                            : "border-[#e3d6ca] bg-white text-[#5f4a3d]"
                        }`}
                      >
                        <input
                          type="radio"
                          name="decisionMakingPreference"
                          value={option}
                          checked={values.decisionMakingPreference === option}
                          onChange={() =>
                            handleSingleChoiceChange(
                              "decisionMakingPreference",
                              option
                            )
                          }
                          className="mt-1 h-4 w-4 border-[#b78a6c] text-[#7d5c3c] focus:ring-[#e8cfc8]"
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                  {decisionMakingError ? (
                    <p
                      id="decision-making-error"
                      className="mt-3 text-sm text-[#a14f3a]"
                    >
                      {decisionMakingError}
                    </p>
                  ) : (
                    <p className="mt-3 text-sm text-[#746255]">
                      If plans need to change, this helps your team understand
                      how to communicate with you in a steady, respectful way.
                    </p>
                  )}
                </fieldset>

                <div className="rounded-[1.5rem] border border-[#efe1d4] bg-[#fbf6f0] p-5">
                  <label
                    htmlFor="additionalNotes"
                    className="text-lg text-[#684835] [font-family:Georgia,'Times_New_Roman',serif]"
                  >
                    Additional Notes
                  </label>
                  <p className="mt-2 text-sm leading-7 text-[#6b584b]">
                    Anything else you want your care team to understand about
                    your medical preferences?
                  </p>
                  <textarea
                    id="additionalNotes"
                    name="additionalNotes"
                    rows={4}
                    value={values.additionalNotes}
                    onChange={handleTextChange}
                    className="mt-5 w-full rounded-2xl border border-[#dfd0c1] bg-white px-4 py-3 text-base text-[#35271f] outline-none transition focus:border-[#b78a6c] focus:ring-2 focus:ring-[#e8cfc8]"
                  />
                </div>
              </fieldset>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="inline-flex items-center justify-center rounded-full border border-[#cdb6a2] bg-white px-5 py-3 text-base font-semibold text-[#5c4130] transition hover:bg-[#f7ecdf]"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={!isReadyToContinue}
                  className="inline-flex items-center justify-center rounded-full bg-[#7d5c3c] px-6 py-3 text-base font-semibold text-[#fffaf5] transition hover:bg-[#694a30] disabled:cursor-not-allowed disabled:bg-[#cbb6a6] disabled:text-[#f8f1eb]"
                >
                  Review My Summary
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
