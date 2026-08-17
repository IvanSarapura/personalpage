"use server";

import { checkBotId } from "botid/server";
import { Resend } from "resend";
import { env } from "@/env";
import { hasLocale, type Locale } from "@/data/locale";
import { hasFilledHoneypot, parseContactSubmission, type ContactActionState } from "@/lib/contact";
import { buildContactEmail } from "@/lib/contact-email";

const ERROR_STATE: ContactActionState = { status: "error" };

export async function sendContactMessage(
  locale: Locale,
  _previousState: ContactActionState,
  formData: FormData
): Promise<ContactActionState> {
  // Answering honeypots as if the request succeeded gives basic bots no signal
  // to adapt, and avoids the cost of BotID and Resend checks.
  if (hasFilledHoneypot(formData)) return { status: "success" };

  const parsed = parseContactSubmission(formData);
  if (!parsed.success) {
    return { status: "validation-error", fieldErrors: parsed.fieldErrors };
  }

  if (!hasLocale(locale)) return ERROR_STATE;

  try {
    const verification = await checkBotId();
    if (verification.isBot) return ERROR_STATE;
  } catch (error) {
    console.error("[contact] BotID verification failed", {
      submissionId: parsed.data.submissionId,
      cause: error instanceof Error ? error.name : "UnknownError",
    });
    return ERROR_STATE;
  }

  const { RESEND_API_KEY, RESEND_FROM_EMAIL, CONTACT_TO_EMAIL } = env;
  if (!RESEND_API_KEY || !RESEND_FROM_EMAIL || !CONTACT_TO_EMAIL) {
    console.error("[contact] Resend configuration is incomplete", {
      submissionId: parsed.data.submissionId,
    });
    return ERROR_STATE;
  }

  const email = buildContactEmail(parsed.data, locale);

  try {
    const result = await new Resend(RESEND_API_KEY).emails.send(
      {
        from: `Iván Sarapura · Portfolio <${RESEND_FROM_EMAIL}>`,
        to: [CONTACT_TO_EMAIL],
        replyTo: parsed.data.email,
        subject: `Portfolio contact · ${locale.toUpperCase()} · ${parsed.data.submissionId.slice(0, 8)}`,
        html: email.html,
        text: email.text,
        tags: [
          { name: "source", value: "portfolio-contact" },
          { name: "locale", value: locale },
        ],
      },
      { idempotencyKey: `portfolio-contact/${parsed.data.submissionId}` }
    );

    if (result.error) {
      console.error("[contact] Resend rejected the message", {
        submissionId: parsed.data.submissionId,
        errorName: result.error.name,
        statusCode: result.error.statusCode,
      });
      return ERROR_STATE;
    }

    return { status: "success" };
  } catch (error) {
    console.error("[contact] Resend request failed", {
      submissionId: parsed.data.submissionId,
      cause: error instanceof Error ? error.name : "UnknownError",
    });
    return ERROR_STATE;
  }
}
