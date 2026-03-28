"use client";

import Link from "next/link";
import { useState } from "react";
import { ContextualTestimonialStrip } from "@/components/testimonials/contextual-testimonial-strip";
import { getTestimonialsForPlacement } from "@/content/testimonials";
import { getStoredDoulaQuizResult } from "@/lib/quiz-storage";

type FormState = {
  name: string;
  email: string;
  phone: string;
  contactMethod: string;
  dueDate: string;
  message: string;
  company: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const initialFormState: FormState = {
  name: "",
  email: "",
  phone: "",
  contactMethod: "email",
  dueDate: "",
  message: "",
  company: "",
};

const bookingTestimonials = getTestimonialsForPlacement("booking", {
  featuredOnly: true,
  limit: 2,
});

function validateForm(form: FormState) {
  const errors: FormErrors = {};

  if (!form.name.trim()) {
    errors.name = "Please share your name.";
  }

  if (!form.email.trim()) {
    errors.email = "Please provide an email address.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = "Please enter a valid email address.";
  }

  if (!form.message.trim()) {
    errors.message = "Please add a short message so I know how to support you.";
  }

  return errors;
}

export function ContactPage() {
  const [form, setForm] = useState(initialFormState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [startedAt, setStartedAt] = useState(() => new Date().toISOString());
  const [submitState, setSubmitState] = useState<"idle" | "success" | "error">(
    "idle"
  );
  const [submitMessage, setSubmitMessage] = useState("");

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (isSubmitting) {
      return;
    }

    const nextErrors = validateForm(form);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setSubmitState("idle");
      setSubmitMessage("");
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    setSubmitState("idle");
    setSubmitMessage("");

    try {
      const quizResult = getStoredDoulaQuizResult();
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: form.name,
          email: form.email,
          phone: form.phone || undefined,
          contactMethod: form.contactMethod || undefined,
          dueDate: form.dueDate || undefined,
          message: form.message,
          company: form.company || undefined,
          startedAt,
          quizResult: quizResult ?? undefined,
        }),
      });

      let payload: { message?: string; error?: string } | null = null;

      try {
        payload = (await response.json()) as { message?: string; error?: string };
      } catch {
        payload = null;
      }

      if (!response.ok) {
        setSubmitState("error");
        setSubmitMessage(
          payload?.error ??
            "Something went wrong sending your message. Please try again in a moment."
        );
        return;
      }

      setForm(initialFormState);
      setStartedAt(new Date().toISOString());
      setSubmitState("success");
      setSubmitMessage(
        payload?.message ??
          "Thanks for reaching out. We received your message and sent a confirmation to your email."
      );
    } catch {
      setSubmitState("error");
      setSubmitMessage(
        "Something went wrong sending your message. Please try again in a moment."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="flex min-h-[60vh] w-full justify-center bg-[#f7f3ef] px-4 py-16">
      <div className="flex w-full max-w-5xl flex-col gap-6">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <aside className="rounded-2xl bg-[#6d4b36] p-8 text-[#fff8f0] shadow-[0_24px_60px_rgba(73,49,35,0.22)]">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#ead7c4]">
              Contact
            </p>
            <h1 className="mt-4 text-3xl font-semibold text-white">
              Reach out with a question.
            </h1>
            <p className="mt-4 text-base leading-7 text-[#f5e6d8]">
              Use this page for general questions, outreach, or anything you
              want to talk through before taking the next step. If you are ready
              to reserve a time, use the consultation page to book directly.
            </p>
            <Link
              href="/consultation"
              className="mt-5 inline-flex text-sm font-semibold text-[#fff8f0] underline decoration-[#cfae91] underline-offset-4 transition hover:text-white"
            >
              Ready to reserve a consultation? Go to booking.
            </Link>
            <div className="mt-8 space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#ead7c4]">
                  Email
                </p>
                <a
                  href="mailto:missingpeacekc@gmail.com"
                  className="mt-1 inline-block text-lg text-white underline decoration-[#cfae91] underline-offset-4"
                >
                  missingpeacekc@gmail.com
                </a>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#ead7c4]">
                  Phone
                </p>
                <a
                  href="tel:18167264134"
                  className="mt-1 inline-block text-lg text-white underline decoration-[#cfae91] underline-offset-4"
                >
                  (816) 726-4134
                </a>
              </div>
            </div>
          </aside>
          <div className="rounded-2xl bg-white p-8 shadow-md">
            <h2 className="mb-3 text-center text-3xl font-semibold text-[#7d5c3c]">
              Contact Form
            </h2>
            <p className="mb-8 text-center text-sm leading-6 text-[#6f5a4c]">
              For consultation scheduling, use the{" "}
              <Link
                href="/consultation"
                className="font-semibold text-[#7d5c3c] underline decoration-[#ccb39b] underline-offset-4"
              >
                dedicated booking page
              </Link>
              .
            </p>
            <div aria-live="polite" className="mb-6 min-h-6">
              {submitState === "success" ? (
                <p className="text-center font-medium text-green-700">
                  {submitMessage}
                </p>
              ) : null}
              {submitState === "error" ? (
                <p className="text-center font-medium text-[#a04d39]">
                  {submitMessage}
                </p>
              ) : null}
            </div>
            <form className="space-y-6" onSubmit={handleSubmit} noValidate>
              <div>
                <label
                  htmlFor="name"
                  className="mb-1 block text-sm font-medium text-[#3d2c1e]"
                >
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  aria-invalid={errors.name ? "true" : "false"}
                  aria-describedby={errors.name ? "name-error" : undefined}
                  className="w-full rounded-lg border border-[#e9e3db] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#a08c7d]"
                  value={form.name}
                  onChange={handleChange}
                  autoComplete="name"
                  disabled={isSubmitting}
                />
                {errors.name ? (
                  <p id="name-error" className="mt-2 text-sm text-[#a04d39]">
                    {errors.name}
                  </p>
                ) : null}
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="mb-1 block text-sm font-medium text-[#3d2c1e]"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  aria-invalid={errors.email ? "true" : "false"}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  className="w-full rounded-lg border border-[#e9e3db] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#a08c7d]"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                  disabled={isSubmitting}
                />
                {errors.email ? (
                  <p id="email-error" className="mt-2 text-sm text-[#a04d39]">
                    {errors.email}
                  </p>
                ) : null}
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="mb-1 block text-sm font-medium text-[#3d2c1e]"
                >
                  Phone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  className="w-full rounded-lg border border-[#e9e3db] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#a08c7d]"
                  value={form.phone}
                  onChange={handleChange}
                  autoComplete="tel"
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label
                  htmlFor="contactMethod"
                  className="mb-1 block text-sm font-medium text-[#3d2c1e]"
                >
                  Preferred Contact Method
                </label>
                <select
                  id="contactMethod"
                  name="contactMethod"
                  className="w-full rounded-lg border border-[#e9e3db] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#a08c7d]"
                  value={form.contactMethod}
                  onChange={handleChange}
                  disabled={isSubmitting}
                >
                  <option value="email">Email</option>
                  <option value="phone">Phone</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="dueDate"
                  className="mb-1 block text-sm font-medium text-[#3d2c1e]"
                >
                  Expected Due Date
                </label>
                <input
                  id="dueDate"
                  name="dueDate"
                  type="date"
                  className="w-full rounded-lg border border-[#e9e3db] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#a08c7d]"
                  value={form.dueDate}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
              <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden">
                <label htmlFor="company">Company</label>
                <input
                  id="company"
                  name="company"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.company}
                  onChange={handleChange}
                />
              </div>
              <input type="hidden" name="startedAt" value={startedAt} readOnly />
              <div>
                <label
                  htmlFor="message"
                  className="mb-1 block text-sm font-medium text-[#3d2c1e]"
                >
                  Personal Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  required
                  aria-invalid={errors.message ? "true" : "false"}
                  aria-describedby={errors.message ? "message-error" : undefined}
                  className="w-full rounded-lg border border-[#e9e3db] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#a08c7d]"
                  value={form.message}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                {errors.message ? (
                  <p id="message-error" className="mt-2 text-sm text-[#a04d39]">
                    {errors.message}
                  </p>
                ) : null}
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-lg bg-[#7d5c3c] py-2 font-semibold text-white transition-colors hover:bg-[#a08c7d]"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>

        <ContextualTestimonialStrip
          heading="A consultation should feel calming before it even begins."
          intro="These short reviews sit next to booking so visitors can see what families most often felt at this stage: informed, supported, and gently advocated for."
          testimonials={bookingTestimonials}
          headingId="booking-testimonials-heading"
          includeSchema
        />
      </div>
    </section>
  );
}
