import { ConsultationBookingError } from "@/lib/consultation-booking/errors";
import type { ValidatedContactSubmission } from "@/lib/validation/contact";

function getRequiredEnv(name: "SENDGRID_API_KEY" | "CONTACT_FROM_EMAIL" | "CONTACT_TO_EMAIL") {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required email configuration: ${name}`);
  }

  return value;
}

function buildUserConfirmationText(submission: ValidatedContactSubmission) {
  const quizSummary = submission.quizResult?.resultHeadline
    ? `\nQuiz result: ${submission.quizResult.resultHeadline}`
    : "";

  return [
    `Hi ${submission.fullName},`,
    "",
    "Thanks for reaching out to The Missing Peace. We received your message and someone will follow up soon.",
    "",
    "Here is a short recap of what you shared:",
    `Name: ${submission.fullName}`,
    `Email: ${submission.email}`,
    submission.phone ? `Phone: ${submission.phone}` : null,
    submission.dueDate ? `Due date: ${submission.dueDate}` : null,
    submission.contactMethod
      ? `Preferred contact method: ${submission.contactMethod}`
      : null,
    `Message: ${submission.message}`,
    quizSummary ? quizSummary.trim() : null,
    "",
    "With care,",
    "The Missing Peace",
  ]
    .filter(Boolean)
    .join("\n");
}

function buildInternalNotificationText(submission: ValidatedContactSubmission) {
  const quizLines = submission.quizResult
    ? [
        "",
        "Quiz result:",
        submission.quizResult.resultHeadline
          ? `Headline: ${submission.quizResult.resultHeadline}`
          : null,
        submission.quizResult.resultKey
          ? `Result key: ${submission.quizResult.resultKey}`
          : null,
        submission.quizResult.resultSummary
          ? `Summary: ${submission.quizResult.resultSummary}`
          : null,
        submission.quizResult.completedAt
          ? `Completed at: ${submission.quizResult.completedAt}`
          : null,
        submission.quizResult.answers
          ? `Answers: ${JSON.stringify(submission.quizResult.answers, null, 2)}`
          : null,
      ]
    : [];

  return [
    "New contact form submission",
    `Submitted at: ${new Date().toISOString()}`,
    "",
    `Name: ${submission.fullName}`,
    `Email: ${submission.email}`,
    submission.phone ? `Phone: ${submission.phone}` : null,
    submission.dueDate ? `Due date: ${submission.dueDate}` : null,
    submission.contactMethod
      ? `Preferred contact method: ${submission.contactMethod}`
      : null,
    "",
    "Message:",
    submission.message,
    ...quizLines,
  ]
    .filter(Boolean)
    .join("\n");
}

async function sendSendGridEmail(params: {
  to: string;
  from: string;
  subject: string;
  text: string;
}) {
  const apiKey = getRequiredEnv("SENDGRID_API_KEY");
  const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      personalizations: [
        {
          to: [{ email: params.to }],
        },
      ],
      from: {
        email: params.from,
      },
      subject: params.subject,
      content: [
        {
          type: "text/plain",
          value: params.text,
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("SendGrid contact email failed", {
      status: response.status,
      body: errorText,
    });
    throw new ConsultationBookingError(
      "Something went wrong sending your message. Please try again in a moment.",
      {
        status: 502,
        code: "EMAIL_SEND_FAILED",
      }
    );
  }
}

export async function sendContactEmails(submission: ValidatedContactSubmission) {
  const fromEmail = getRequiredEnv("CONTACT_FROM_EMAIL");
  const toEmail = getRequiredEnv("CONTACT_TO_EMAIL");

  await sendSendGridEmail({
    to: submission.email,
    from: fromEmail,
    subject: "We received your message | The Missing Peace",
    text: buildUserConfirmationText(submission),
  });

  await sendSendGridEmail({
    to: toEmail,
    from: fromEmail,
    subject: `New Contact Form Submission - ${submission.fullName}`,
    text: buildInternalNotificationText(submission),
  });
}
