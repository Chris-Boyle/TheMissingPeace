export type TestimonialPlacement =
  | "booking"
  | "pricing"
  | "birth-plan-builder"
  | "homepage"
  | "services";

export type TestimonialVideo = {
  videoUrl: string;
  thumbnail: string;
  thumbnailAlt: string;
  caption: string;
  summary?: string;
};

export type Testimonial = {
  id: string;
  reviewerName: string;
  reviewSource: "Google";
  starRating: 1 | 2 | 3 | 4 | 5;
  quote: string;
  fullQuote?: string;
  featured?: boolean;
  placementTags?: TestimonialPlacement[];
  video?: TestimonialVideo;
  reviewDate?: string;
  location?: string;
};

export const testimonials: Testimonial[] = [
  {
    id: "rachel-oconnor",
    reviewerName: "Rachel O'Connor",
    reviewSource: "Google",
    starRating: 5,
    quote:
      "She is kind, understanding, informative. She made my birthing process easier and was the extra support I needed.",
    featured: true,
    placementTags: ["homepage", "booking", "services"],
  },
  {
    id: "sadie-griffith",
    reviewerName: "Sadie Griffith",
    reviewSource: "Google",
    starRating: 5,
    quote:
      "She actively sought out resources of all kinds for me to help make my pregnancy and birth experience one I could be proud of.",
    featured: true,
    placementTags: ["homepage", "pricing", "services"],
  },
  {
    id: "ashley-thompson",
    reviewerName: "Ashley Thompson",
    reviewSource: "Google",
    starRating: 5,
    quote:
      "She was never pushy, mainly there to help educate me and advocate for me.",
    featured: true,
    placementTags: ["homepage", "birth-plan-builder", "booking"],
  },
  {
    id: "christina-mladenoff",
    reviewerName: "Christina Mladenoff",
    reviewSource: "Google",
    starRating: 5,
    quote:
      "She was supportive through all the changes in our birth plan through labor and continues to check in postpartum.",
    featured: true,
    placementTags: ["homepage", "pricing", "birth-plan-builder", "services"],
  },
];

export const featuredTestimonials = testimonials.filter(
  (testimonial) => testimonial.featured
);

export const videoTestimonials = testimonials.filter(
  (testimonial) => testimonial.video
);

type TestimonialQuery = {
  featuredOnly?: boolean;
  limit?: number;
};

export function getTestimonialsForPlacement(
  placement: TestimonialPlacement,
  query: TestimonialQuery = {}
) {
  const filtered = testimonials.filter((testimonial) => {
    if (!testimonial.placementTags?.includes(placement)) {
      return false;
    }

    if (query.featuredOnly && !testimonial.featured) {
      return false;
    }

    return true;
  });

  return typeof query.limit === "number"
    ? filtered.slice(0, query.limit)
    : filtered;
}

export function getVideoTestimonials(query: TestimonialQuery = {}) {
  const filtered = videoTestimonials.filter((testimonial) => {
    if (query.featuredOnly && !testimonial.featured) {
      return false;
    }

    return true;
  });

  return typeof query.limit === "number"
    ? filtered.slice(0, query.limit)
    : filtered;
}
