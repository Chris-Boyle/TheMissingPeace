import type { Metadata } from "next";
import { BirthPlanBuilder } from "@/components/birth-plan-builder/birth-plan-builder";

export const metadata: Metadata = {
  title: "Birth Plan Builder | The Missing Peace",
  description:
    "Create a thoughtful, personalized birth plan with a guided experience from The Missing Peace.",
};

export default function BirthPlanBuilderPage() {
  return <BirthPlanBuilder />;
}
