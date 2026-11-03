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
  preheader: string;
  heading: string;
  paragraphs: string[];
  actionLabel: string;
  actionUrl: string;
  expiry: string;
  note: string;
};

const htmlEscapes: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

function escapeHtml(value: string) {
  return value.replace(
    /[&<>"']/g,
    (character) => htmlEscapes[character] ?? character,
  );
}

function renderEmailHtml({
  preheader,
  heading,
  paragraphs,
  actionLabel,
  actionUrl,
  expiry,
  note,
}: EmailContent) {
  const safeActionUrl = escapeHtml(actionUrl);
  const termsUrl = escapeHtml(`${frontendOrigin}/terms`);
  const privacyUrl = escapeHtml(`${frontendOrigin}/privacy`);

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="color-scheme" content="light dark" />
    <meta name="supported-color-schemes" content="light dark" />
    <title>${escapeHtml(heading)}</title>
    <style>
      @media (prefers-color-scheme: dark) {
        .email-body { background-color: #17141d !important; }
        .email-canvas { background-color: #17141d !important; }
        .email-card { background-color: #1a1720 !important; border-color: #332d3e !important; }
        .email-wordmark { color: #ece9f2 !important; }
        .email-heading { color: #ece9f2 !important; }
        .email-text { color: #b6b0c4 !important; }
        .email-muted { color: #a29caf !important; }
        .email-expiry { background-color: #241f2d !important; border-color: #332d3e !important; color: #c9c3d6 !important; }
        .email-expiry td { color: #c9c3d6 !important; }
        .email-note { border-color: #332d3e !important; }
        .email-footer { color: #a29caf !important; }
        .email-footer a { color: #b3a7ff !important; }
      }
    </style>
  </head>
  <body class="email-body" style="margin: 0; padding: 0; background-color: #f5f4f9;">
    <div style="display: none; max-height: 0; overflow: hidden; opacity: 0; color: transparent; mso-hide: all;">
      ${escapeHtml(preheader)}
    </div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="email-canvas" style="background-color: #f5f4f9; padding: 28px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; width: 100%;">
            <tr>
              <td style="padding: 0 6px 14px;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="width: 32px; height: 32px; border-radius: 9px; background-color: #6c5ce7; color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 15px; font-weight: 800; text-align: center; line-height: 32px;">
                      D
                    </td>
                    <td class="email-wordmark" style="padding-left: 9px; color: #2b2833; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 700; letter-spacing: -0.02em;">
                      DevFlow
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td class="email-card" style="background-color: #ffffff; border: 1px solid #e7e3f0; border-radius: 14px; padding: 34px 34px 30px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
                <h1 class="email-heading" style="margin: 0 0 8px; font-size: 22px; line-height: 1.3; font-weight: 700; letter-spacing: -0.02em; color: #2b2833;">
                  ${escapeHtml(heading)}
                </h1>

                ${paragraphs
                  .map(
                    (
                      paragraph,
                    ) => `<p class="email-text" style="margin: 0 0 16px; font-size: 14px; line-height: 1.65; color: #5d586b;">
                    ${escapeHtml(paragraph)}
                  </p>`,
                  )
                  .join("")}

                <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="border-radius: 9px; background-color: #6c5ce7;">
                      <a href="${safeActionUrl}" style="display: inline-block; padding: 13px 22px; border-radius: 9px; color: #ffffff; font-size: 14px; font-weight: 600; text-decoration: none;">
                        ${escapeHtml(actionLabel)}
                      </a>
                    </td>
                  </tr>
                </table>

                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="email-expiry" style="margin-top: 20px; background-color: #f7f5fd; border: 1px solid #eae6f7; border-radius: 8px;">
                  <tr>
                    <td style="padding: 11px 13px; font-size: 12.5px; line-height: 1.5; color: #5d586b;">
                      &#9201; ${escapeHtml(expiry)}
                    </td>
                  </tr>
                </table>

                <p class="email-muted" style="margin: 20px 0 0; font-size: 12px; line-height: 1.6; color: #8a8496;">
                  Button not working? Copy this link into your browser:
                </p>

                <p class="email-muted" style="margin: 5px 0 0; font-size: 11.5px; line-height: 1.6; color: #6c5ce7; word-break: break-all;">
                  <a href="${safeActionUrl}" style="color: #6c5ce7; text-decoration: none; word-break: break-all;">${safeActionUrl}</a>
                </p>

                <p class="email-muted email-note" style="margin: 22px 0 0; padding-top: 18px; border-top: 1px solid #efeaf7; font-size: 12px; line-height: 1.6; color: #8a8496;">
                  ${escapeHtml(note)}
                </p>
              </td>
            </tr>

            <tr>
              <td align="center" class="email-footer" style="padding: 18px 16px 6px; color: #8a8496; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 11.5px; line-height: 1.7;">
                <div style="width: 44px; height: 2px; margin: 0 auto 12px; border-radius: 2px; background-color: #6c5ce7; opacity: 0.5;"></div>
                DevFlow &mdash; project management for modern software teams.<br />
                <a href="${termsUrl}" style="color: #6c5ce7; text-decoration: none;">Terms of Use</a>
                &middot;
                <a href="${privacyUrl}" style="color: #6c5ce7; text-decoration: none;">Privacy Policy</a><br />
                This is an automated message. Please do not reply.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function renderEmailText({
  heading,
  paragraphs,
  actionLabel,
  actionUrl,
  expiry,
  note,
}: EmailContent) {
  return [
    heading,
    "",
    ...paragraphs.flatMap((paragraph) => [paragraph, ""]),
    `${actionLabel}: ${actionUrl}`,
    "",
    expiry,
    "",
    note,
    "",
    "DevFlow — project management for modern software teams.",
    `Terms of Use: ${frontendOrigin}/terms`,
    `Privacy Policy: ${frontendOrigin}/privacy`,
    "This is an automated message. Please do not reply.",
  ].join("\n");
}

async function sendEmail(content: EmailContent): Promise<SendEmailResult> {
  if (!resend) {
    return { status: "SKIPPED" };
  }

  try {
    const { error } = await resend.emails.send({
      from: emailFrom,
      to: content.to,
      subject: content.subject,
      html: renderEmailHtml(content),
      text: renderEmailText(content),
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
    preheader: "One click to finish setting up your DevFlow account.",
    heading: "Verify your email",
    paragraphs: [
      "Hi there,",
      "Confirm your email address to finish setting up your DevFlow account. Once verified, you can sign in and start creating projects.",
    ],
    actionLabel: "Verify email",
    actionUrl,
    expiry: "This link expires in 1 hour.",
    note: "You are receiving this because an account was created with this email address. If this wasn’t you, you can ignore this message.",
  });
}

export function sendPasswordResetEmail(to: string, token: string) {
  const actionUrl = `${frontendOrigin}/reset-password?token=${encodeURIComponent(token)}`;

  return sendEmail({
    to,
    subject: "Reset your DevFlow password",
    preheader: "Use this one-time link within 1 hour.",
    heading: "Reset your password",
    paragraphs: [
      "Hi there,",
      "We received a request to reset the password for your DevFlow account. Choose a new password using the button below.",
    ],
    actionLabel: "Reset password",
    actionUrl,
    expiry: "This link expires in 1 hour and can only be used once.",
    note: "If you didn’t request this, you can safely ignore this email — your password will not change.",
  });
}
