"use client";

import { useMemo, useRef, useState } from "react";
import { DueDateForm } from "./DueDateForm";
import { NextStepsCard } from "./NextStepsCard";
import {
  calculatePregnancyTimeline,
  type TimelineInputs,
} from "./pregnancy-timeline-data";
import { TimelineStageCard } from "./TimelineStageCard";
import { TimelineSummaryCard } from "./TimelineSummaryCard";

const initialValues: TimelineInputs = {
  dueDate: "",
  isFirstTimeParent: "",
  birthSettingPreference: "",
};

function formatDueDateLabel(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${value}T12:00:00`));
}

export function PregnancyTimelineTool() {
  const [values, setValues] = useState<TimelineInputs>(initialValues);
  const [submittedValues, setSubmittedValues] = useState<TimelineInputs | null>(
    null
  );
  const [dueDateError, setDueDateError] = useState<string>();
  const resultsRef = useRef<HTMLDivElement>(null);

  const timeline = useMemo(() => {
    if (!submittedValues) {
      return null;
    }

    return calculatePregnancyTimeline(submittedValues);
  }, [submittedValues]);

  function handleChange(name: keyof TimelineInputs, value: string) {
    setValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));

    if (name === "dueDate") {
      setDueDateError(undefined);
    }
  }

  function handleSubmit() {
    if (!values.dueDate) {
      setDueDateError("Please choose your due date to build your timeline.");
      return;
    }

    setDueDateError(undefined);
    setSubmittedValues(values);

    window.setTimeout(() => {
      resultsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 120);
  }

  return (
    <section
      id="pregnancy-timeline-tool"
      className="px-4 py-10 sm:px-6 lg:px-8 lg:py-14"
      aria-labelledby="pregnancy-timeline-heading"
    >
      <div className="mx-auto max-w-6xl space-y-8">
        <DueDateForm
          values={values}
          dueDateError={dueDateError}
          onChange={handleChange}
          onSubmit={handleSubmit}
        />

        {timeline ? (
          <div ref={resultsRef} className="space-y-8">
            <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
              <TimelineSummaryCard
                currentWeek={timeline.currentWeek}
                trimester={timeline.trimester}
                dueDateLabel={formatDueDateLabel(timeline.dueDate)}
                summary={timeline.summary}
              />
              <NextStepsCard
                heading={timeline.nextFocusHeading}
                stageTitle={timeline.currentStage.title}
                steps={timeline.nextSteps}
                supportNote={timeline.supportNote}
              />
            </div>

            <div className="rounded-[2rem] border border-[#e2d5c7] bg-[#fffaf5] p-6 shadow-[0_20px_55px_rgba(109,75,54,0.08)] sm:p-8">
              <div className="max-w-3xl">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8c6a52]">
                  Your Timeline
                </p>
                <h3 className="mt-4 text-3xl text-[#684835] sm:text-4xl">
                  A calm roadmap for the rest of pregnancy.
                </h3>
                <p className="mt-4 text-lg leading-8 text-[#57453a]">
                  Follow the path below to see what has already passed, where
                  you are now, and what is coming into view next.
                </p>
              </div>

              <div className="relative mt-8 space-y-6 before:absolute before:bottom-0 before:left-[0.45rem] before:top-3 before:w-px before:bg-[#e6d9cc]">
                {timeline.stages.map((stage) => {
                  const status =
                    timeline.currentWeek > stage.endWeek
                      ? "complete"
                      : timeline.currentStage.key === stage.key
                        ? "current"
                        : "upcoming";

                  return (
                    <TimelineStageCard
                      key={stage.key}
                      stage={stage}
                      status={status}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
