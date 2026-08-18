import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import ContactForm from "@/components/ContactForm/ContactForm";
import { getUi } from "@/data/ui";
import { CONTACT_LIMITS } from "@/lib/contact";

vi.mock("@/app/actions/contact", () => ({
  sendContactMessage: vi.fn(async () => ({ status: "success" })),
}));

describe("ContactForm", () => {
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
});
