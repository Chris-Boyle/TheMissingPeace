import type {
  BirthSettingPreference,
  ParentExperience,
} from "./pregnancy-timeline-data";

type DueDateFormValues = {
  dueDate: string;
  isFirstTimeParent: ParentExperience;
  birthSettingPreference: BirthSettingPreference;
};

type DueDateFormProps = {
  values: DueDateFormValues;
  dueDateError?: string;
  onChange: (name: keyof DueDateFormValues, value: string) => void;
  onSubmit: () => void;
};

export function DueDateForm({
  values,
  dueDateError,
  onChange,
  onSubmit,
}: DueDateFormProps) {
  return (
    <div className="rounded-[1.75rem] border border-[#e2d5c7] bg-[#fffdfa] p-6 shadow-[0_18px_45px_rgba(109,75,54,0.08)] sm:p-8">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8c6a52]">
          Pregnancy Timeline Tool
        </p>
        <h2
          id="pregnancy-timeline-heading"
          className="mt-4 text-3xl text-[#684835] sm:text-4xl"
        >
          See where you are now and what might help next.
        </h2>
        <p className="mt-4 text-lg leading-8 text-[#57453a]">
          Enter your due date for a gentle, personalized roadmap through the
          rest of pregnancy.
        </p>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        <div>
          <label
            htmlFor="timeline-due-date"
            className="block text-sm font-medium text-[#4b382c]"
          >
            Due date
          </label>
          <input
            id="timeline-due-date"
            type="date"
            value={values.dueDate}
            onChange={(event) => onChange("dueDate", event.target.value)}
            aria-invalid={Boolean(dueDateError)}
            aria-describedby={dueDateError ? "timeline-due-date-error" : undefined}
            className="mt-2 w-full rounded-2xl border border-[#dfd0c1] bg-white px-4 py-3 text-base text-[#35271f] outline-none transition focus:border-[#b78a6c] focus:ring-2 focus:ring-[#e8cfc8]"
          />
          {dueDateError ? (
            <p
              id="timeline-due-date-error"
              className="mt-2 text-sm text-[#a14f3a]"
            >
              {dueDateError}
            </p>
          ) : (
            <p className="mt-2 text-sm leading-6 text-[#6a5446]">
              This is the one field needed to build your timeline.
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="timeline-first-time-parent"
            className="block text-sm font-medium text-[#4b382c]"
          >
            First-time parent? <span className="text-[#8c6a52]">Optional</span>
          </label>
          <select
            id="timeline-first-time-parent"
            value={values.isFirstTimeParent}
            onChange={(event) =>
              onChange("isFirstTimeParent", event.target.value)
            }
            className="mt-2 w-full rounded-2xl border border-[#dfd0c1] bg-white px-4 py-3 text-base text-[#35271f] outline-none transition focus:border-[#b78a6c] focus:ring-2 focus:ring-[#e8cfc8]"
          >
            <option value="">Select if you want</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="timeline-birth-setting"
            className="block text-sm font-medium text-[#4b382c]"
          >
            Birth setting preference{" "}
            <span className="text-[#8c6a52]">Optional</span>
          </label>
          <select
            id="timeline-birth-setting"
            value={values.birthSettingPreference}
            onChange={(event) =>
              onChange("birthSettingPreference", event.target.value)
            }
            className="mt-2 w-full rounded-2xl border border-[#dfd0c1] bg-white px-4 py-3 text-base text-[#35271f] outline-none transition focus:border-[#b78a6c] focus:ring-2 focus:ring-[#e8cfc8]"
          >
            <option value="">Choose if helpful</option>
            <option value="hospital">Hospital</option>
            <option value="birth-center">Birth center</option>
            <option value="home">Home</option>
            <option value="not-sure">Not sure yet</option>
          </select>
        </div>
      </div>

      <button
        type="button"
        onClick={onSubmit}
        className="mt-8 inline-flex items-center justify-center rounded-full bg-[#7d5c3c] px-6 py-3 text-base font-semibold text-[#fffaf5] transition hover:bg-[#694a30] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7d5c3c]"
      >
        Build My Timeline
      </button>
    </div>
  );
}
