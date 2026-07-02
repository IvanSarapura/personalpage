"use client";

import { useEffect } from "react";

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
      <body>
        <div role="alert" style={{ padding: "2rem", textAlign: "center" }}>
          <h2>Something went wrong</h2>
          <button onClick={reset} style={{ marginTop: "1rem" }}>
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
