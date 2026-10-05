import "dotenv/config";

import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const emailFrom = process.env.EMAIL_FROM ?? "DevFlow <onboarding@resend.dev>";
const frontendOrigin = process.env.FRONTEND_ORIGIN
  ? new URL(process.env.FRONTEND_ORIGIN).origin
  : "http://localhost:3000";

const resend = resendApiKey ? new Resend(resendApiKey) : null;

export type SendEmailResult =
  | { status: "SENT" }
  | { status: "SKIPPED" }
  | { status: "FAILED"; error: unknown };

type EmailContent = {
  to: string;
  subject: string;
  heading: string;
  body: string;
  actionLabel: string;
  actionUrl: string;
};

async function sendEmail({
  to,
  subject,
  heading,
  body,
  actionLabel,
  actionUrl,
}: EmailContent): Promise<SendEmailResult> {
  if (!resend) {
    return { status: "SKIPPED" };
  }

  const text = `${heading}\n\n${body}\n\n${actionLabel}: ${actionUrl}`;

  const html = `
    <div style="font-family: sans-serif; line-height: 1.5;">
      <h2>${heading}</h2>
      <p>${body}</p>
      <p>
        <a href="${actionUrl}" style="display: inline-block; background: #000; color: #fff; padding: 10px 16px; border-radius: 6px; text-decoration: none;">
          ${actionLabel}
        </a>
      </p>
      <p>If the button does not work, copy this link into your browser:</p>
      <p><a href="${actionUrl}">${actionUrl}</a></p>
    </div>
  `;

  try {
    const { error } = await resend.emails.send({
      from: emailFrom,
      to,
      subject,
      html,
      text,
    });

    if (error) {
      return { status: "FAILED", error };
    }

    return { status: "SENT" };
  } catch (error) {
    return { status: "FAILED", error };
  }
}

export function sendVerificationEmail(to: string, token: string) {
  const actionUrl = `${frontendOrigin}/verify-email?token=${encodeURIComponent(token)}`;

  return sendEmail({
    to,
    subject: "Verify your DevFlow email",
    heading: "Verify your email",
    body: "Confirm your email address to finish setting up your DevFlow account. This link expires in 1 hour.",
    actionLabel: "Verify email",
    actionUrl,
  });
}

export function sendPasswordResetEmail(to: string, token: string) {
  const actionUrl = `${frontendOrigin}/reset-password?token=${encodeURIComponent(token)}`;

  return sendEmail({
    to,
    subject: "Reset your DevFlow password",
    heading: "Reset your password",
    body: "We received a request to reset your DevFlow password. This link expires in 1 hour. If you did not request this, you can safely ignore this email.",
    actionLabel: "Reset password",
    actionUrl,
  });
}
