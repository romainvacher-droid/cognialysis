import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { IA_PROFILES } from "@/lib/psychology";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const iaId    = searchParams.get("ia") || "claude";
  const score   = searchParams.get("score") || "0";
  const source  = searchParams.get("source") || "";
  const mode    = searchParams.get("mode") || "sign";

  const ia = IA_PROFILES.find(p => p.id === iaId) ?? IA_PROFILES[1];
  const pct = Math.round(parseFloat(score) * 100);

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          background: "linear-gradient(135deg, #0f0f1a 0%, #1a0a2e 50%, #0f0f1a 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          color: "white",
          position: "relative",
        }}
      >
        {/* BG glow */}
        <div style={{
          position: "absolute", width: "400px", height: "400px",
          borderRadius: "50%", background: ia.color, opacity: 0.12,
          filter: "blur(80px)", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
        }} />

        {/* Header */}
        <div style={{ fontSize: 18, color: "#9ca3af", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 24, display: "flex" }}>
          CognIAlysis · Analyse psychologique IA
        </div>

        {/* IA emoji + name */}
        <div style={{ fontSize: 80, marginBottom: 8, display: "flex" }}>{ia.emoji}</div>
        <div style={{ fontSize: 52, fontWeight: 700, marginBottom: 8, display: "flex" }}>{ia.name}</div>
        <div style={{ fontSize: 20, color: "#9ca3af", marginBottom: 32, display: "flex" }}>{ia.provider} · MBTI {ia.mbti}</div>

        {/* Score badge */}
        <div style={{
          background: ia.color, borderRadius: "999px",
          padding: "12px 40px", fontSize: 36, fontWeight: 700,
          marginBottom: 24, display: "flex",
        }}>
          {pct}% de compatibilité
        </div>

        {/* Source */}
        <div style={{ fontSize: 18, color: "#6b7280", display: "flex" }}>
          {mode === "test" ? "Test projectif" : `Signe : ${source}`}
        </div>

        {/* Footer */}
        <div style={{
          position: "absolute", bottom: 28,
          fontSize: 16, color: "#4b5563", display: "flex",
        }}>
          cognialysis.vercel.app
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
