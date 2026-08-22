import Link from "next/link";
import Container from "@/components/Container/Container";
import styles from "./FullscreenMenu.module.css";
import type { MenuItem } from "@/types/navigation";

const ITEM_ANIMATION_STAGGER_MS = 60;

interface MenuNavProps {
  items: MenuItem[];
  isOpen: boolean;
  onNavigate: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void;
  onClose: () => void;
  ariaLabel: string;
}

/** Lista de navegación del menú fullscreen. Los ítems con `href` son enlaces; los
 *  que no, botones deshabilitados. El stagger anima la entrada/salida en cascada. */
export default function MenuNav({ items, isOpen, onNavigate, onClose, ariaLabel }: MenuNavProps) {
  return (
    <div className={styles.body}>
      <Container>
        <nav className={styles.nav} aria-label={ariaLabel}>
          <ul className={styles.list}>
            {items.map((item, i) => {
              const { href, label, index } = item;
              const delay = isOpen
                ? i * ITEM_ANIMATION_STAGGER_MS
                : (items.length - 1 - i) * ITEM_ANIMATION_STAGGER_MS;
              const isLast = i === items.length - 1;

              return (
                <li
                  key={label}
                  className={`${styles.item} ${isOpen ? styles.itemOpen : ""} ${isLast ? styles.itemLast : ""}`}
                  style={{ transitionDelay: `${delay}ms` }}
                >
                  {href ? (
                    <Link href={href} className={styles.link} onClick={(e) => onNavigate(e, href)}>
                      <span className={styles.index}>{index}</span>
                      <span className={styles.label}>{label}</span>
                    </Link>
                  ) : (
                    <button type="button" className={styles.link} onClick={onClose} disabled>
                      <span className={styles.index}>{index}</span>
                      <span className={styles.label}>{label}</span>
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </Container>
    </div>
  );
}
