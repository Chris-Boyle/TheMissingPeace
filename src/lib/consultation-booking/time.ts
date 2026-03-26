const dateFormatterCache = new Map<string, Intl.DateTimeFormat>();

function getFormatter(
  timeZone: string,
  options: Intl.DateTimeFormatOptions
) {
  const key = JSON.stringify([timeZone, options]);

  if (!dateFormatterCache.has(key)) {
    dateFormatterCache.set(
      key,
      new Intl.DateTimeFormat("en-US", {
        timeZone,
        ...options,
      })
    );
  }

  return dateFormatterCache.get(key)!;
}

function parseOffsetToMilliseconds(offsetLabel: string) {
  const normalized = offsetLabel.replace("GMT", "");
  const match = normalized.match(/^([+-])(\d{1,2})(?::?(\d{2}))?$/);

  if (!match) {
    return 0;
  }

  const [, sign, hours, minutes = "00"] = match;
  const multiplier = sign === "-" ? -1 : 1;

  return (
    multiplier *
    ((Number(hours) * 60 + Number(minutes)) * 60 * 1000)
  );
}

export function getTimeZoneOffsetMilliseconds(date: Date, timeZone: string) {
  const formatter = getFormatter(timeZone, {
    timeZoneName: "longOffset",
    hour: "2-digit",
    minute: "2-digit",
  });
  const timeZoneName =
    formatter.formatToParts(date).find((part) => part.type === "timeZoneName")
      ?.value ?? "GMT+00:00";

  return parseOffsetToMilliseconds(timeZoneName);
}

export function zonedDateTimeToUtc(
  date: string,
  hour: number,
  minute: number,
  timeZone: string
) {
  const [year, month, day] = date.split("-").map(Number);
  const utcGuess = new Date(Date.UTC(year, month - 1, day, hour, minute, 0));
  const offset = getTimeZoneOffsetMilliseconds(utcGuess, timeZone);

  return new Date(utcGuess.getTime() - offset);
}

export function addMinutes(date: Date, minutes: number) {
  return new Date(date.getTime() + minutes * 60 * 1000);
}

export function formatTimeLabel(date: Date, timeZone: string) {
  return getFormatter(timeZone, {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function formatDateLabel(date: Date, timeZone: string) {
  return getFormatter(timeZone, {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function formatDateTimeLabel(date: Date, timeZone: string) {
  return getFormatter(timeZone, {
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function getDateStringInTimeZone(date: Date, timeZone: string) {
  return getFormatter(timeZone, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .format(date)
    .split("/")
    .reverse()
    .join("-");
}

export function getWeekdayForDate(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day, 12)).getUTCDay();
}

export function isPastOrSameDay(date: string, timeZone: string, now = new Date()) {
  const today = getDateStringInTimeZone(now, timeZone);
  return date <= today;
}

export function getNextBookableDate(timeZone: string, now = new Date()) {
  let candidate = addMinutes(now, 24 * 60);

  while (true) {
    const date = getDateStringInTimeZone(candidate, timeZone);
    const weekday = getWeekdayForDate(date);

    if (weekday >= 1 && weekday <= 5) {
      return date;
    }

    candidate = addMinutes(candidate, 24 * 60);
  }
}

export function getLocalTimeParts(date: Date, timeZone: string) {
  const parts = getFormatter(timeZone, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);

  const getPart = (type: string) =>
    Number(parts.find((part) => part.type === type)?.value ?? "0");

  return {
    year: getPart("year"),
    month: getPart("month"),
    day: getPart("day"),
    hour: getPart("hour"),
    minute: getPart("minute"),
  };
}

export function getDateStringForInstant(date: Date, timeZone: string) {
  const parts = getLocalTimeParts(date, timeZone);
  return `${String(parts.year).padStart(4, "0")}-${String(parts.month).padStart(
    2,
    "0"
  )}-${String(parts.day).padStart(2, "0")}`;
}
