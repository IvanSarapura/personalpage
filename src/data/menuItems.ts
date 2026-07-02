import type { MenuItem } from "@/types/navigation";

/** Ítems del menú fullscreen. Los que no tienen `href` se muestran deshabilitados. */
export const MENU_ITEMS: MenuItem[] = [
  { label: "Home", href: "#home", index: "01" },
  { label: "Modules", href: "#modules", index: "02" },
  { label: "Features", href: "#features", index: "03" },
  { label: "Pricing", index: "04" },
  { label: "About", index: "05" },
  { label: "Contact", href: "#contact", index: "06" },
];
