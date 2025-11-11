"use client";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html>
      <body>
        <div style={{ padding: 24 }}>
          <h1>Application Error</h1>
          <p>This error boundary catches errors anywhere in the app directory.</p>
          <pre style={{ whiteSpace: "pre-wrap", background: "#111", color: "#eee", padding: 12, borderRadius: 8 }}>
            {error?.message || String(error)}
          </pre>
          <button onClick={() => reset()} style={{ marginTop: 16, padding: "8px 12px" }}>
            Reload page
          </button>
        </div>
      </body>
    </html>
  );
}
