import Container from "@/components/Container/Container";
import Section from "@/components/Section/Section";
import {
  StarIcon,
  ChatIcon,
  EnvelopeIcon,
  MapPinIcon,
  BellIcon,
  ChartBarIcon,
} from "@/components/Icons/SignalIcons";
import { getSignals, type SignalId } from "@/data/signals";
import { getUi } from "@/data/ui";
import type { Locale } from "@/data/locale";
import type { ReactElement } from "react";

const SIGNAL_ICONS: Record<SignalId, ReactElement> = {
  "web3-contracts": <MapPinIcon />,
  "ai-agents": <ChatIcon />,
  regtech: <BellIcon />,
  "legal-engineering": <StarIcon />,
  "typesafe-frontend": <EnvelopeIcon />,
  "product-venture": <ChartBarIcon />,
};

const cardClass =
  "flex flex-col gap-[var(--element-gap-sm)] rounded-[var(--radius-lg)] border-[length:var(--border-width-thin)] border-solid border-[color:var(--signal-card-border)] bg-[var(--color-white-pure)] p-[var(--content-gap)] [transition:transform_var(--duration-slow)_var(--ease-out),border-color_var(--duration-slow)_var(--ease-out)] hover:-translate-y-0.5 hover:border-[color:var(--signal-card-border-hover)] dark:bg-[var(--surface-primary)]";

interface SignalsSectionProps {
  locale: Locale;
}

export default function SignalsSection({ locale }: SignalsSectionProps) {
  const ui = getUi(locale);
  const signals = getSignals(locale);

  return (
    <Section
      variant="white"
      paddingY="lg"
      ariaLabel={ui.focus.ariaLabel}
      className="dark:bg-[var(--surface-tertiary)]"
      id="focus"
    >
      <Container>
        <h2 className="mb-[var(--element-gap)] text-[length:var(--display-2)] leading-[var(--display-2-lh)] font-normal tracking-[var(--display-2-tracking)] text-[var(--text-on-light)] max-[768px]:mb-[var(--element-gap-sm)] max-[768px]:text-[length:var(--heading-1)] max-[768px]:leading-[var(--heading-1-lh)] max-[768px]:tracking-[var(--heading-1-tracking)]">
          {ui.focus.heading}
        </h2>

        <p className="mb-[var(--section-gap)] max-w-[var(--content-max-text)] text-[length:var(--body-large)] leading-[var(--body-large-lh)] font-normal tracking-[var(--letter-spacing-snug)] text-[var(--text-on-light)] opacity-[var(--opacity-strong)] max-[768px]:mb-[var(--content-gap)] max-[768px]:text-[length:var(--body)] max-[768px]:leading-[var(--body-lh)]">
          {ui.focus.subheading}
        </p>

        {/* role="list" intencional: Safari descarta la semántica de lista con list-style:none. */}
        {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
        <ul
          className="mb-[var(--section-gap)] grid list-none grid-cols-3 gap-[var(--content-gap)] max-[768px]:mb-[var(--content-gap)] max-[768px]:grid-cols-2 max-[768px]:gap-[var(--element-gap)] max-[480px]:grid-cols-1"
          role="list"
        >
          {signals.map((signal) => (
            <li key={signal.id} className={cardClass}>
              <div
                className="flex h-[var(--icon-lg)] w-[var(--icon-lg)] shrink-0 items-center justify-center text-[var(--color-blue-screen)] dark:text-[var(--color-g-nova)]"
                aria-hidden="true"
              >
                {SIGNAL_ICONS[signal.id]}
              </div>
              <h3 className="text-[length:var(--heading-3)] leading-[var(--heading-3-lh)] font-semibold tracking-[var(--heading-3-tracking)] text-[var(--text-on-light)]">
                {signal.title}
              </h3>
              <p className="grow text-[length:var(--body)] leading-[var(--body-lh)] font-normal text-[var(--text-on-light)] opacity-[var(--opacity-emphasized)]">
                {signal.description}
              </p>
              <span className="inline-block self-start rounded-[var(--radius-full)] bg-[var(--color-blue-screen-subtle)] px-[var(--space-3)] py-[var(--space-1)] text-[length:var(--caption)] leading-[var(--caption-lh)] font-medium tracking-[var(--letter-spacing-wide)] text-[var(--color-blue-screen)] dark:bg-[var(--color-g-nova-subtle)] dark:text-[var(--color-g-nova)]">
                {signal.meta}
              </span>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
