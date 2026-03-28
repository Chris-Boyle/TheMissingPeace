import type { Metadata } from "next";
import { BirthPlanBuilder } from "@/components/birth-plan-builder/birth-plan-builder";
import { buildPageMetadata } from "@/lib/seo/site";

export const metadata: Metadata = buildPageMetadata({
  title: "Birth Plan Builder",
  description:
    "Build a thoughtful birth plan with a guided step-by-step experience that helps you clarify preferences and prepare for your next conversation.",
  path: "/birth-plan-builder",
});

export default function BirthPlanBuilderPage() {
  return <BirthPlanBuilder />;
}
