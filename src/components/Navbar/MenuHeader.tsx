import Container from "@/components/Container/Container";
import { CloseIcon } from "@/components/Icons/MenuIcons";
import styles from "./FullscreenMenu.module.css";

interface MenuHeaderProps {
  onClose: () => void;
}

/** Cabecera del menú fullscreen: etiqueta y botón de cierre, con la misma
 *  estructura que el navbar principal. */
export default function MenuHeader({ onClose }: MenuHeaderProps) {
  return (
    <div className={styles.headerBar}>
      <Container>
        <div className={styles.headerInner}>
          <span className={styles.navLabel}>Navigation</span>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close menu"
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
