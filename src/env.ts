import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    SIRA_CRM_WEBHOOK_URL: z.url().optional(),
  },
  client: {
    NEXT_PUBLIC_SITE_URL: z.url().default("https://sira.ai"),
    NEXT_PUBLIC_ANALYTICS_ID: z.string().optional(),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_ANALYTICS_ID: process.env.NEXT_PUBLIC_ANALYTICS_ID,
  },
});
