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
  deleteGoogleCalendarEvent,
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
    deleteEvent: typeof deleteGoogleCalendarEvent;
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
      deleteEvent: deleteGoogleCalendarEvent,
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
    dependencies.repository.getBusyIntervals(timeMin, timeMax, dependencies.timeZone),
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

  const resolvedPendingBooking = await pendingBooking;
  let calendarEventId: string | null = null;

  try {
    const event = await dependencies.calendarClient.createEvent({
      fullName: resolvedPendingBooking.fullName,
      email: resolvedPendingBooking.email,
      phone: resolvedPendingBooking.phone || undefined,
      notes: resolvedPendingBooking.notes || undefined,
      consultationType:
        resolvedPendingBooking.consultationType ||
        CONSULTATION_CONFIG.defaultConsultationType,
      startTime: resolvedPendingBooking.startTime,
      endTime: resolvedPendingBooking.endTime,
      timeZone: dependencies.timeZone,
    });
    calendarEventId = event.id;
    const booking = await dependencies.repository.confirmBooking(
      resolvedPendingBooking.id,
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
    if (calendarEventId) {
      try {
        await dependencies.calendarClient.deleteEvent(calendarEventId);
      } catch (cleanupError) {
        console.error("Consultation event cleanup failed", {
          bookingId: resolvedPendingBooking.id,
          eventId: calendarEventId,
          cleanupError,
        });
      }
    }

    try {
      await dependencies.repository.markFailed(resolvedPendingBooking.id);
    } catch (repositoryError) {
      console.error("Consultation booking cleanup failed", {
        bookingId: resolvedPendingBooking.id,
        repositoryError,
      });
    }

    throw error;
  }
}
