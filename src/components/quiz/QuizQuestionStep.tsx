type QuizOption = {
  label: string;
  value: string;
};

type QuizQuestionStepProps = {
  questionId: string;
  title: string;
  description?: string;
  options: QuizOption[];
  isMultiSelect?: boolean;
  selectedValues: string[];
  onChange: (nextValues: string[]) => void;
  onNext: () => void;
  onBack: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
};

export function QuizQuestionStep({
  questionId,
  title,
  description,
  options,
  isMultiSelect = false,
  selectedValues,
  onChange,
  onNext,
  onBack,
  isFirstStep,
  isLastStep,
}: QuizQuestionStepProps) {
  const inputType = isMultiSelect ? "checkbox" : "radio";
  const canContinue = selectedValues.length > 0;

  function handleOptionChange(value: string) {
    if (isMultiSelect) {
      const isSelected = selectedValues.includes(value);
      const nextValues = isSelected
        ? selectedValues.filter((selectedValue) => selectedValue !== value)
        : [...selectedValues, value];

      onChange(nextValues);
      return;
    }

    onChange([value]);
  }

  return (
    <div className="rounded-[2rem] border border-[#e2d5c7] bg-[#fffaf5] p-6 shadow-[0_20px_55px_rgba(109,75,54,0.08)] sm:p-8">
      <fieldset>
        <legend className="text-2xl text-[#684835] sm:text-3xl">{title}</legend>
        {description ? (
          <p className="mt-3 text-base leading-7 text-[#6a5446]">{description}</p>
        ) : null}

        <div className="mt-6 grid gap-3">
          {options.map((option) => {
            const isSelected = selectedValues.includes(option.value);

            return (
              <label
                key={option.value}
                className={`flex cursor-pointer items-start gap-4 rounded-[1.5rem] border px-4 py-4 text-left transition sm:px-5 ${
                  isSelected
                    ? "border-[#b9896d] bg-[#f8efe6] shadow-[0_14px_35px_rgba(109,75,54,0.08)]"
                    : "border-[#eadfd1] bg-[#fffdf9] hover:border-[#d8c3b1] hover:bg-[#fcf4ea]"
                }`}
              >
                <input
                  type={inputType}
                  name={questionId}
                  value={option.value}
                  checked={isSelected}
                  onChange={() => handleOptionChange(option.value)}
                  className="mt-1 h-4 w-4 accent-[#7d5c3c]"
                />
                <span className="text-base leading-7 text-[#4f3d33]">
                  {option.label}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={onBack}
          className={`inline-flex items-center justify-center rounded-full border border-[#ccb6a4] px-5 py-3 text-base font-semibold text-[#5c4130] transition hover:bg-[#f7ecdf] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7d5c3c] ${
            isFirstStep ? "invisible" : ""
          }`}
        >
          Back
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={!canContinue}
          className="inline-flex items-center justify-center rounded-full bg-[#7d5c3c] px-6 py-3 text-base font-semibold text-[#fffaf5] transition hover:bg-[#694a30] disabled:cursor-not-allowed disabled:bg-[#ccb9ab] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7d5c3c]"
        >
          {isLastStep ? "See My Result" : "Continue"}
        </button>
      </div>
    </div>
  );
}
