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
import { Badge } from "@/components/ui/badge";

const SIGNAL_ICONS: Record<SignalId, ReactElement> = {
  "web3-contracts": <MapPinIcon />,
  "ai-agents": <ChatIcon />,
  regtech: <BellIcon />,
  "legal-engineering": <StarIcon />,
  "typesafe-frontend": <EnvelopeIcon />,
  "product-venture": <ChartBarIcon />,
};

const cardClass =
  "flex flex-col gap-[var(--element-gap-sm)] rounded-[var(--radius-lg)] border-[length:var(--border-width-thin)] border-solid border-[color:var(--signal-card-border)] bg-[var(--primitive-color-white)] p-[var(--content-gap)] hover:border-[color:var(--signal-card-border-hover)] motion-safe:[transition:transform_var(--duration-slow)_var(--ease-out),border-color_var(--duration-slow)_var(--ease-out)] motion-safe:hover:-translate-y-0.5 dark:bg-[var(--section-surface)]";

interface SignalsSectionProps {
  locale: Locale;
}

export default function SignalsSection({ locale }: SignalsSectionProps) {
  const ui = getUi(locale);
  const signals = getSignals(locale);

  return (
    <Section variant="elevated" paddingY="lg" ariaLabel={ui.focus.ariaLabel} id="focus">
      <Container>
        <h2 className="mb-[var(--element-gap-sm)] text-[length:var(--heading-1)] leading-[var(--heading-1-lh)] font-normal tracking-[var(--heading-1-tracking)] text-[var(--section-text)] md:mb-[var(--element-gap)] md:text-[length:var(--display-2)] md:leading-[var(--display-2-lh)] md:tracking-[var(--display-2-tracking)]">
          {ui.focus.heading}
        </h2>

        <p className="mb-[var(--content-gap)] max-w-[var(--content-max-text)] text-[length:var(--body)] leading-[var(--body-lh)] font-normal tracking-[var(--letter-spacing-snug)] text-[var(--section-text-secondary)] md:mb-[var(--section-gap)] md:text-[length:var(--body-large)] md:leading-[var(--body-large-lh)]">
          {ui.focus.subheading}
        </p>

        {/* role="list" intencional: Safari descarta la semántica de lista con list-style:none. */}
        {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
        <ul
          className="mb-[var(--content-gap)] grid list-none grid-cols-1 gap-[var(--element-gap)] sm:grid-cols-2 md:mb-[var(--section-gap)] md:grid-cols-3 md:gap-[var(--content-gap)]"
          role="list"
        >
          {signals.map((signal) => (
            <li key={signal.id} className={cardClass}>
              <div
                className="flex h-[var(--icon-lg)] w-[var(--icon-lg)] shrink-0 items-center justify-center text-[var(--accent-emphasis)]"
                aria-hidden="true"
              >
                {SIGNAL_ICONS[signal.id]}
              </div>
              <h3 className="text-[length:var(--heading-3)] leading-[var(--heading-3-lh)] font-semibold tracking-[var(--heading-3-tracking)] text-[var(--section-text)]">
                {signal.title}
              </h3>
              <p className="grow text-[length:var(--body)] leading-[var(--body-lh)] font-normal text-[var(--section-text-secondary)]">
                {signal.description}
              </p>
              <Badge variant="emphasis" className="self-start">
                {signal.meta}
              </Badge>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
