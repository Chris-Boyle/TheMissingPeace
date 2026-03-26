# Consultation Booking Implementation Notes

## Google Cloud setup

1. Create or use an existing Google Cloud project for the business Google account.
2. Enable the Google Calendar API.
3. Create an OAuth client that can obtain an offline refresh token for the business calendar account.
4. Grant the app access to the correct business calendar and confirm the target calendar ID.

This implementation uses the Google Calendar REST API with an OAuth refresh token on the server. It does not use Calendly and it does not expose Google credentials to the client.

## Required environment variables

Set these on the server:

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REFRESH_TOKEN`
- `GOOGLE_CALENDAR_ID`
- `CONSULTATION_TIMEZONE`
- `CONSULTATION_DB_PATH` (optional override; defaults to `data/consultation-bookings.sqlite`)

## Calendar selection

Use `GOOGLE_CALENDAR_ID` to choose which business calendar receives consultation events. Use `"primary"` only if the business account calendar itself should be the source of truth.

## Current v1 architecture

- Availability is checked server-side against Google Calendar free/busy plus locally stored active bookings.
- Booking is revalidated on submit before event creation.
- Successful bookings create a Google Calendar event and persist a booking record in the local SQLite-backed repository.
- `birthPlanSubmissionId` is already included in the booking schema so the flow can be linked to the Birth Plan Builder later.

## Future hooks already prepared

- Prefill booking details from the Birth Plan Builder by passing query params or server-side session data.
- Link bookings to a richer lead/contact record.
- Add confirmation and reminder emails after event creation.
- Add reschedule/cancel flows keyed off the stored booking record and Google event ID.
