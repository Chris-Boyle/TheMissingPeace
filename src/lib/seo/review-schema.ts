import type { Testimonial } from "@/content/testimonials";

const BUSINESS_NAME = "The Missing Peace";
const BUSINESS_DESCRIPTION =
  "Doula care, childbirth education, and postpartum support.";
const BUSINESS_PHONE = "+1-816-726-4134";

export function buildReviewSchema(testimonials: Testimonial[]) {
  if (testimonials.length === 0) {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: BUSINESS_NAME,
    description: BUSINESS_DESCRIPTION,
    telephone: BUSINESS_PHONE,
    review: testimonials.map((testimonial) => ({
      "@type": "Review",
      author: {
        "@type": "Person",
        name: testimonial.reviewerName,
      },
      publisher: {
        "@type": "Organization",
        name: testimonial.reviewSource,
      },
      reviewBody: testimonial.fullQuote ?? testimonial.quote,
      reviewRating: {
        "@type": "Rating",
        ratingValue: testimonial.starRating,
        bestRating: 5,
        worstRating: 1,
      },
      ...(testimonial.reviewDate
        ? { datePublished: testimonial.reviewDate }
        : {}),
    })),
  };
}

export function serializeJsonLd(payload: unknown) {
  return JSON.stringify(payload).replace(/</g, "\\u003c");
}
