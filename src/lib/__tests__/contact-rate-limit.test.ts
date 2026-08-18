import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  checkRateLimit: vi.fn(),
}));

vi.mock("server-only", () => ({}));
vi.mock("@vercel/firewall", () => ({ checkRateLimit: mocks.checkRateLimit }));

import { CONTACT_RATE_LIMIT_ID, isContactRateLimited } from "@/lib/contact-rate-limit";

describe("isContactRateLimited", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mocks.checkRateLimit.mockReset().mockResolvedValue({ rateLimited: false });
  });

  it("consulta el identificador configurado en Vercel Firewall", async () => {
    await expect(isContactRateLimited()).resolves.toBe(false);

    expect(mocks.checkRateLimit).toHaveBeenCalledWith(CONTACT_RATE_LIMIT_ID);
  });

  it("bloquea cuando Vercel informa que se superó el límite", async () => {
    mocks.checkRateLimit.mockResolvedValue({ rateLimited: true });

    await expect(isContactRateLimited()).resolves.toBe(true);
  });

  it("mantiene el formulario disponible si falla la comprobación", async () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => undefined);
    mocks.checkRateLimit.mockRejectedValue(new TypeError("network failure"));

    await expect(isContactRateLimited()).resolves.toBe(false);
    expect(consoleError).toHaveBeenCalledWith("[contact] Vercel rate limit check failed", {
      cause: "TypeError",
    });
  });

  it("informa una regla ausente sin bloquear el formulario", async () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => undefined);
    mocks.checkRateLimit.mockResolvedValue({ rateLimited: false, error: "not-found" });

    await expect(isContactRateLimited()).resolves.toBe(false);
    expect(consoleError).toHaveBeenCalledWith("[contact] Vercel rate limit is not configured", {
      rateLimitId: CONTACT_RATE_LIMIT_ID,
    });
  });
});
