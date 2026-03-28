"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type FormEvent,
} from "react";
import { useBirthPlanBuilder } from "./birth-plan-builder-context";
import { ProgressHeader } from "./progress-header";
import {
  initialBirthPlanUserInfo,
  type BirthPlanUserInfo,
} from "./types";

type StepOneUserInfoProps = {
  isVisible: boolean;
};

type FormErrors = Partial<Record<keyof BirthPlanUserInfo, string>>;
type TouchedState = Record<keyof BirthPlanUserInfo, boolean>;

const birthLocationOptions = [
  "Hospital",
  "Birth Center",
  "Home",
  "Not Sure",
] as const;

const helperText: Partial<Record<keyof BirthPlanUserInfo, string>> = {
  email: "We will use this to personalize your summary and follow-up support if you choose to connect.",
  dueDate: "Your due date helps us shape the timeline and language in later steps.",
  careProvider: "If you know your provider already, add them here. You can always update this later.",
  supportPersonName:
    "This can be a partner, family member, friend, or anyone you expect to have with you.",
};

function createTouchedState(): TouchedState {
  return {
    fullName: false,
    email: false,
    dueDate: false,
    careProvider: false,
    plannedBirthLocation: false,
    supportPersonName: false,
  };
}

function validateField(
  field: keyof BirthPlanUserInfo,
  value: string
): string | undefined {
  if (field === "fullName" && !value.trim()) {
    return "Please share your full name so we can personalize your plan.";
  }

  if (field === "email") {
    if (!value.trim()) {
      return "Please enter your email so we can personalize your summary.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return "Please enter a valid email so we can personalize your summary.";
    }
  }

  if (field === "dueDate" && !value.trim()) {
    return "Please choose your due date so we can tailor the next steps.";
  }

  return undefined;
}

function validateForm(values: BirthPlanUserInfo): FormErrors {
  return {
    fullName: validateField("fullName", values.fullName),
    email: validateField("email", values.email),
    dueDate: validateField("dueDate", values.dueDate),
  };
}

function getVisibleError(
  field: keyof BirthPlanUserInfo,
  errors: FormErrors,
  touched: TouchedState,
  hasSubmitted: boolean
) {
  if (!errors[field]) {
    return undefined;
  }

  if (hasSubmitted || touched[field]) {
    return errors[field];
  }

  return undefined;
}

