import { CONSULTATION_CONFIG } from "./config";
import { addMinutes, formatTimeLabel, zonedDateTimeToUtc } from "./time";
import type { BusyInterval, ConsultationSlot } from "./types";

function intervalsOverlap(
  startA: Date,
  endA: Date,
  startB: Date,
  endB: Date
) {
  return startA < endB && endA > startB;
}

export function buildSlotsFromBusinessRules(params: {
  date: string;
  busyIntervals: BusyInterval[];
  timeZone: string;
}) {
  const { date, busyIntervals, timeZone } = params;
  const slots: ConsultationSlot[] = [];
  const startOfDay = zonedDateTimeToUtc(
    date,
    CONSULTATION_CONFIG.bookingStartHour,
    0,
    timeZone
  );
  const endBoundary = zonedDateTimeToUtc(
    date,
    CONSULTATION_CONFIG.bookingEndHour,
    0,
    timeZone
  );

  for (
    let slotStart = startOfDay;
    addMinutes(slotStart, CONSULTATION_CONFIG.durationMinutes) <= endBoundary;
    slotStart = addMinutes(slotStart, CONSULTATION_CONFIG.slotIncrementMinutes)
  ) {
    const slotEnd = addMinutes(slotStart, CONSULTATION_CONFIG.durationMinutes);
    const protectedStart = addMinutes(slotStart, -CONSULTATION_CONFIG.bufferMinutes);
    const protectedEnd = addMinutes(slotEnd, CONSULTATION_CONFIG.bufferMinutes);

    const hasConflict = busyIntervals.some((interval) =>
      intervalsOverlap(
        protectedStart,
        protectedEnd,
        new Date(interval.start),
        new Date(interval.end)
      )
    );

    if (!hasConflict) {
      slots.push({
        startTime: slotStart.toISOString(),
        endTime: slotEnd.toISOString(),
        label: formatTimeLabel(slotStart, timeZone),
      });
    }
  }

  return slots;
}

export function mergeBusyIntervals(intervals: BusyInterval[]) {
  const sorted = [...intervals].sort((left, right) =>
    left.start.localeCompare(right.start)
  );

  return sorted.reduce<BusyInterval[]>((merged, interval) => {
    const last = merged.at(-1);

    if (!last) {
      merged.push(interval);
      return merged;
    }

    if (new Date(interval.start) <= new Date(last.end)) {
      if (new Date(interval.end) > new Date(last.end)) {
        last.end = interval.end;
      }

      return merged;
    }

    merged.push(interval);
    return merged;
  }, []);
}
