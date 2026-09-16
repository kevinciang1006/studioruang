import { Resend } from "resend";
import { budgetRangeLabels, projectTypeLabels, timelineLabels } from "./form-options";
import type { ConsultationInput } from "./schemas";

/**
 * Transactional email (confirmation to the submitter + notification to the
 * site owner) via Resend. Best-effort: sendEmails() never throws — a Resend
 * outage must never lose a lead or break the success UI. The Supabase row
 * inserted by src/pages/api/consultation.ts remains the source of truth.
 */

const FROM = "Studio Ruang <hello@send.kevinciang.com>";

function getResendClient(): Resend {
  const apiKey = import.meta.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured (see .env.example).");
  }
  return new Resend(apiKey);
}

function getOwnerEmail(): string {
  const email = import.meta.env.OWNER_EMAIL;
  if (!email) {
    throw new Error("OWNER_EMAIL is not configured (see .env.example).");
  }
  return email;
}

interface EmailContent {
  subject: string;
  html: string;
  text: string;
}

function layout(bodyHtml: string): string {
  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background-color:#F5F1EA;font-family:Georgia,'Times New Roman',serif;color:#1C1A17;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F5F1EA;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" style="max-width:560px;background-color:#FFFFFF;border:1px solid #D8D0C2;overflow:hidden;">
            <tr>
              <td style="background-color:#A8543A;padding:20px 32px;">
                <span style="font-size:19px;font-weight:700;color:#F5F1EA;">Studio Ruang</span>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;font-family:Helvetica,Arial,sans-serif;">
                ${bodyHtml}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function confirmationEmail(data: ConsultationInput): EmailContent {
  const firstName = data.name.trim().split(/\s+/)[0] ?? data.name;
  const subject = "Thanks — we've received your enquiry";
  const excerpt = data.message.length > 240 ? `${data.message.slice(0, 240)}…` : data.message;

  const html = layout(`
    <h1 style="margin:0 0 16px;font-size:21px;line-height:1.3;">Thanks — we've received your enquiry</h1>
    <p style="margin:0 0 16px;font-size:15px;line-height:1.6;">Hi ${firstName},</p>
    <p style="margin:0 0 16px;font-size:15px;line-height:1.6;">
      Thank you for reaching out to Studio Ruang. We've received your consultation enquiry and
      will be in touch within 2 business days to arrange a first conversation.
    </p>
    <table role="presentation" width="100%" style="background-color:#EFE9DE;border:1px solid #D8D0C2;margin:0 0 16px;">
      <tr>
        <td style="padding:16px 20px;font-size:14px;line-height:1.9;">
          <strong>Project type:</strong> ${projectTypeLabels[data.projectType]}<br />
          <strong>Budget:</strong> ${budgetRangeLabels[data.budgetRange]}<br />
          <strong>Timeline:</strong> ${timelineLabels[data.timeline]}<br />
          <strong>Your message:</strong> ${excerpt}
        </td>
      </tr>
    </table>
    <p style="margin:0;font-size:15px;line-height:1.6;">— The Studio Ruang team</p>
  `);

  const text = `Thanks — we've received your enquiry

Hi ${firstName},

Thank you for reaching out to Studio Ruang. We've received your consultation enquiry and will be in touch within 2 business days to arrange a first conversation.

Project type: ${projectTypeLabels[data.projectType]}
Budget: ${budgetRangeLabels[data.budgetRange]}
Timeline: ${timelineLabels[data.timeline]}
Your message: ${excerpt}

— The Studio Ruang team`;

  return { subject, html, text };
}

function ownerNotificationEmail(data: ConsultationInput): EmailContent {
  const rows: [string, string][] = [
    ["Name", data.name],
    ["Email", data.email],
    ["Phone", data.phone],
    ["Project type", projectTypeLabels[data.projectType]],
    ["Budget", budgetRangeLabels[data.budgetRange]],
    ["Timeline", timelineLabels[data.timeline]],
    ["Message", data.message],
  ];

  const html = layout(`
    <h1 style="margin:0 0 16px;font-size:21px;line-height:1.3;">New Studio Ruang submission</h1>
    <table role="presentation" width="100%" style="border-collapse:collapse;">
      ${rows
        .map(
          ([label, value]) =>
            `<tr><td style="padding:8px 0;font-size:14px;color:#6B655C;width:130px;vertical-align:top;">${label}</td><td style="padding:8px 0;font-size:14px;">${value}</td></tr>`
        )
        .join("")}
    </table>
  `);

  const text = `New Studio Ruang submission\n\n${rows.map(([label, value]) => `${label}: ${value}`).join("\n")}`;

  return { subject: `New Studio Ruang submission — ${data.name}`, html, text };
}

export async function sendEmails(data: ConsultationInput): Promise<void> {
  try {
    const resend = getResendClient();
    const ownerEmail = getOwnerEmail();
    const confirmation = confirmationEmail(data);
    const notification = ownerNotificationEmail(data);

    const results = await Promise.allSettled([
      resend.emails.send({
        from: FROM,
        to: data.email,
        replyTo: ownerEmail,
        subject: confirmation.subject,
        html: confirmation.html,
        text: confirmation.text,
      }),
      resend.emails.send({
        from: FROM,
        to: ownerEmail,
        replyTo: ownerEmail,
        subject: notification.subject,
        html: notification.html,
        text: notification.text,
      }),
    ]);

    for (const result of results) {
      if (result.status === "rejected") {
        console.error("[email] send failed:", result.reason);
      } else if (result.value.error) {
        console.error("[email] Resend API error:", result.value.error);
      }
    }
  } catch (err) {
    console.error("[email] sendEmails failed:", err);
  }
}
