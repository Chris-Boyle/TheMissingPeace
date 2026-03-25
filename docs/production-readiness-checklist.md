# Production Readiness Checklist

## Environment and Deployment

- Verify Vercel project settings point to the correct repository and production branch.
- Confirm `.env.example` matches the current application needs.
- Add every required environment variable in the Vercel dashboard before the first production deploy.
- Check that no secrets, API keys, or local-only values are committed to the repository.
- Confirm the production build command is `npm run build` and the install command is `npm ci`.

## Quality Gates

- Run `npm run lint` and resolve all errors before merging.
- Run `npm test` and confirm all unit tests pass.
- Run `npx playwright test` and confirm all end-to-end tests pass.
- Review recent changes for broken imports, missing assets, and console errors.

## Page Coverage

- Verify the Home page hero, bio, services, events, and calls to action render correctly.
- Verify the About page portrait, biography, and spacing render correctly.
- Verify the Services page package details and bereavement section render correctly.
- Verify the Blog page list items, dates, and excerpts render correctly.
- Verify the Contact page form, success state, and validation messages render correctly.

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

## SEO Basics

- Confirm each page has a clear, unique primary heading.
- Review site metadata in the root layout and replace generic defaults as needed.
- Add page-specific metadata if search previews need more targeted titles or descriptions.
- Confirm images use descriptive `alt` text.
- Verify internal links are crawlable and navigation is consistent across pages.

## Final Pre-Launch Review

- Check for placeholder copy, placeholder imagery, and incomplete TODOs.
- Review color contrast, readable typography, and spacing consistency.
- Smoke test the deployed preview URL before promoting to production.
- Confirm analytics, forms, and external integrations if they are added later.
