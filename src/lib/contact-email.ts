import type { ContactSubmission } from "@/lib/contact";
import type { Locale } from "@/data/locale";

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function buildContactEmail(
  submission: ContactSubmission,
  locale: Locale
): { html: string; text: string } {
  const name = escapeHtml(submission.name);
  const email = escapeHtml(submission.email);
  const message = escapeHtml(submission.message).replaceAll("\n", "<br />");
  const language = locale === "es" ? "Español" : "English";

  return {
    html: `<!doctype html>
<html lang="${locale}">
  <body style="margin:0;background:#f5f7ff;color:#19192d;font-family:Arial,sans-serif">
    <div style="display:none;max-height:0;overflow:hidden">New portfolio contact from ${name}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f7ff;padding:32px 16px">
      <tr><td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;background:#ffffff;border:1px solid #d9e3ff;border-radius:12px;overflow:hidden">
          <tr><td style="background:#0051e9;color:#ffffff;padding:18px 24px;font-size:13px;letter-spacing:.08em;text-transform:uppercase">Portfolio · New direct message</td></tr>
          <tr><td style="padding:28px 24px">
            <h1 style="margin:0 0 24px;font-size:26px;line-height:1.2">${name}</h1>
            <p style="margin:0 0 8px;color:#596078;font-size:13px;text-transform:uppercase;letter-spacing:.06em">Reply-to</p>
            <p style="margin:0 0 24px;font-size:16px"><a href="mailto:${email}" style="color:#0051e9">${email}</a></p>
            <p style="margin:0 0 8px;color:#596078;font-size:13px;text-transform:uppercase;letter-spacing:.06em">Message</p>
            <div style="font-size:16px;line-height:1.65;white-space:normal">${message}</div>
          </td></tr>
          <tr><td style="border-top:1px solid #e7ebf7;padding:16px 24px;color:#71778c;font-size:12px">Submitted from the ${language} portfolio · Reference ${submission.submissionId.slice(0, 8)}</td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`,
    text: `New portfolio contact\n\nName: ${submission.name}\nReply-to: ${submission.email}\nLanguage: ${language}\nReference: ${submission.submissionId.slice(0, 8)}\n\nMessage:\n${submission.message}`,
  };
}
