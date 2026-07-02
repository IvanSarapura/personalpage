import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FullscreenMenu from "../FullscreenMenu";

const DIALOG_NAME = "Main navigation menu";
const ITEM_LABELS = ["Home", "Modules", "Features", "Pricing", "About", "Contact"];

describe("FullscreenMenu", () => {
  beforeEach(() => {
    document.body.style.overflow = "";
  });

  it("renderiza un diálogo accesible con todos los ítems del menú", () => {
    render(<FullscreenMenu isOpen onClose={() => {}} />);

    expect(screen.getByRole("dialog", { name: DIALOG_NAME })).toBeInTheDocument();
    for (const label of ITEM_LABELS) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }
  });

  it("renderiza enlaces para ítems con href y botones deshabilitados para los que no", () => {
    render(<FullscreenMenu isOpen onClose={() => {}} />);

    expect(screen.getByRole("link", { name: /Home/ })).toHaveAttribute("href", "#home");
    expect(screen.getByRole("link", { name: /Contact/ })).toHaveAttribute("href", "#contact");
    expect(screen.getByRole("button", { name: /Pricing/ })).toBeDisabled();
    expect(screen.getByRole("button", { name: /About/ })).toBeDisabled();
  });

  it("bloquea el scroll del body cuando está abierto", () => {
    render(<FullscreenMenu isOpen onClose={() => {}} />);
    expect(document.body.style.overflow).toBe("hidden");
  });

  it("no bloquea el scroll del body cuando está cerrado", () => {
    render(<FullscreenMenu isOpen={false} onClose={() => {}} />);
    expect(document.body.style.overflow).toBe("");
  });

  it("llama onClose al pulsar el botón de cerrar", async () => {
    const onClose = vi.fn();
    render(<FullscreenMenu isOpen onClose={onClose} />);

    await userEvent.click(screen.getByRole("button", { name: "Close menu" }));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("llama onClose al pulsar Escape", async () => {
    const onClose = vi.fn();
    render(<FullscreenMenu isOpen onClose={onClose} />);

    await userEvent.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("llama onClose al hacer click en el backdrop", async () => {
    const onClose = vi.fn();
    render(<FullscreenMenu isOpen onClose={onClose} />);

    await userEvent.click(screen.getByRole("dialog", { name: DIALOG_NAME }));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("llama onClose al activar un enlace de navegación", async () => {
    const onClose = vi.fn();
    render(<FullscreenMenu isOpen onClose={onClose} />);

    await userEvent.click(screen.getByRole("link", { name: /Home/ }));
    expect(onClose).toHaveBeenCalled();
  });
});
