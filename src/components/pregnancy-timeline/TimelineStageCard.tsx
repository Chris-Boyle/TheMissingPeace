import type { TimelineStage } from "./pregnancy-timeline-data";

type TimelineStageCardProps = {
  stage: TimelineStage;
  status: "complete" | "current" | "upcoming";
};

export function TimelineStageCard({
  stage,
  status,
}: TimelineStageCardProps) {
  const isCurrent = status === "current";

  return (
    <article className="relative pl-10">
      <div
        className={`absolute left-0 top-3 h-4 w-4 rounded-full border-4 ${
          isCurrent
            ? "border-[#7d5c3c] bg-[#fffaf5] shadow-[0_0_0_8px_rgba(232,207,200,0.65)]"
            : status === "complete"
              ? "border-[#a58a77] bg-[#a58a77]"
              : "border-[#dccfc1] bg-[#fffaf5]"
        }`}
        aria-hidden="true"
      />
      <div
        className={`rounded-[1.5rem] border p-5 shadow-[0_14px_35px_rgba(109,75,54,0.08)] sm:p-6 ${
          isCurrent
            ? "border-[#d7b79d] bg-[linear-gradient(180deg,#fff9f3_0%,#f5e8dc_100%)]"
            : "border-[#e4d7ca] bg-[#fffdfa]"
        }`}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8c6a52]">
              {stage.weeksLabel}
            </p>
            <h3 className="mt-2 text-2xl text-[#684835]">{stage.title}</h3>
          </div>
          <span
            className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
              isCurrent
                ? "bg-[#7d5c3c] text-[#fffaf5]"
                : status === "complete"
                  ? "bg-[#efe1d3] text-[#725543]"
                  : "bg-[#f6ede4] text-[#7a604d]"
            }`}
          >
            {isCurrent ? "You are here" : status === "complete" ? "Passed" : "Ahead"}
          </span>
        </div>

        <div className="mt-5 space-y-4 text-base leading-7 text-[#57453a]">
          <p>{stage.overview}</p>
          <p>
            <span className="font-semibold text-[#4d392e]">
              Planning focus:
            </span>{" "}
            {stage.focus}
          </p>
          <p>
            <span className="font-semibold text-[#4d392e]">
              Support reminder:
            </span>{" "}
            {stage.reminder}
          </p>
        </div>
      </div>
    </article>
  );
}
