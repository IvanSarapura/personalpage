interface SocialIconProps {
  className?: string;
}

/** Ícono de LinkedIn. Usa currentColor para adaptarse al tema. */
export function LinkedInIcon({ className }: SocialIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path
        d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM4 6a2 2 0 100-4 2 2 0 000 4z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

/** Ícono de X (Twitter). Usa currentColor para adaptarse al tema. */
export function XIcon({ className }: SocialIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path
        d="M4 4l6.5 8.7L4 20h2.5l5.7-7.6L17 20h3L13.2 10.8 19 4h-2.5L11.3 11 6 4H4z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
