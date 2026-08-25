import Container from "@/components/Container/Container";
import { Logo } from "@/components/Icons/Logo";
import { CloseIcon } from "@/components/Icons/MenuIcons";
import styles from "./FullscreenMenu.module.css";

interface MenuHeaderProps {
  onClose: () => void;
  navigationLabel: string;
  closeLabel: string;
}

/** Cabecera del menú fullscreen: logotipo (marca) y botón de cierre, con la
 *  misma estructura que el navbar principal. */
export default function MenuHeader({ onClose, navigationLabel, closeLabel }: MenuHeaderProps) {
  return (
    <div className={styles.headerBar}>
      <Container>
        <div className={styles.headerInner}>
          <span className="inline-flex items-center" role="img" aria-label={navigationLabel}>
            <Logo className="h-auto w-[40px] text-[var(--section-text)] md:w-[48px]" />
          </span>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label={closeLabel}
          >
            <span className={styles.closeIcon} aria-hidden="true">
              <CloseIcon />
            </span>
          </button>
        </div>
      </Container>
      <Container>
        <div className={styles.divider} />
      </Container>
    </div>
  );
}
