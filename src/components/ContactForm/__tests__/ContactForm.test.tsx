import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
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
    expect(feedback.closest("[aria-live]")).toHaveAttribute("aria-live", "polite");
    expect(name).toHaveValue("Ada Lovelace");
    expect(email).toHaveValue("ada@example.com");
    expect(message).toHaveValue("Me gustaría conversar sobre una colaboración profesional.");
    expect(screen.queryByRole("link", { name: /linkedin/i })).not.toBeInTheDocument();
  });

  it("clears a server field error as soon as that field is corrected", async () => {
    const user = userEvent.setup();
    mocks.sendContactMessage.mockResolvedValue({
      status: "validation-error",
      fieldErrors: { name: true },
    });

    render(
      <ContactForm
        locale="en"
        copy={getUi("en").contact}
        fallbackHref="https://www.linkedin.com/in/example"
      />
    );

    const name = screen.getByRole("textbox", { name: "Name" });
    await user.type(name, "Ada Lovelace");
    await user.type(screen.getByRole("textbox", { name: "Email" }), "ada@example.com");
    await user.type(
      screen.getByRole("textbox", { name: "Message" }),
      "I would like to discuss a professional collaboration."
    );
    await user.click(screen.getByRole("button", { name: /^send message$/i }));

    await screen.findByText(getUi("en").contact.validationError);
    expect(name).toHaveAttribute("aria-invalid", "true");
    expect(document.querySelector("#contact-name-error")).toHaveAttribute("aria-live", "polite");

    await user.type(name, " Jr.");
    expect(name).not.toHaveAttribute("aria-invalid");
    expect(document.querySelector("#contact-name-error")).not.toBeInTheDocument();
  });

  it("exposes a client error on blur, but not while a virgin field is being completed", async () => {
    const user = userEvent.setup();
    render(
      <ContactForm
        locale="en"
        copy={getUi("en").contact}
        fallbackHref="https://www.linkedin.com/in/example"
      />
    );

    const name = screen.getByRole("textbox", { name: "Name" });
    await user.type(name, "A");
    expect(name).not.toHaveAttribute("aria-invalid");
    expect(document.querySelector("#contact-name-error")).not.toBeInTheDocument();

    await user.tab();
    expect(name).toHaveAttribute("aria-invalid", "true");
    expect(name).toHaveAttribute("aria-errormessage", "contact-name-error");
    expect(document.querySelector("#contact-name-error")).toHaveAttribute("aria-live", "polite");

    await user.click(name);
    await user.type(name, "da");
    expect(name).not.toHaveAttribute("aria-invalid");
    expect(name).not.toHaveAttribute("aria-errormessage");
    expect(document.querySelector("#contact-name-error")).not.toBeInTheDocument();
  });

  it("marks the form busy while its server action is pending", async () => {
    const user = userEvent.setup();
    let resolveAction!: (value: { status: "success" }) => void;
    mocks.sendContactMessage.mockReturnValue(
      new Promise((resolve) => {
        resolveAction = resolve;
      })
    );

    const { container } = render(
      <ContactForm
        locale="en"
        copy={getUi("en").contact}
        fallbackHref="https://www.linkedin.com/in/example"
      />
    );

    await user.type(screen.getByRole("textbox", { name: "Name" }), "Ada Lovelace");
    await user.type(screen.getByRole("textbox", { name: "Email" }), "ada@example.com");
    await user.type(
      screen.getByRole("textbox", { name: "Message" }),
      "I would like to discuss a professional collaboration."
    );
    await user.click(screen.getByRole("button", { name: /^send message$/i }));

    const form = container.querySelector("form");
    await waitFor(() => expect(form).toHaveAttribute("aria-busy", "true"));
    resolveAction({ status: "success" });
    await waitFor(() => expect(form).toHaveAttribute("aria-busy", "false"));
  });
});
