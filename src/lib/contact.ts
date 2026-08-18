import { z } from "zod";

export const CONTACT_LIMITS = {
  nameMin: 2,
  nameMax: 80,
  emailMax: 254,
  messageMin: 20,
  messageMax: 2_000,
} as const;

export type ContactField = "name" | "email" | "message";

export interface ContactActionState {
  status: "idle" | "validation-error" | "rate-limited" | "success" | "error";
  fieldErrors?: Partial<Record<ContactField, true>>;
}

export const INITIAL_CONTACT_STATE: ContactActionState = { status: "idle" };

const contactSchema = z.object({
  name: z.string().trim().min(CONTACT_LIMITS.nameMin).max(CONTACT_LIMITS.nameMax),
  email: z.string().trim().max(CONTACT_LIMITS.emailMax).pipe(z.email()),
  message: z.string().trim().min(CONTACT_LIMITS.messageMin).max(CONTACT_LIMITS.messageMax),
  submissionId: z.uuid(),
});

export type ContactSubmission = z.infer<typeof contactSchema>;

function stringValue(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

export function hasFilledHoneypot(formData: FormData): boolean {
  return stringValue(formData, "website").trim().length > 0;
}

export function parseContactSubmission(
  formData: FormData
):
  | { success: true; data: ContactSubmission }
  | { success: false; fieldErrors: Partial<Record<ContactField, true>> } {
  const result = contactSchema.safeParse({
    name: stringValue(formData, "name"),
    email: stringValue(formData, "email"),
    message: stringValue(formData, "message"),
    submissionId: stringValue(formData, "submissionId"),
  });

  if (result.success) return result;

  const errors = z.flattenError(result.error).fieldErrors;
  return {
    success: false,
    fieldErrors: {
      ...(errors.name ? { name: true } : {}),
      ...(errors.email ? { email: true } : {}),
      ...(errors.message ? { message: true } : {}),
    },
  };
}
