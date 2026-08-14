import Container from "@/components/Container/Container";
import { CloseIcon } from "@/components/Icons/MenuIcons";
import styles from "./FullscreenMenu.module.css";

interface MenuHeaderProps {
  onClose: () => void;
  navigationLabel: string;
  closeLabel: string;
}

/** Cabecera del menú fullscreen: etiqueta y botón de cierre, con la misma
 *  estructura que el navbar principal. */
export default function MenuHeader({ onClose, navigationLabel, closeLabel }: MenuHeaderProps) {
  return (
    <div className={styles.headerBar}>
      <Container>
        <div className={styles.headerInner}>
          <span className={styles.navLabel}>{navigationLabel}</span>
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
