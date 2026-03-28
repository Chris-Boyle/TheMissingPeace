import { getConsultationCalendarId } from "@/lib/consultation-booking/config";
import { ConsultationBookingError } from "@/lib/consultation-booking/errors";
import type { BusyInterval } from "@/lib/consultation-booking/types";

type GoogleAccessTokenResponse = {
  access_token?: string;
  error?: string;
  error_description?: string;
};

function getRequiredEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    console.error("Missing Google Calendar configuration", { name });
    throw new ConsultationBookingError(
      "Calendar integration is not available right now.",
      { status: 500, code: "MISSING_ENV" }
    );
  }

  return value;
}

async function getGoogleAccessToken() {
  const clientId = getRequiredEnv("GOOGLE_CLIENT_ID");
  const clientSecret = getRequiredEnv("GOOGLE_CLIENT_SECRET");
  const refreshToken = getRequiredEnv("GOOGLE_REFRESH_TOKEN");

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  const payload = (await response.json()) as GoogleAccessTokenResponse;

  if (!response.ok || !payload.access_token) {
    console.error("Google Calendar auth failed", {
      status: response.status,
      error: payload.error,
      errorDescription: payload.error_description,
    });
    throw new ConsultationBookingError(
      "Calendar integration is not available right now.",
      { status: 502, code: "GOOGLE_AUTH_FAILED" }
    );
  }

  return payload.access_token;
}

async function googleCalendarFetch(
  input: string,
  init?: RequestInit
) {
  const accessToken = await getGoogleAccessToken();
  const response = await fetch(input, {
    ...init,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Google Calendar request failed", {
      status: response.status,
      body: errorText,
      input,
    });
    throw new ConsultationBookingError(
      "Calendar integration is not available right now.",
      { status: 502, code: "GOOGLE_CALENDAR_REQUEST_FAILED" }
    );
  }

  return response;
}

export async function queryGoogleCalendarBusyTimes(params: {
  timeMin: string;
  timeMax: string;
  timeZone: string;
}) {
  const response = await googleCalendarFetch(
    "https://www.googleapis.com/calendar/v3/freeBusy",
    {
      method: "POST",
      body: JSON.stringify({
        timeMin: params.timeMin,
        timeMax: params.timeMax,
        timeZone: params.timeZone,
        items: [{ id: getConsultationCalendarId() }],
      }),
    }
  );

  const payload = (await response.json()) as {
    calendars?: Record<string, { busy?: Array<{ start: string; end: string }> }>;
  };
  const calendarBusy =
    payload.calendars?.[getConsultationCalendarId()]?.busy || [];

  return calendarBusy.map<BusyInterval>((interval) => ({
    start: interval.start,
    end: interval.end,
    source: "google",
  }));
}

export async function createGoogleCalendarEvent(params: {
  fullName: string;
  email: string;
  phone?: string;
  notes?: string;
  consultationType: string;
  startTime: string;
  endTime: string;
  timeZone: string;
}) {
  const descriptionLines = [
    `Consultation type: ${params.consultationType}`,
    `Client email: ${params.email}`,
    params.phone ? `Client phone: ${params.phone}` : null,
    params.notes ? `Notes: ${params.notes}` : null,
    "",
    "Future hook: add confirmation email and meeting link workflow here.",
  ].filter(Boolean);

  const response = await googleCalendarFetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
      getConsultationCalendarId()
    )}/events?sendUpdates=all`,
    {
      method: "POST",
      body: JSON.stringify({
        summary: `Consultation - ${params.fullName}`,
        description: descriptionLines.join("\n"),
        start: {
          dateTime: params.startTime,
          timeZone: params.timeZone,
        },
        end: {
          dateTime: params.endTime,
          timeZone: params.timeZone,
        },
        attendees: [{ email: params.email }],
      }),
    }
  );

  return (await response.json()) as { id: string };
}

export async function deleteGoogleCalendarEvent(eventId: string) {
  await googleCalendarFetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
      getConsultationCalendarId()
    )}/events/${encodeURIComponent(eventId)}?sendUpdates=none`,
    {
      method: "DELETE",
    }
  );
}
