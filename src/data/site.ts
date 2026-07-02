import { env } from "@/env";

export const SITE = {
  name: "Sira",
  tagline: "AI Customer Intelligence for restaurants",
  description:
    "Sira doesn't just show what's wrong, it fixes it. 7 modules in 1 platform driving revenue.",
  url: env.NEXT_PUBLIC_SITE_URL,
  social: {
    linkedin: "https://linkedin.com/company/sira",
    x: "https://x.com/sira",
  },
} as const;
