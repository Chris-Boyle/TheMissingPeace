# Consultation Booking Implementation Notes

## Google Cloud setup

1. Create or use an existing Google Cloud project for the business Google account.
2. Enable the Google Calendar API.
3. Create an OAuth client that can obtain an offline refresh token for the business calendar account.
4. Grant the app access to the correct business calendar and confirm the target calendar ID.

This implementation uses the Google Calendar REST API with an OAuth refresh token on the server. It does not use Calendly and it does not expose Google credentials to the client.

## Required environment variables

Set these on the server:

- `NEXT_PUBLIC_SITE_URL`
- `SITE_URL`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REFRESH_TOKEN`
- `GOOGLE_CALENDAR_ID`
- `CONSULTATION_TIMEZONE`
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`
- `CONSULTATION_AVAILABILITY_RATE_LIMIT_WINDOW_MS` (optional)
- `CONSULTATION_AVAILABILITY_RATE_LIMIT_MAX_REQUESTS` (optional)
- `CONSULTATION_BOOKING_RATE_LIMIT_WINDOW_MS` (optional)
- `CONSULTATION_BOOKING_RATE_LIMIT_MAX_REQUESTS` (optional)

## Calendar selection

Use `GOOGLE_CALENDAR_ID` to choose which business calendar receives consultation events. Use `"primary"` only if the business account calendar itself should be the source of truth.

## Current v1 architecture

- Availability is checked server-side against Google Calendar free/busy plus active bookings stored in Upstash Redis.
- Booking is revalidated on submit before event creation.
- Successful bookings create a Google Calendar event and persist a booking record in a serverless-safe Upstash Redis repository.
- Public availability and booking routes are rate-limited server-side.
- `birthPlanSubmissionId` is already included in the booking schema so the flow can be linked to the Birth Plan Builder later.

## Vercel notes

- Add every variable from `.env.example` to the Vercel project before deploying.
- `NEXT_PUBLIC_SITE_URL` and `SITE_URL` should point to the canonical production domain so metadata, `robots.txt`, and `sitemap.xml` resolve correctly.
- Upstash Redis is required for durable rate limiting and booking persistence across serverless instances.

## Future hooks already prepared

- Prefill booking details from the Birth Plan Builder by passing query params or server-side session data.
- Link bookings to a richer lead/contact record.
- Add confirmation and reminder emails after event creation.
- Add reschedule/cancel flows keyed off the stored booking record and Google event ID.
