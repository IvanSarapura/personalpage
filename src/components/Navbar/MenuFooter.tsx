import Container from "@/components/Container/Container";
import styles from "./FullscreenMenu.module.css";

/** Pie del menú fullscreen, alineado con el grid del sitio. */
export default function MenuFooter() {
  return (
    <div className={styles.footerBar}>
      <Container>
        <div className={styles.footerInner}>
          <div className={styles.footerDivider} />
          <div className={styles.footerContent}>
            <p className={styles.footerTagline}>AI Customer Intelligence for restaurants</p>
            <a href="mailto:hello@sira.ai" className={styles.footerEmail}>
              hello@sira.ai
            </a>
          </div>
        </div>
      </Container>
    </div>
  );
}
