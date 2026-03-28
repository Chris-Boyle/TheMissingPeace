import type { Metadata } from "next";
import { ContactPage } from "@/components/contact/contact-page";
import { buildPageMetadata } from "@/lib/seo/site";

export const metadata: Metadata = buildPageMetadata({
  title: "Contact The Missing Peace",
  description:
    "Reach out with questions about doula support, birth planning, or general next steps. Use the consultation page when you are ready to book.",
  path: "/contact",
});

export default function ContactRoutePage() {
  return <ContactPage />;
}
