type ProgressHeaderProps = {
  currentStep: number;
  totalSteps: number;
  sectionLabel: string;
  supportText?: string;
};

export function ProgressHeader({
  currentStep,
  totalSteps,
  sectionLabel,
  supportText = "A calm first step to personalize your plan.",
}: ProgressHeaderProps) {
  const progress = Math.round((currentStep / totalSteps) * 100);

  return (
    <header className="rounded-[1.75rem] border border-[#e4d6c8] bg-[#fffaf5] p-6 shadow-[0_16px_45px_rgba(109,75,54,0.08)]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8c6a52]">
            Step {currentStep} of {totalSteps}
          </p>
          <h2 className="mt-2 text-3xl text-[#684835] [font-family:Georgia,'Times_New_Roman',serif]">
            {sectionLabel}
          </h2>
        </div>
        <p className="text-sm text-[#5f4a3d]">{supportText}</p>
      </div>
      <div className="mt-5">
        <div
          className="h-3 overflow-hidden rounded-full bg-[#eadfd3]"
          aria-hidden="true"
        >
          <div
            className="h-full rounded-full bg-[#7d5c3c] transition-[width] duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-2 text-sm text-[#6b5648]">{progress}% complete</p>
      </div>
    </header>
  );
}
