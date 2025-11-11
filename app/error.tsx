"use client";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html>
      <body>
        <div style={{ padding: 24 }}>
          <h1>Something went wrong</h1>
          <pre style={{ whiteSpace: "pre-wrap", background: "#111", color: "#eee", padding: 12, borderRadius: 8 }}>
            {error?.message || String(error)}
          </pre>
          {error?.stack ? (
            <details style={{ marginTop: 12 }}>
              <summary>Stack trace</summary>
              <pre style={{ whiteSpace: "pre-wrap" }}>{error.stack}</pre>
            </details>
          ) : null}
          <button onClick={() => reset()} style={{ marginTop: 16, padding: "8px 12px" }}>
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
