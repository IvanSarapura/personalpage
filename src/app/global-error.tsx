"use client";

import { useEffect } from "react";

/** Fallback raíz de Next.js: reemplaza el layout completo, así que no puede
 *  depender de globals.css ni del script anti-flash (viven en el layout).
 *  Usa valores literales del design system y respeta prefers-color-scheme. */
const LIGHT = {
  bg: "#ebecff",
  text: "#0051e9",
  textInverted: "#ffffff",
};

const DARK = {
  bg: "#19192d",
  text: "#ebecff",
  textInverted: "#121226",
};

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // Registrar el error para diagnóstico; no se traga en silencio.
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <head>
        <style>{`
          :root { color-scheme: light; }
          @media (prefers-color-scheme: dark) {
            :root { color-scheme: dark; }
          }
        `}</style>
      </head>
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "48px 24px",
          fontFamily:
            "var(--font-inter), -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          background: LIGHT.bg,
          color: LIGHT.text,
          WebkitFontSmoothing: "antialiased",
          transition: "background-color 300ms, color 300ms",
        }}
      >
        <style>{`
          @media (prefers-color-scheme: dark) {
            body {
              background: ${DARK.bg};
              color: ${DARK.text};
            }
          }
        `}</style>
        <main role="alert" style={{ maxWidth: "620px", textAlign: "left" }}>
          <h1
            style={{
              margin: "0 0 16px",
              fontSize: "clamp(40px, 5vw, 56px)",
              lineHeight: 1,
              fontWeight: 400,
              letterSpacing: "-0.03em",
              textWrap: "balance",
            }}
          >
            Something went wrong
          </h1>
          <p
            style={{
              margin: "0 0 32px",
              fontSize: "20px",
              lineHeight: 1.5,
              opacity: 0.85,
              textWrap: "pretty",
            }}
          >
            An unexpected error occurred. Try again, and if the problem persists, get in touch.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              border: `1.5px solid ${LIGHT.text}`,
              borderRadius: "100px",
              padding: "8px 20px",
              background: "transparent",
              color: "inherit",
              fontFamily: "inherit",
              fontSize: "13px",
              lineHeight: 1.38,
              letterSpacing: "0.02em",
              cursor: "pointer",
              touchAction: "manipulation",
              transition: "background-color 200ms, color 200ms",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = LIGHT.text;
              e.currentTarget.style.color = LIGHT.textInverted;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "";
            }}
          >
            Try again
          </button>
          <style>{`
            @media (prefers-color-scheme: dark) {
              button {
                border-color: ${DARK.text};
              }
              button:hover {
                background: ${DARK.text};
                color: ${DARK.textInverted};
              }
            }
            @media (hover: hover) and (pointer: fine) {
              button:hover {
                background: ${LIGHT.text};
                color: ${LIGHT.textInverted};
              }
            }
            @media (prefers-reduced-motion: reduce) {
              body, button { transition: none; }
            }
          `}</style>
        </main>
      </body>
    </html>
  );
}
