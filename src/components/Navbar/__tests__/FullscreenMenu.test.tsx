import { describe, it, expect, vi, beforeEach } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FullscreenMenu from "../FullscreenMenu";
import { MENU_ITEMS } from "@/data/menuItems";

const { smoothScrollToMock } = vi.hoisted(() => ({
  smoothScrollToMock: vi.fn(),
}));

vi.mock("@/lib/smooth-scroll", () => ({
  smoothScrollTo: smoothScrollToMock,
}));

const DIALOG_NAME = "Main navigation menu";
const ITEM_LABELS = MENU_ITEMS.map((item) => item.label);
const LINKED_ITEMS = MENU_ITEMS.filter((item) => item.href);
const DISABLED_ITEMS = MENU_ITEMS.filter((item) => !item.href);

describe("FullscreenMenu", () => {
  beforeEach(() => {
    document.body.style.overflow = "";
    smoothScrollToMock.mockClear();
  });

  it("renderiza un diálogo accesible con todos los ítems del menú", () => {
    render(<FullscreenMenu isOpen onClose={() => {}} locale="en" />);

    expect(screen.getByRole("dialog", { name: DIALOG_NAME })).toBeInTheDocument();
    for (const label of ITEM_LABELS) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }
  });

  it("renderiza enlaces para ítems con href y botones deshabilitados para los que no", () => {
    render(<FullscreenMenu isOpen onClose={() => {}} locale="en" />);

    for (const item of LINKED_ITEMS) {
      expect(screen.getByRole("link", { name: new RegExp(item.label) })).toHaveAttribute(
        "href",
        item.href
      );
    }
    for (const item of DISABLED_ITEMS) {
      expect(screen.getByRole("button", { name: new RegExp(item.label) })).toBeDisabled();
    }
  });

  it("bloquea el scroll del body cuando está abierto", () => {
    render(<FullscreenMenu isOpen onClose={() => {}} locale="en" />);
    expect(document.body.style.overflow).toBe("hidden");
  });

  it("no bloquea el scroll del body cuando está cerrado", () => {
    render(<FullscreenMenu isOpen={false} onClose={() => {}} locale="en" />);
    expect(document.body.style.overflow).toBe("");
  });

  it("llama onClose al pulsar el botón de cerrar", async () => {
    const onClose = vi.fn();
    render(<FullscreenMenu isOpen onClose={onClose} locale="en" />);

    await userEvent.click(screen.getByRole("button", { name: "Close menu" }));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("llama onClose al pulsar Escape", async () => {
    const onClose = vi.fn();
    render(<FullscreenMenu isOpen onClose={onClose} locale="en" />);

    await userEvent.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("llama onClose al hacer click en el backdrop", async () => {
    const onClose = vi.fn();
    render(<FullscreenMenu isOpen onClose={onClose} locale="en" />);

    await userEvent.click(screen.getByRole("dialog", { name: DIALOG_NAME }));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("llama onClose al activar un enlace de navegación", async () => {
    const onClose = vi.fn();
    render(<FullscreenMenu isOpen onClose={onClose} locale="en" />);

    await userEvent.click(screen.getByRole("link", { name: /Home/ }));
    expect(onClose).toHaveBeenCalled();
  });

  it("conserva el hash de la página actual en el historial al cerrar el menú", async () => {
    window.history.replaceState(null, "", "/");
    const target = document.createElement("section");
    target.id = "contact";
    document.body.appendChild(target);
    const onClose = vi.fn();

    try {
      render(<FullscreenMenu isOpen onClose={onClose} locale="en" />);

      fireEvent.click(screen.getByRole("link", { name: /Contact/ }));

      expect(onClose).toHaveBeenCalledOnce();
      await waitFor(() => expect(window.location.hash).toBe("#contact"));
      expect(smoothScrollToMock).toHaveBeenCalledWith(0);
    } finally {
      target.remove();
      window.history.replaceState(null, "", "/");
    }
  });
});
