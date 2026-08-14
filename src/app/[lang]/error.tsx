"use client";

import { useEffect } from "react";

export default function Error({
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
    <div role="alert" style={{ padding: "var(--space-7)", textAlign: "center" }}>
      <h2>Something went wrong</h2>
      <button onClick={reset} style={{ marginTop: "var(--space-4)" }}>
        Try again
      </button>
    </div>
  );
}
