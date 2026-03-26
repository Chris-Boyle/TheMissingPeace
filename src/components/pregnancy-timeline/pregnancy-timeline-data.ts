export type ParentExperience = "" | "yes" | "no";
export type BirthSettingPreference =
  | ""
  | "hospital"
  | "birth-center"
  | "home"
  | "not-sure";

export type StageKey =
  | "first-trimester"
  | "second-trimester"
  | "third-trimester"
  | "birth-preparation-window"
  | "postpartum-planning";

export type TimelineStage = {
  key: StageKey;
  title: string;
  weeksLabel: string;
  startWeek: number;
  endWeek: number;
  overview: string;
  focus: string;
  reminder: string;
};

export type TimelineInputs = {
  dueDate: string;
  isFirstTimeParent: ParentExperience;
  birthSettingPreference: BirthSettingPreference;
};

export type TimelineResult = {
  dueDate: string;
  currentWeek: number;
  trimester: "First Trimester" | "Second Trimester" | "Third Trimester";
  daysUntilDue: number;
  currentStage: TimelineStage;
  stages: TimelineStage[];
  summary: string;
  nextSteps: string[];
  nextFocusHeading: string;
  supportNote: string;
};

export const timelineStages: TimelineStage[] = [
  {
    key: "first-trimester",
    title: "First Trimester",
    weeksLabel: "Weeks 1-13",
    startWeek: 1,
    endWeek: 13,
    overview:
      "This early stretch is often about settling in, adjusting expectations, and making space for rest.",
    focus:
      "Choose your provider, begin gentle questions, and notice what kind of support helps you feel steadier.",
    reminder:
      "You do not need to have every answer yet. Early support can make the whole path feel softer.",
  },
  {
    key: "second-trimester",
    title: "Second Trimester",
    weeksLabel: "Weeks 14-27",
    startWeek: 14,
    endWeek: 27,
    overview:
      "This is often a good season for learning, planning, and shaping the kind of birth experience you want.",
    focus:
      "Gather education, think through preferences, and start outlining what support would feel grounding in labor.",
    reminder:
      "Clear preparation now can make later decisions feel much less overwhelming.",
  },
  {
    key: "third-trimester",
    title: "Third Trimester",
    weeksLabel: "Weeks 28-34",
    startWeek: 28,
    endWeek: 34,
    overview:
      "As birth feels closer, many families start wanting more clarity, more calm, and a stronger sense of readiness.",
    focus:
      "Review your preferences, talk through comfort measures, and make sure your support team knows what matters to you.",
    reminder:
      "This is a good time to bring practical planning and emotional reassurance together.",
  },
  {
    key: "birth-preparation-window",
    title: "Birth Preparation Window",
    weeksLabel: "Weeks 35-37",
    startWeek: 35,
    endWeek: 37,
    overview:
      "This window is about refining your plans so the final stretch feels calmer and less rushed.",
    focus:
      "Finalize your birth plan, pack what you need, and review how you want support to look when labor begins.",
    reminder:
      "A little intentional preparation now can create much more ease when things start moving.",
  },
  {
    key: "postpartum-planning",
    title: "Postpartum Planning",
    weeksLabel: "Weeks 38-40",
    startWeek: 38,
    endWeek: 40,
    overview:
      "Late pregnancy is also a meaningful time to think about recovery, rest, feeding support, and help at home.",
    focus:
      "Make a simple postpartum plan for meals, rest, communication, and the first few days after birth.",
    reminder:
      "Planning for after birth is not extra. It is part of feeling held through the whole experience.",
  },
];

const dayInMs = 24 * 60 * 60 * 1000;

function normalizeDate(date: Date) {
  const nextDate = new Date(date);
  nextDate.setHours(12, 0, 0, 0);
  return nextDate;
}

function parseDateInput(value: string) {
  return normalizeDate(new Date(`${value}T12:00:00`));
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function formatBirthSetting(preference: BirthSettingPreference) {
  switch (preference) {
    case "hospital":
      return "hospital birth";
    case "birth-center":
      return "birth center birth";
    case "home":
      return "home birth";
    case "not-sure":
      return "birth setting";
    default:
      return "";
  }
}

function getCurrentStage(currentWeek: number) {
  return (
    timelineStages.find(
      (stage) =>
        currentWeek >= stage.startWeek && currentWeek <= stage.endWeek
    ) ?? timelineStages[timelineStages.length - 1]
  );
}

function getTrimester(currentWeek: number) {
  if (currentWeek <= 13) {
    return "First Trimester" as const;
  }

  if (currentWeek <= 27) {
    return "Second Trimester" as const;
  }

  return "Third Trimester" as const;
}

function getSummary(
  currentWeek: number,
  trimester: TimelineResult["trimester"],
  daysUntilDue: number
) {
  if (daysUntilDue <= 14) {
    return `You are in week ${currentWeek} and getting close to meeting your baby. This is a gentle time to simplify, rest, and focus on the support you want nearby.`;
  }

  if (trimester === "First Trimester") {
    return `You are in week ${currentWeek}, which is still early in pregnancy. This is a good time to settle in, ask first questions, and begin shaping support around you.`;
  }

  if (trimester === "Second Trimester") {
    return `You are in week ${currentWeek}, often a good season for learning and thoughtful planning. This is where many families start building real confidence for birth.`;
  }

  return `You are in week ${currentWeek}, with birth feeling more real and more near. This stage is often about bringing your preferences, preparation, and support plan into clearer focus.`;
}

function getNextFocusHeading(stage: TimelineStage) {
  switch (stage.key) {
    case "first-trimester":
      return "What to focus on next";
    case "second-trimester":
      return "What to build on next";
    case "third-trimester":
      return "What to prepare next";
    case "birth-preparation-window":
      return "What to finalize next";
    case "postpartum-planning":
      return "What to hold onto next";
    default:
      return "What to focus on next";
  }
}

export function calculatePregnancyTimeline(
  inputs: TimelineInputs
): TimelineResult {
  const dueDate = parseDateInput(inputs.dueDate);
  const today = normalizeDate(new Date());
  const daysUntilDue = Math.round(
    (dueDate.getTime() - today.getTime()) / dayInMs
  );
  const currentWeek = clamp(40 - Math.floor(daysUntilDue / 7), 1, 40);
  const trimester = getTrimester(currentWeek);
  const currentStage = getCurrentStage(currentWeek);
  const birthSetting = formatBirthSetting(inputs.birthSettingPreference);

  const nextSteps = [
    currentStage.focus,
    inputs.isFirstTimeParent === "yes"
      ? "Because this is your first baby, leave extra room for questions, education, and talking through what labor may feel like."
      : "Notice where practical support and emotional support overlap, and make sure both have a place in your plan.",
    birthSetting
      ? `If you are leaning toward a ${birthSetting}, begin shaping questions and preferences that fit that setting.`
      : "If you are still deciding on your birth setting, this is a good time to talk through what environment would help you feel safest and most supported.",
  ];

  const supportNote =
    currentWeek >= 28
      ? "Support tends to feel more valuable as decisions, logistics, and emotions start stacking up. You do not need to carry all of that by yourself."
      : "Steady support early on can make each later stage feel more grounded, informed, and less overwhelming.";

  return {
    dueDate: inputs.dueDate,
    currentWeek,
    trimester,
    daysUntilDue,
    currentStage,
    stages: timelineStages,
    summary: getSummary(currentWeek, trimester, daysUntilDue),
    nextSteps,
    nextFocusHeading: getNextFocusHeading(currentStage),
    supportNote,
  };
}