export function StepOneUserInfo({ isVisible }: StepOneUserInfoProps) {
  const { state, saveUserInfo, setCurrentStep } = useBirthPlanBuilder();
  const [values, setValues] = useState<BirthPlanUserInfo>(
    state.userInfo.fullName || state.userInfo.email || state.userInfo.dueDate
      ? state.userInfo
      : initialBirthPlanUserInfo
  );
  const [touched, setTouched] = useState<TouchedState>(createTouchedState);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isVisible) {
      firstInputRef.current?.focus();
    }
  }, [isVisible]);

  const errors = useMemo(() => validateForm(values), [values]);
  const isFormValid = !errors.fullName && !errors.email && !errors.dueDate;

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = event.target;
    const nextValues = {
      ...values,
      [name]: value,
    };

    setValues(nextValues);
    saveUserInfo(nextValues);

    setTouched((previous) => ({
      ...previous,
      [name]: true,
    }));
  }

  function handleBlur(event: FocusEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name } = event.target;

    setTouched((previous) => ({
      ...previous,
      [name]: true,
    }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setHasSubmitted(true);

    if (!isFormValid) {
      return;
    }

    setCurrentStep(2);
  }

  return (
    <section
      aria-labelledby="birth-plan-builder-step-one-heading"
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
            currentStep={1}
            totalSteps={4}
            sectionLabel="About You"
          />

          <div className="mt-8 grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8c6a52]">
                Step 1
              </p>
              <h3
                id="birth-plan-builder-step-one-heading"
                className="text-3xl text-[#684835] [font-family:Georgia,'Times_New_Roman',serif]"
              >
                Start with the details that help us guide you well.
              </h3>
              <p className="text-base leading-8 text-[#5d4a3e]">
                This first step gives your birth plan a personal foundation. It
                only takes a minute, and you can adjust these answers later if
                anything changes.
              </p>
              <div className="rounded-[1.5rem] border border-[#eadbcf] bg-[#fffdfa] px-5 py-4 text-sm leading-7 text-[#5d4a3e]">
                Your answers will shape the final review screen at the end of
                the builder.
              </div>
            </div>

            <form
              className="rounded-[1.75rem] bg-[#fffdfa] p-6 shadow-[0_18px_45px_rgba(109,75,54,0.08)] sm:p-8"
              noValidate
              onSubmit={handleSubmit}
            >
              <fieldset className="space-y-8">
                <legend className="sr-only">Birth plan builder intake form</legend>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="fullName"
                      className="block text-sm font-medium text-[#4b382c]"
                    >
                      Full Name
                    </label>
                    <input
                      ref={firstInputRef}
                      id="fullName"
                      name="fullName"
                      type="text"
                      value={values.fullName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      aria-invalid={Boolean(
                        getVisibleError(
                          "fullName",
                          errors,
                          touched,
                          hasSubmitted
                        )
                      )}
                      aria-describedby={
                        getVisibleError(
                          "fullName",
                          errors,
                          touched,
                          hasSubmitted
                        )
                          ? "fullName-error"
                          : undefined
                      }
                      className="mt-2 w-full rounded-2xl border border-[#dfd0c1] bg-white px-4 py-3 text-base text-[#35271f] outline-none transition focus:border-[#b78a6c] focus:ring-2 focus:ring-[#e8cfc8]"
                    />
                    {getVisibleError("fullName", errors, touched, hasSubmitted) ? (
                      <p id="fullName-error" className="mt-2 text-sm text-[#a14f3a]">
                        {getVisibleError("fullName", errors, touched, hasSubmitted)}
                      </p>
                    ) : null}
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-[#4b382c]"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      aria-invalid={Boolean(
                        getVisibleError("email", errors, touched, hasSubmitted)
                      )}
                      aria-describedby={
                        getVisibleError("email", errors, touched, hasSubmitted)
                          ? "email-error email-help"
                          : "email-help"
                      }
                      className="mt-2 w-full rounded-2xl border border-[#dfd0c1] bg-white px-4 py-3 text-base text-[#35271f] outline-none transition focus:border-[#b78a6c] focus:ring-2 focus:ring-[#e8cfc8]"
                    />
                    <p id="email-help" className="mt-2 text-sm text-[#746255]">
                      {helperText.email}
                    </p>
                    {getVisibleError("email", errors, touched, hasSubmitted) ? (
                      <p id="email-error" className="mt-2 text-sm text-[#a14f3a]">
                        {getVisibleError("email", errors, touched, hasSubmitted)}
                      </p>
                    ) : null}
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="dueDate"
                      className="block text-sm font-medium text-[#4b382c]"
                    >
                      Due Date
                    </label>
                    <input
                      id="dueDate"
                      name="dueDate"
                      type="date"
                      value={values.dueDate}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      aria-invalid={Boolean(
                        getVisibleError("dueDate", errors, touched, hasSubmitted)
                      )}
                      aria-describedby={
                        getVisibleError("dueDate", errors, touched, hasSubmitted)
                          ? "dueDate-error dueDate-help"
                          : "dueDate-help"
                      }
                      className="mt-2 w-full rounded-2xl border border-[#dfd0c1] bg-white px-4 py-3 text-base text-[#35271f] outline-none transition focus:border-[#b78a6c] focus:ring-2 focus:ring-[#e8cfc8]"
                    />
                    <p id="dueDate-help" className="mt-2 text-sm text-[#746255]">
                      {helperText.dueDate}
                    </p>
                    {getVisibleError("dueDate", errors, touched, hasSubmitted) ? (
                      <p id="dueDate-error" className="mt-2 text-sm text-[#a14f3a]">
                        {getVisibleError("dueDate", errors, touched, hasSubmitted)}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="rounded-[1.5rem] border border-[#efe1d4] bg-[#fbf6f0] p-5">
                  <h4 className="text-lg text-[#684835] [font-family:Georgia,'Times_New_Roman',serif]">
                    A little context for the next step
                  </h4>
                  <div className="mt-5 grid gap-6 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label
                        htmlFor="careProvider"
                        className="block text-sm font-medium text-[#4b382c]"
                      >
                        Care Provider
                      </label>
                      <input
                        id="careProvider"
                        name="careProvider"
                        type="text"
                        value={values.careProvider}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        aria-describedby="careProvider-help"
                        className="mt-2 w-full rounded-2xl border border-[#dfd0c1] bg-white px-4 py-3 text-base text-[#35271f] outline-none transition focus:border-[#b78a6c] focus:ring-2 focus:ring-[#e8cfc8]"
                      />
                      <p
                        id="careProvider-help"
                        className="mt-2 text-sm text-[#746255]"
                      >
                        {helperText.careProvider}
                      </p>
                    </div>

                    <div>
                      <label
                        htmlFor="plannedBirthLocation"
                        className="block text-sm font-medium text-[#4b382c]"
                      >
                        Planned Birth Location
                      </label>
                      <select
                        id="plannedBirthLocation"
                        name="plannedBirthLocation"
                        value={values.plannedBirthLocation}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="mt-2 w-full rounded-2xl border border-[#dfd0c1] bg-white px-4 py-3 text-base text-[#35271f] outline-none transition focus:border-[#b78a6c] focus:ring-2 focus:ring-[#e8cfc8]"
                      >
                        <option value="">Select one</option>
                        {birthLocationOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="supportPersonName"
                        className="block text-sm font-medium text-[#4b382c]"
                      >
                        Partner / Support Person Name
                      </label>
                      <input
                        id="supportPersonName"
                        name="supportPersonName"
                        type="text"
                        value={values.supportPersonName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        aria-describedby="supportPersonName-help"
                        className="mt-2 w-full rounded-2xl border border-[#dfd0c1] bg-white px-4 py-3 text-base text-[#35271f] outline-none transition focus:border-[#b78a6c] focus:ring-2 focus:ring-[#e8cfc8]"
                      />
                      <p
                        id="supportPersonName-help"
                        className="mt-2 text-sm text-[#746255]"
                      >
                        {helperText.supportPersonName}
                      </p>
                    </div>
                  </div>
                </div>
              </fieldset>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-[#6d584b]">
                  You can update these details later if your plans change.
                </p>
                <button
                  type="submit"
                  disabled={!isFormValid}
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
