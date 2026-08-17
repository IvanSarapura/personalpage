import { beforeEach, describe, expect, it, vi } from "vitest";
import { INITIAL_CONTACT_STATE } from "@/lib/contact";

const mocks = vi.hoisted(() => ({
  checkBotId: vi.fn(),
  send: vi.fn(),
}));

vi.mock("server-only", () => ({}));
vi.mock("botid/server", () => ({ checkBotId: mocks.checkBotId }));
vi.mock("resend", () => ({
  Resend: class MockResend {
    emails = { send: mocks.send };
  },
}));
vi.mock("@/env", () => ({
  env: {
    RESEND_API_KEY: "re_test",
    RESEND_FROM_EMAIL: "contact@mail.example.com",
    CONTACT_TO_EMAIL: "owner@example.com",
  },
}));

import { sendContactMessage } from "@/app/actions/contact";

function validFormData(): FormData {
  const formData = new FormData();
  formData.set("name", "Ada Lovelace");
  formData.set("email", "ada@example.com");
  formData.set("message", "I would like to discuss a thoughtful collaboration.");
  formData.set("submissionId", "550e8400-e29b-41d4-a716-446655440000");
  return formData;
}

describe("sendContactMessage", () => {
  beforeEach(() => {
    mocks.checkBotId.mockReset().mockResolvedValue({ isBot: false, isHuman: true });
    mocks.send.mockReset().mockResolvedValue({
      data: { id: "email_123" },
      error: null,
      headers: null,
    });
  });

  it("envía desde el dominio verificado y usa el visitante como Reply-To", async () => {
    const result = await sendContactMessage("en", INITIAL_CONTACT_STATE, validFormData());

    expect(result).toEqual({ status: "success" });
    expect(mocks.send).toHaveBeenCalledOnce();
    expect(mocks.send).toHaveBeenCalledWith(
      expect.objectContaining({
        from: "Iván Sarapura · Portfolio <contact@mail.example.com>",
        to: ["owner@example.com"],
        replyTo: "ada@example.com",
      }),
      { idempotencyKey: "portfolio-contact/550e8400-e29b-41d4-a716-446655440000" }
    );
  });

  it("no consulta servicios externos si el formulario es inválido", async () => {
    const formData = validFormData();
    formData.set("email", "invalid");

    const result = await sendContactMessage("es", INITIAL_CONTACT_STATE, formData);

    expect(result).toEqual({ status: "validation-error", fieldErrors: { email: true } });
    expect(mocks.checkBotId).not.toHaveBeenCalled();
    expect(mocks.send).not.toHaveBeenCalled();
  });

  it("responde éxito silencioso al honeypot sin usar BotID ni Resend", async () => {
    const formData = validFormData();
    formData.set("website", "buy-now");

    const result = await sendContactMessage("en", INITIAL_CONTACT_STATE, formData);

    expect(result).toEqual({ status: "success" });
    expect(mocks.checkBotId).not.toHaveBeenCalled();
    expect(mocks.send).not.toHaveBeenCalled();
  });

  it("bloquea bots sin revelar el motivo al cliente", async () => {
    mocks.checkBotId.mockResolvedValue({ isBot: true, isHuman: false });

    const result = await sendContactMessage("en", INITIAL_CONTACT_STATE, validFormData());

    expect(result).toEqual({ status: "error" });
    expect(mocks.send).not.toHaveBeenCalled();
  });
});
