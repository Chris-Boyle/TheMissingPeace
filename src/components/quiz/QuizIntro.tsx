type QuizIntroProps = {
  isStarted: boolean;
  onStart: () => void;
};

const reassurancePoints = [
  "A short, calm check-in you can finish in a minute or two.",
  "Guidance tailored to how supported and prepared you feel right now.",
  "A gentle next step if you want more clarity before birth.",
];

export function QuizIntro({ isStarted, onStart }: QuizIntroProps) {
  return (
    <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8c6a52]">
          Is a Doula Right for You?
        </p>
        <h2
          id="doula-quiz-heading"
          className="mt-4 text-3xl text-[#684835] sm:text-4xl"
        >
          A gentle way to explore what kind of support would help you feel more
          at ease.
        </h2>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-[#57453a]">
          Answer a few quick questions to see how having a doula could support
          your birth experience.
        </p>
        <button
          type="button"
          onClick={onStart}
          className="mt-8 inline-flex items-center justify-center rounded-full bg-[#7d5c3c] px-6 py-3 text-base font-semibold text-[#fffaf5] transition hover:bg-[#694a30] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7d5c3c]"
        >
          {isStarted ? "Continue the Quiz" : "Take the Quiz"}
        </button>
      </div>

      <div className="rounded-[1.75rem] border border-[#e2d5c7] bg-[linear-gradient(180deg,#fffdf9_0%,#f6eee3_100%)] p-6 shadow-[0_18px_45px_rgba(109,75,54,0.08)] sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8c6a52]">
          What you will get
        </p>
        <ul className="mt-5 space-y-4">
          {reassurancePoints.map((point) => (
            <li
              key={point}
              className="rounded-[1.25rem] border border-[#eee1d4] bg-[rgba(255,250,245,0.88)] px-4 py-4 text-base leading-7 text-[#57453a]"
            >
              {point}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
