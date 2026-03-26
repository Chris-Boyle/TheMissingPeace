import type { Testimonial } from "@/content/testimonials";
import { buildReviewSchema, serializeJsonLd } from "@/lib/seo/review-schema";

type ReviewSchemaScriptProps = {
  testimonials: Testimonial[];
};

export function ReviewSchemaScript({
  testimonials,
}: ReviewSchemaScriptProps) {
  const schema = buildReviewSchema(testimonials);

  if (!schema) {
    return null;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: serializeJsonLd(schema),
      }}
    />
  );
}
