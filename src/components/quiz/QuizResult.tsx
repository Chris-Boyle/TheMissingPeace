import Link from "next/link";

type QuizResultContent = {
  bucket: "high-support" | "moderate-support" | "exploratory";
  headline: string;
  explanation: string[];
  supportingPoints: string[];
};

type QuizResultProps = {
  result: QuizResultContent;
  onRetake: () => void;
};

export function QuizResult({ result, onRetake }: QuizResultProps) {
  return (
    <div className="rounded-[2rem] bg-[linear-gradient(180deg,#fffaf5_0%,#f4eadf_100%)] p-6 shadow-[0_24px_60px_rgba(109,75,54,0.12)] sm:p-8">
      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8c6a52]">
        Your Result
      </p>
      <h3 className="mt-4 text-3xl text-[#684835] sm:text-4xl">
        {result.headline}
      </h3>

      <div className="mt-5 space-y-4 text-lg leading-8 text-[#57453a]">
        {result.explanation.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      <ul className="mt-8 grid gap-3 sm:grid-cols-2">
        {result.supportingPoints.map((point) => (
          <li
            key={point}
            className="rounded-[1.25rem] border border-[#e5d7c8] bg-[rgba(255,250,245,0.82)] px-4 py-4 text-base leading-7 text-[#4f3d33]"
          >
            {point}
          </li>
        ))}
      </ul>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/consultation"
          className="inline-flex items-center justify-center rounded-full bg-[#7d5c3c] px-6 py-3 text-base font-semibold text-[#fffaf5] transition hover:bg-[#694a30]"
        >
          Book a Consultation
        </Link>
        <Link
          href="/birth-plan-builder"
          className="inline-flex items-center justify-center rounded-full border border-[#cdb6a2] bg-white/70 px-6 py-3 text-base font-semibold text-[#5c4130] transition hover:bg-[#f7ecdf]"
        >
          Start Your Birth Plan
        </Link>
      </div>

      <button
        type="button"
        onClick={onRetake}
        className="mt-5 text-sm font-medium text-[#6f523f] underline decoration-[#c6aa93] underline-offset-4 transition hover:text-[#54382a]"
      >
        Retake the quiz
      </button>
    </div>
  );
}
