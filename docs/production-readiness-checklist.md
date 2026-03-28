# Production Readiness Checklist

## Environment and Deployment

- Verify Vercel project settings point to the correct repository and production branch.
- Confirm `.env.example` matches the current application needs.
- Add every required environment variable in the Vercel dashboard before the first production deploy.
- Confirm `NEXT_PUBLIC_SITE_URL` and `SITE_URL` are set to the canonical production domain.
- Confirm `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are set for durable booking persistence and abuse protection.
- Confirm `SENDGRID_API_KEY`, `CONTACT_FROM_EMAIL`, and `CONTACT_TO_EMAIL` are set and the sender identity is verified in SendGrid.
- Confirm `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REFRESH_TOKEN`, and `GOOGLE_CALENDAR_ID` are set for consultation booking.
- Check that no secrets, API keys, or local-only values are committed to the repository.
- Confirm the production build command is `npm run build` and the install command is `npm ci`.

## Quality Gates

- Run `npm run lint` and resolve all errors before merging.
- Run `npm run typecheck` and confirm TypeScript passes.
- Run `npm test` and confirm all unit tests pass.
- Run `npx playwright test` and confirm all end-to-end tests pass.
- Run `npm run build` and confirm the production build succeeds.
- Run `npm run audit:production` with the required environment variables loaded and review any failed checks.
- Review recent changes for broken imports, missing assets, and console errors.

## Page Coverage

- Verify the Home page hero, trust sections, gentle entry point, and calls to action render correctly.
- Verify the About page portrait, biography, and spacing render correctly.
- Verify the Services page package details and bereavement section render correctly.
- Verify the Consultation page loads availability, shows empty/error states gracefully, and reaches the success confirmation state.
- Verify the Birth Plan Builder runs through all four live steps and reaches the final summary.
- Verify the Pregnancy Timeline page loads the due date tool, content sections, and onward CTAs.
- Verify the Quiz page renders questions, results, and onward CTA links.
- Verify the Blog page list items, dates, and excerpts render correctly.
- Verify the Contact page form, success state, and validation messages render correctly without implying it is the booking path.

## Responsive Behavior

- Review the site on mobile, tablet, and desktop breakpoints.
- Confirm the navigation works in both the desktop header and the mobile menu.
- Check that cards, text blocks, and images stack cleanly without overlap or clipping.
- Confirm buttons remain visible, tappable, and legible on smaller screens.

## Forms and Validation

- Confirm required contact form fields show clear validation messages.
- Verify invalid email input is rejected and corrected input clears the error state.
- Submit the contact form with realistic data and confirm the success message appears.
- Confirm labels, focus states, and keyboard navigation work across all form fields.
- Confirm public endpoints behave safely under validation failures and rate limiting.

## SEO Basics

- Confirm each page has a clear, unique primary heading.
- Review page-level metadata, canonical URLs, and Open Graph output for core routes.
- Confirm `robots.txt` and `sitemap.xml` are present and resolve correctly.
- Confirm images use descriptive `alt` text.
- Verify internal links are crawlable and navigation is consistent across pages.

## Final Pre-Launch Review

- Check for placeholder copy, placeholder imagery, and incomplete TODOs.
- Review color contrast, readable typography, and spacing consistency.
- Smoke test the deployed preview URL before promoting to production.
- Confirm analytics, forms, and external integrations if they are added later.
