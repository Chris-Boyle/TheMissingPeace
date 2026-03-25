export type Testimonial = {
  reviewerName: string;
  excerpt: string;
  fullQuote?: string;
  sourceLabel?: string;
};

export const featuredTestimonials: Testimonial[] = [
  {
    reviewerName: "Rachel O'Connor",
    excerpt:
      "She is kind, understanding, informative. She made my birthing process easier and was the extra support I needed.",
    sourceLabel: "Google Review",
  },
  {
    reviewerName: "Sadie Griffith",
    excerpt:
      "She actively sought out resources of all kinds for me to help make my pregnancy and birth experience one I could be proud of.",
    sourceLabel: "Google Review",
  },
  {
    reviewerName: "Ashley Thompson",
    excerpt:
      "She was never pushy, mainly there to help educate me and advocate for me.",
    sourceLabel: "Google Review",
  },
  {
    reviewerName: "Christina Mladenoff",
    excerpt:
      "She was supportive through all the changes in our birth plan through labor and continues to check in postpartum.",
    sourceLabel: "Google Review",
  },
];
