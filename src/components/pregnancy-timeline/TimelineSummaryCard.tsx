type TimelineSummaryCardProps = {
  currentWeek: number;
  trimester: string;
  dueDateLabel: string;
  summary: string;
};

export function TimelineSummaryCard({
  currentWeek,
  trimester,
  dueDateLabel,
  summary,
}: TimelineSummaryCardProps) {
  return (
    <div className="rounded-[1.75rem] bg-[linear-gradient(180deg,#fffaf5_0%,#f5ece2_100%)] p-6 shadow-[0_20px_55px_rgba(109,75,54,0.1)] sm:p-8">
      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8c6a52]">
        Your Snapshot
      </p>
      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <div className="rounded-[1.25rem] border border-[#eadfd1] bg-[rgba(255,250,245,0.82)] px-4 py-4">
          <p className="text-sm text-[#7a604d]">Current week</p>
          <p className="mt-2 text-3xl text-[#684835]">Week {currentWeek}</p>
        </div>
        <div className="rounded-[1.25rem] border border-[#eadfd1] bg-[rgba(255,250,245,0.82)] px-4 py-4">
          <p className="text-sm text-[#7a604d]">Trimester</p>
          <p className="mt-2 text-2xl text-[#684835]">{trimester}</p>
        </div>
        <div className="rounded-[1.25rem] border border-[#eadfd1] bg-[rgba(255,250,245,0.82)] px-4 py-4">
          <p className="text-sm text-[#7a604d]">Due date</p>
          <p className="mt-2 text-2xl text-[#684835]">{dueDateLabel}</p>
        </div>
      </div>
      <p className="mt-6 text-base leading-8 text-[#57453a]">{summary}</p>
    </div>
  );
}
