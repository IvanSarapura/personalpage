import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    /** Clave restringida al dominio de envío configurado en Resend. */
    RESEND_API_KEY: z.string().min(1).optional(),
    /** Dirección verificada usada como remitente, por ejemplo contact@mail.example.com. */
    RESEND_FROM_EMAIL: z.email().optional(),
    /** Bandeja privada que recibe los mensajes del formulario. */
    CONTACT_TO_EMAIL: z.email().optional(),
  },
  client: {
    /** URL canónica del sitio. Setear en producción (Vercel) — el default solo cubre dev local. */
    NEXT_PUBLIC_SITE_URL: z.url().default("http://localhost:3000"),
    NEXT_PUBLIC_ANALYTICS_ID: z.string().optional(),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_ANALYTICS_ID: process.env.NEXT_PUBLIC_ANALYTICS_ID,
  },
});
