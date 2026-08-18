import "server-only";

import { checkRateLimit } from "@vercel/firewall";

export const CONTACT_RATE_LIMIT_ID = "portfolio-contact";

export async function isContactRateLimited(): Promise<boolean> {
  try {
    const result = await checkRateLimit(CONTACT_RATE_LIMIT_ID);

    if (result.error === "not-found") {
      console.error("[contact] Vercel rate limit is not configured", {
        rateLimitId: CONTACT_RATE_LIMIT_ID,
      });
    }

    return result.rateLimited;
  } catch (error) {
    // Keep the form available during a Firewall outage. BotID, validation,
    // the honeypot and Resend idempotency still protect the submission path.
    console.error("[contact] Vercel rate limit check failed", {
      cause: error instanceof Error ? error.name : "UnknownError",
    });
    return false;
  }
}
