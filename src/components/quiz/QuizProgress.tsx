type QuizProgressProps = {
  currentStep: number;
  totalSteps: number;
};

const encouragementByStep = [
  "We will keep this simple.",
  "You are doing well.",
  "A little more clarity with each step.",
  "This helps shape the support that fits you.",
  "You are almost there.",
  "One last reflection before your result.",
];

export function QuizProgress({
  currentStep,
  totalSteps,
}: QuizProgressProps) {
  const progress = Math.round((currentStep / totalSteps) * 100);
  const encouragement =
    encouragementByStep[currentStep - 1] ??
    encouragementByStep[encouragementByStep.length - 1];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-4 text-sm font-medium text-[#7a604d]">
        <span>
          Question {currentStep} of {totalSteps}
        </span>
        <span>{progress}% complete</span>
      </div>

      <div
        className="h-2 overflow-hidden rounded-full bg-[#eadfd1]"
        aria-hidden="true"
      >
        <div
          className="h-full rounded-full bg-[linear-gradient(90deg,#b8876c_0%,#8ca08a_100%)] transition-[width] duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="text-sm text-[#6a5446]">{encouragement}</p>
    </div>
  );
}
