import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import styles from "./SectionLink.module.css";

interface SectionLinkProps {
  href: string;
  children: ReactNode;
}

export default function SectionLink({ href, children }: SectionLinkProps) {
  return (
    <Link href={href} className={styles.link}>
      <span className={styles.label}>{children}</span>
      <ArrowRight className={styles.arrow} aria-hidden="true" focusable="false" />
    </Link>
  );
}
