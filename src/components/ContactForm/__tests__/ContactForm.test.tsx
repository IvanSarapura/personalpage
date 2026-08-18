import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ContactForm from "@/components/ContactForm/ContactForm";
import { getUi } from "@/data/ui";
import { CONTACT_LIMITS } from "@/lib/contact";

const mocks = vi.hoisted(() => ({ sendContactMessage: vi.fn() }));

vi.mock("@/app/actions/contact", () => ({ sendContactMessage: mocks.sendContactMessage }));

describe("ContactForm", () => {
  beforeEach(() => {
    mocks.sendContactMessage.mockReset().mockResolvedValue({ status: "success" });
  });

  it("expone labels, tipos, autocompletado y límites nativos accesibles", () => {
    render(
      <ContactForm
        locale="en"
        copy={getUi("en").contact}
        fallbackHref="https://www.linkedin.com/in/example"
      />
    );

    const name = screen.getByRole("textbox", { name: "Name" });
    const email = screen.getByRole("textbox", { name: "Email" });
    const message = screen.getByRole("textbox", { name: "Message" });

    expect(name).toBeRequired();
    expect(name).toHaveAttribute("autocomplete", "name");
    expect(name).toHaveAttribute("minlength", String(CONTACT_LIMITS.nameMin));
    expect(email).toHaveAttribute("type", "email");
    expect(email).toHaveAttribute("autocomplete", "email");
    expect(message).toHaveAttribute("maxlength", String(CONTACT_LIMITS.messageMax));
    expect(screen.getByRole("button", { name: /^send message$/i })).toBeEnabled();
  });

  it("renderiza la experiencia completa en español", () => {
    render(
      <ContactForm
        locale="es"
        copy={getUi("es").contact}
        fallbackHref="https://www.linkedin.com/in/example"
      />
    );

    expect(screen.getByRole("textbox", { name: "Nombre" })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Mensaje" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^enviar mensaje$/i })).toBeInTheDocument();
    expect(screen.queryByText("Mensaje directo")).not.toBeInTheDocument();
    expect(screen.queryByText("Todos los campos son obligatorios.")).not.toBeInTheDocument();
    expect(screen.queryByText(/No incluyas contraseñas/)).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /email/i })).not.toBeInTheDocument();
  });

  it("anuncia el límite en español y conserva los datos para reintentar", async () => {
    const user = userEvent.setup();
    mocks.sendContactMessage.mockResolvedValue({ status: "rate-limited" });

    render(
      <ContactForm
        locale="es"
        copy={getUi("es").contact}
        fallbackHref="https://www.linkedin.com/in/example"
      />
    );

    const name = screen.getByRole("textbox", { name: "Nombre" });
    const email = screen.getByRole("textbox", { name: "Email" });
    const message = screen.getByRole("textbox", { name: "Mensaje" });

    await user.type(name, "Ada Lovelace");
    await user.type(email, "ada@example.com");
    await user.type(message, "Me gustaría conversar sobre una colaboración profesional.");
    await user.click(screen.getByRole("button", { name: /^enviar mensaje$/i }));

    const feedback = await screen.findByText(
      "Enviaste varios mensajes en poco tiempo. Intentá nuevamente en unos minutos."
    );
    expect(feedback.closest("[aria-live]")).toHaveAttribute("aria-live", "assertive");
    expect(name).toHaveValue("Ada Lovelace");
    expect(email).toHaveValue("ada@example.com");
    expect(message).toHaveValue("Me gustaría conversar sobre una colaboración profesional.");
    expect(screen.queryByRole("link", { name: /linkedin/i })).not.toBeInTheDocument();
  });
});
