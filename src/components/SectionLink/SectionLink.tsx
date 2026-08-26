import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";

import { cn } from "@/lib/utils";
import styles from "./SectionLink.module.css";

interface SectionLinkBaseProps {
  href: string;
  children: ReactNode;
  icon?: "arrow" | "arrowUp" | "external";
  size?: "body" | "caption";
  className?: string;
  ariaLabel?: string;
}

type InternalSectionLinkProps = SectionLinkBaseProps & {
  external?: false;
  opensInNewTabLabel?: never;
};

type ExternalSectionLinkProps = SectionLinkBaseProps & {
  external: true;
  opensInNewTabLabel: string;
};

type SectionLinkProps = InternalSectionLinkProps | ExternalSectionLinkProps;

export default function SectionLink(props: SectionLinkProps) {
  const { href, children, size = "body", className, ariaLabel } = props;
  const external = props.external === true;
  const icon = props.icon ?? (external ? "external" : "arrow");
  const opensInNewTabLabel = external ? props.opensInNewTabLabel : undefined;
  const externalAriaLabel =
    ariaLabel ??
    (external && typeof children === "string" ? `${children} (${opensInNewTabLabel})` : undefined);
  const linkClass = cn(styles.link, size === "caption" && styles.caption, className);
  const content = (
    <>
      <span className={styles.label}>
        {children}
        {external && <span className="sr-only"> {`(${opensInNewTabLabel})`}</span>}
      </span>
      {icon === "external" ? (
        <ExternalLink className={styles.arrow} aria-hidden="true" focusable="false" />
      ) : icon === "arrowUp" ? (
        <svg
          className={styles.arrowUp}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
          focusable="false"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M5.22 14.78a.75.75 0 0 0 1.06 0l7.22-7.22v5.69a.75.75 0 0 0 1.5 0v-7.5a.75.75 0 0 0-.75-.75h-7.5a.75.75 0 0 0 0 1.5h5.69l-7.22 7.22a.75.75 0 0 0 0 1.06Z"
          />
        </svg>
      ) : (
        <ArrowRight className={styles.arrow} aria-hidden="true" focusable="false" />
      )}
    </>
  );

  if (external) {
    return (
      <a
        href={href}
        className={linkClass}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={externalAriaLabel}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={linkClass} aria-label={ariaLabel}>
      {content}
    </Link>
  );
}

export type { SectionLinkProps };
