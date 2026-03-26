import { CONSULTATION_CONFIG, getConsultationTimeZone } from "./config";
import { ConsultationBookingError } from "./errors";
import {
  addMinutes,
  formatDateTimeLabel,
  getDateStringForInstant,
  zonedDateTimeToUtc,
} from "./time";
import { createConsultationBookingRepository } from "./repository";
import { buildSlotsFromBusinessRules, mergeBusyIntervals } from "./slots";
import { validateAvailabilityDate, validateBookingInput } from "./validation";
import {
  createGoogleCalendarEvent,
  queryGoogleCalendarBusyTimes,
} from "@/lib/google-calendar/google-calendar";
import type {
  ConsultationAvailabilityResult,
  ConsultationBookingConfirmation,
  ConsultationBookingInput,
} from "./types";

export type ConsultationDependencies = {
  repository: ReturnType<typeof createConsultationBookingRepository>;
  calendarClient: {
    queryBusyTimes: typeof queryGoogleCalendarBusyTimes;
    createEvent: typeof createGoogleCalendarEvent;
  };
  now: () => Date;
  timeZone: string;
};

export function createConsultationDependencies(): ConsultationDependencies {
  return {
    repository: createConsultationBookingRepository(),
    calendarClient: {
      queryBusyTimes: queryGoogleCalendarBusyTimes,
      createEvent: createGoogleCalendarEvent,
    },
    now: () => new Date(),
    timeZone: getConsultationTimeZone(),
  };
}

function getDayRange(date: string, timeZone: string) {
  const timeMin = zonedDateTimeToUtc(date, 0, 0, timeZone);
  const timeMax = zonedDateTimeToUtc(date, 23, 59, timeZone);

  return {
    timeMin: timeMin.toISOString(),
    timeMax: timeMax.toISOString(),
  };
}

export async function getAvailableConsultationSlots(
  date: string,
  dependencies = createConsultationDependencies()
): Promise<ConsultationAvailabilityResult> {
  validateAvailabilityDate(date, dependencies.timeZone, dependencies.now());

  const { timeMin, timeMax } = getDayRange(date, dependencies.timeZone);
  const [googleBusyTimes, databaseBusyTimes] = await Promise.all([
    dependencies.calendarClient.queryBusyTimes({
      timeMin,
      timeMax,
      timeZone: dependencies.timeZone,
    }),
    Promise.resolve(
      dependencies.repository.getBusyIntervals(timeMin, timeMax)
    ),
  ]);

  const slots = buildSlotsFromBusinessRules({
    date,
    timeZone: dependencies.timeZone,
    busyIntervals: mergeBusyIntervals([...googleBusyTimes, ...databaseBusyTimes]),
  });

  return {
    date,
    timeZone: dependencies.timeZone,
    slots,
  };
}

export async function createConsultationBooking(
  payload: Partial<ConsultationBookingInput>,
  dependencies = createConsultationDependencies()
): Promise<ConsultationBookingConfirmation> {
  const bookingInput = validateBookingInput(
    payload,
    dependencies.timeZone,
    dependencies.now()
  );
  const startTime = new Date(bookingInput.startTime);
  const endTime = addMinutes(startTime, CONSULTATION_CONFIG.durationMinutes);
  const slotDate = getDateStringForInstant(startTime, dependencies.timeZone);

  const availability = await getAvailableConsultationSlots(
    slotDate,
    dependencies
  );
  const slotStillAvailable = availability.slots.some(
    (slot) => slot.startTime === bookingInput.startTime
  );

  if (!slotStillAvailable) {
    throw new ConsultationBookingError(
      "That time was just booked. Please choose another available slot.",
      {
        status: 409,
        code: "SLOT_NO_LONGER_AVAILABLE",
      }
    );
  }

  const pendingBooking = dependencies.repository.createPendingBooking({
    ...bookingInput,
    endTime: endTime.toISOString(),
    timezone: dependencies.timeZone,
    consultationType:
      bookingInput.consultationType || CONSULTATION_CONFIG.defaultConsultationType,
  });

  try {
    const event = await dependencies.calendarClient.createEvent({
      fullName: pendingBooking.fullName,
      email: pendingBooking.email,
      phone: pendingBooking.phone || undefined,
      notes: pendingBooking.notes || undefined,
      consultationType:
        pendingBooking.consultationType ||
        CONSULTATION_CONFIG.defaultConsultationType,
      startTime: pendingBooking.startTime,
      endTime: pendingBooking.endTime,
      timeZone: dependencies.timeZone,
    });
    const booking = dependencies.repository.confirmBooking(
      pendingBooking.id,
      event.id
    );

    return {
      booking,
      displayTime: formatDateTimeLabel(
        new Date(booking.startTime),
        dependencies.timeZone
      ),
    };
  } catch (error) {
    dependencies.repository.markFailed(pendingBooking.id);
    throw error;
  }
}
