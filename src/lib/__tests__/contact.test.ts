import { describe, expect, it } from "vitest";
import { CONTACT_LIMITS, hasFilledHoneypot, parseContactSubmission } from "@/lib/contact";

function validFormData(): FormData {
  const formData = new FormData();
  formData.set("name", "Ada Lovelace");
  formData.set("email", "ada@example.com");
  formData.set("message", "I would like to discuss a thoughtful collaboration.");
  formData.set("submissionId", "550e8400-e29b-41d4-a716-446655440000");
  return formData;
}

describe("contact submission validation", () => {
  it("normaliza y acepta una consulta válida", () => {
    const formData = validFormData();
    formData.set("name", "  Ada Lovelace  ");

    const result = parseContactSubmission(formData);

    expect(result.success).toBe(true);
    if (result.success) expect(result.data.name).toBe("Ada Lovelace");
  });

  it("marca únicamente los campos públicos inválidos", () => {
    const formData = validFormData();
    formData.set("name", "A");
    formData.set("email", "not-an-email");
    formData.set("message", "Too short");

    const result = parseContactSubmission(formData);

    expect(result).toEqual({
      success: false,
      fieldErrors: { name: true, email: true, message: true },
    });
  });

  it("rechaza payloads que superan el máximo permitido", () => {
    const formData = validFormData();
    formData.set("message", "x".repeat(CONTACT_LIMITS.messageMax + 1));

    const result = parseContactSubmission(formData);

    expect(result.success).toBe(false);
    if (!result.success) expect(result.fieldErrors.message).toBe(true);
  });

  it("detecta el honeypot sin confundir un campo vacío", () => {
    const formData = validFormData();
    expect(hasFilledHoneypot(formData)).toBe(false);

    formData.set("website", "https://spam.example");
    expect(hasFilledHoneypot(formData)).toBe(true);
  });
});
