"use client";

import { useEffect } from "react";

/** Fallback raíz de Next.js: reemplaza el layout completo, así que es
 *  deliberadamente autónomo y no depende de globals.css ni de providers. */
const LIGHT = {
  bg: "#ebecff",
  text: "#0051e9",
  buttonText: "#ffffff",
};

const DARK = {
  bg: "#19192d",
  text: "#ebecff",
  buttonText: "#121226",
};

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <head>
        <title>Something went wrong</title>
        <style>{`
          :root { color-scheme: light; }
          .global-error-body {
            --error-bg: ${LIGHT.bg};
            --error-text: ${LIGHT.text};
            --error-button-text: ${LIGHT.buttonText};
          }
          .global-error-button {
            min-height: 2.75rem;
            border: 0.09375rem solid var(--error-text);
            border-radius: 9999px;
            padding: 0.5rem 1.25rem;
            background: transparent;
            color: var(--error-text);
            font: inherit;
            font-size: 0.8125rem;
            line-height: 1.38;
            letter-spacing: 0.02em;
            cursor: pointer;
            touch-action: manipulation;
            transition: background-color 200ms, color 200ms;
          }
          .global-error-button:focus-visible {
            outline: 0.125rem solid var(--error-text);
            outline-offset: 0.125rem;
          }
          @media (hover: hover) and (pointer: fine) {
            .global-error-button:hover {
              background: var(--error-text);
              color: var(--error-button-text);
            }
          }
          @media (prefers-color-scheme: dark) {
            :root { color-scheme: dark; }
            .global-error-body {
              --error-bg: ${DARK.bg};
              --error-text: ${DARK.text};
              --error-button-text: ${DARK.buttonText};
            }
          }
          @media (prefers-reduced-motion: reduce) {
            .global-error-body, .global-error-button { transition: none !important; }
          }
          @media (forced-colors: active) {
            .global-error-button:focus-visible { outline-color: Highlight; }
          }
        `}</style>
      </head>
      <body
        className="global-error-body"
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "3rem 1.5rem",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          background: "var(--error-bg)",
          color: "var(--error-text)",
          WebkitFontSmoothing: "antialiased",
          transition: "background-color 300ms, color 300ms",
        }}
      >
        <main style={{ width: "100%", maxWidth: "38.75rem", textAlign: "center" }}>
          <h1
            style={{
              margin: "0 0 1rem",
              fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
              lineHeight: 1,
              fontWeight: 400,
              letterSpacing: "-0.03em",
              textWrap: "balance",
            }}
          >
            Something went wrong
          </h1>
          <p
            role="alert"
            style={{
              margin: "0 0 2rem",
              fontSize: "1.25rem",
              lineHeight: 1.5,
              textWrap: "pretty",
            }}
          >
            An unexpected error occurred. Try again, and if the problem persists, get in touch.
          </p>
          <button className="global-error-button" type="button" onClick={unstable_retry}>
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
