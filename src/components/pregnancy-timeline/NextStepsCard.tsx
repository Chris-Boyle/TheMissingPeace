import Link from "next/link";

type NextStepsCardProps = {
  heading: string;
  stageTitle: string;
  steps: string[];
  supportNote: string;
};

export function NextStepsCard({
  heading,
  stageTitle,
  steps,
  supportNote,
}: NextStepsCardProps) {
  return (
    <div className="rounded-[1.75rem] border border-[#dcc8b8] bg-[#6f4d39] p-6 text-[#fff8f0] shadow-[0_24px_60px_rgba(73,49,35,0.22)] sm:p-8">
      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#ead7c4]">
        {heading}
      </p>
      <h3 className="mt-4 text-3xl text-[#fff7ef] sm:text-4xl">
        Gentle next steps for {stageTitle.toLowerCase()}
      </h3>
      <ul className="mt-6 space-y-3">
        {steps.map((step) => (
          <li
            key={step}
            className="rounded-[1.25rem] border border-[rgba(255,245,236,0.18)] bg-[rgba(255,248,240,0.08)] px-4 py-4 text-base leading-7 text-[#fff3e7]"
          >
            {step}
          </li>
        ))}
      </ul>
      <p className="mt-6 text-base leading-8 text-[#f6e6d7]">{supportNote}</p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/birth-plan-builder"
          className="inline-flex items-center justify-center rounded-full bg-[#fff8f0] px-6 py-3 text-base font-semibold text-[#5e4130] transition hover:bg-[#f6eadc]"
        >
          Start Your Birth Plan
        </Link>
        <Link
          href="/consultation"
          className="inline-flex items-center justify-center rounded-full border border-[#d9c0ad] bg-[rgba(255,248,240,0.12)] px-6 py-3 text-base font-semibold text-[#fff7ef] transition hover:bg-[rgba(255,248,240,0.2)]"
        >
          Book a Consultation
        </Link>
      </div>
    </div>
  );
}
