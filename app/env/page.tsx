export default function EnvDebugPage() {
  const keys = [
    "NEXT_PUBLIC_FIREBASE_API_KEY",
    "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
    "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
    "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
    "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
    "NEXT_PUBLIC_FIREBASE_APP_ID",
  ] as const;

  const rows = keys.map((k) => {
    const raw = process.env[k];
    const present = typeof raw === "string" && raw.trim().length > 0;
    const masked = present ? raw!.slice(0, 4) + "•••" + raw!.slice(-4) : "(missing)";
    return { key: k, present, masked };
  });

  return (
    <div style={{ padding: 24, maxWidth: 720 }}>
      <h1>Env Debug</h1>
      <p>Shows which Firebase env vars are detected at build/runtime. Values are masked.</p>
      <table style={{ width: "100%", marginTop: 16, borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid #333" }}>Key</th>
            <th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid #333" }}>Present</th>
            <th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid #333" }}>Value</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.key}>
              <td style={{ padding: 8, borderBottom: "1px solid #222" }}>{r.key}</td>
              <td style={{ padding: 8, borderBottom: "1px solid #222" }}>{r.present ? "yes" : "no"}</td>
              <td style={{ padding: 8, borderBottom: "1px solid #222", fontFamily: "monospace" }}>{r.masked}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p style={{ marginTop: 16, color: "#999" }}>
        If any are missing, update <code>.env.local</code> in the <code>eventlink</code> folder and restart the dev server.
      </p>
    </div>
  );
}
