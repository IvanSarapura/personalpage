interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <svg
      viewBox="0 0 615 425"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 0H252V425H0V0ZM224.124 28.258H140.124V396.742H224.124V28.258Z"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M447.375 0H307.625L140 212.5L307.625 425H447.375L615 212.5L447.375 0ZM447.375 382.425L413.757 339.849L463.71 276.393L514.049 212.447L497.739 191.675L447.375 255.644L397.394 319.127L363.748 276.516L347.023 255.334L313.2 212.5L363.376 148.955L413.924 84.9388L447.375 42.5754L480.993 85.1507L447.5 127.697L397.073 191.754L413.75 212.936L464.13 148.876L497.653 106.25L531.373 148.955L547.727 169.666L581.549 212.5L547.727 255.334L497.356 319.127L447.375 382.425Z"
      />
    </svg>
  );
}
