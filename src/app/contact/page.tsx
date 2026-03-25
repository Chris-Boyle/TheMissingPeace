"use client";

import { useState } from "react";

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
    <section className="w-full flex justify-center py-16 px-4 bg-[#f7f3ef] min-h-[60vh]">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-md p-8">
        <h1 className="text-3xl font-semibold mb-8 text-[#7d5c3c] text-center">Contact</h1>
        {submitted ? (
          <div className="text-green-700 text-center font-medium">Thank you! Your message has been received.</div>
        ) : (
          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1 text-[#3d2c1e]">Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                aria-invalid={errors.name ? "true" : "false"}
                aria-describedby={errors.name ? "name-error" : undefined}
                className="w-full border border-[#e9e3db] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#a08c7d]"
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
              <label htmlFor="email" className="block text-sm font-medium mb-1 text-[#3d2c1e]">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                aria-invalid={errors.email ? "true" : "false"}
                aria-describedby={errors.email ? "email-error" : undefined}
                className="w-full border border-[#e9e3db] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#a08c7d]"
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
              <label htmlFor="phone" className="block text-sm font-medium mb-1 text-[#3d2c1e]">Phone Number</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                className="w-full border border-[#e9e3db] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#a08c7d]"
                value={form.phone}
                onChange={handleChange}
                autoComplete="tel"
              />
            </div>
            <div>
              <label htmlFor="contactMethod" className="block text-sm font-medium mb-1 text-[#3d2c1e]">Preferred Contact Method</label>
              <select
                id="contactMethod"
                name="contactMethod"
                className="w-full border border-[#e9e3db] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#a08c7d]"
                value={form.contactMethod}
                onChange={handleChange}
              >
                <option value="email">Email</option>
                <option value="phone">Phone</option>
              </select>
            </div>
            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium mb-1 text-[#3d2c1e]">Expected Due Date</label>
              <input
                id="dueDate"
                name="dueDate"
                type="date"
                className="w-full border border-[#e9e3db] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#a08c7d]"
                value={form.dueDate}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-1 text-[#3d2c1e]">Personal Message</label>
              <textarea
                id="message"
                name="message"
                rows={4}
                required
                aria-invalid={errors.message ? "true" : "false"}
                aria-describedby={errors.message ? "message-error" : undefined}
                className="w-full border border-[#e9e3db] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#a08c7d]"
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
              className="w-full bg-[#7d5c3c] text-white font-semibold py-2 rounded-lg hover:bg-[#a08c7d] transition-colors"
            >
              Send Message
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
