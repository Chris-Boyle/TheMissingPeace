"use client";

import { useState } from "react";
import { ContextualTestimonialStrip } from "@/components/testimonials/contextual-testimonial-strip";
import { getTestimonialsForPlacement } from "@/content/testimonials";

type FormState = {
  name: string;
  email: string;
  phone: string;
  contactMethod: string;
  dueDate: string;
  message: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const initialFormState: FormState = {
  name: "",
  email: "",
  phone: "",
  contactMethod: "email",
  dueDate: "",
  message: "",
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

export default function ContactPage() {
  const [form, setForm] = useState(initialFormState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const nextErrors = validateForm(form);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setSubmitted(true);
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
              Reach out directly.
            </h1>
            <p className="mt-4 text-base leading-7 text-[#f5e6d8]">
              If you are ready to ask a question or book a consultation, email
              or call anytime.
            </p>
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
            <h2 className="mb-8 text-center text-3xl font-semibold text-[#7d5c3c]">
              Contact Form
            </h2>
            {submitted ? (
              <div className="text-center font-medium text-green-700">
                Thank you! Your message has been received.
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit} noValidate>
                <div>
                  <label htmlFor="name" className="mb-1 block text-sm font-medium text-[#3d2c1e]">
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
                  />
                  {errors.name ? (
                    <p id="name-error" className="mt-2 text-sm text-[#a04d39]">
                      {errors.name}
                    </p>
                  ) : null}
                </div>
                <div>
                  <label htmlFor="email" className="mb-1 block text-sm font-medium text-[#3d2c1e]">
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
                  />
                  {errors.email ? (
                    <p id="email-error" className="mt-2 text-sm text-[#a04d39]">
                      {errors.email}
                    </p>
                  ) : null}
                </div>
                <div>
                  <label htmlFor="phone" className="mb-1 block text-sm font-medium text-[#3d2c1e]">
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
                  />
                </div>
                <div>
                  <label htmlFor="contactMethod" className="mb-1 block text-sm font-medium text-[#3d2c1e]">
                    Preferred Contact Method
                  </label>
                  <select
                    id="contactMethod"
                    name="contactMethod"
                    className="w-full rounded-lg border border-[#e9e3db] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#a08c7d]"
                    value={form.contactMethod}
                    onChange={handleChange}
                  >
                    <option value="email">Email</option>
                    <option value="phone">Phone</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="dueDate" className="mb-1 block text-sm font-medium text-[#3d2c1e]">
                    Expected Due Date
                  </label>
                  <input
                    id="dueDate"
                    name="dueDate"
                    type="date"
                    className="w-full rounded-lg border border-[#e9e3db] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#a08c7d]"
                    value={form.dueDate}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="message" className="mb-1 block text-sm font-medium text-[#3d2c1e]">
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
                  />
                  {errors.message ? (
                    <p id="message-error" className="mt-2 text-sm text-[#a04d39]">
                      {errors.message}
                    </p>
                  ) : null}
                </div>
                <button
                  type="submit"
                  className="w-full rounded-lg bg-[#7d5c3c] py-2 font-semibold text-white transition-colors hover:bg-[#a08c7d]"
                >
                  Send Message
                </button>
              </form>
            )}
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
