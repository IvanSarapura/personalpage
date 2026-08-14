import Container from "@/components/Container/Container";
import { getSiteCopy, SITE } from "@/data/site";
import type { Locale } from "@/data/locale";
import styles from "./FullscreenMenu.module.css";

interface MenuFooterProps {
  locale: Locale;
}

/** Pie del menú fullscreen, alineado con el grid del sitio. */
export default function MenuFooter({ locale }: MenuFooterProps) {
  return (
    <div className={styles.footerBar}>
      <Container>
        <div className={styles.footerInner}>
          <div className={styles.footerDivider} />
          <div className={styles.footerContent}>
            <p className={styles.footerTagline}>{getSiteCopy(locale).tagline}</p>
            <a href={`mailto:${SITE.email}`} className={styles.footerEmail}>
              {SITE.email}
            </a>
          </div>
        </div>
      </Container>
    </div>
  );
}
