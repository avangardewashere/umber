import { ImageResponse } from "next/og";

// The picture shown when a link to the site is pasted into Messenger, X, Slack or Discord.
// Generated once at build time. Colours are the light-theme tokens, written out because
// the image renderer cannot read CSS variables.
export const alt = "Umber: five accessible React components. Copy, paste, ship.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const NAMES = ["Button", "Badge", "Input", "Card", "Dialog"];

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#faf7f2",
          color: "#1c1917",
          padding: "72px 80px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: "#7c3f0e" }} />
          <div style={{ fontSize: 28, color: "#6b6259" }}>umber</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 150, fontWeight: 700, letterSpacing: -6, lineHeight: 1 }}>
            Umber
          </div>
          <div style={{ fontSize: 50, marginTop: 28 }}>Five accessible React components.</div>
          <div style={{ fontSize: 50, color: "#6b6259" }}>Copy, paste, ship.</div>
        </div>
        <div style={{ display: "flex", gap: 14 }}>
          {NAMES.map((name) => (
            <div
              key={name}
              style={{
                display: "flex",
                padding: "10px 24px",
                border: "2px solid #ddd5c9",
                borderRadius: 999,
                fontSize: 26,
                background: "#ffffff",
              }}
            >
              {name}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
