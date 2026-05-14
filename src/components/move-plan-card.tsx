import { useRef, useState } from "react";
import html2canvas from "html2canvas-pro";
import { Download, Share2, Sparkles } from "lucide-react";

const ZONE_LABEL: Record<string, string> = {
  east: "Whitefield belt",
  orr: "Bellandur · ORR",
  north: "Manyata belt",
  central: "Koramangala · Central",
  south: "Electronic City",
};
const TIER_LABEL: Record<string, string> = {
  basic: "BASIC",
  classic: "CLASSIC",
  prive: "PRIVE",
  luxemax: "LUXE MAX",
};

export function MovePlanCard({
  name, zone, tier, moveIn, vibes,
}: { name?: string; zone?: string; tier?: string; moveIn?: string; vibes?: string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);

  const make = async () => {
    if (!ref.current) return null;
    const canvas = await html2canvas(ref.current, { backgroundColor: null, scale: 2 });
    return new Promise<Blob | null>(res => canvas.toBlob(res, "image/png"));
  };

  const onShare = async () => {
    setBusy(true);
    try {
      const blob = await make();
      if (!blob) return;
      const file = new File([blob], "gharpayy-move-plan.png", { type: "image/png" });
      const text = `My Bangalore move plan — locked in with @Gharpayy 🏠`;
      // @ts-expect-error - canShare optional
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], text, title: "My Bangalore move plan" });
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a"); a.href = url; a.download = "gharpayy-move-plan.png"; a.click();
        URL.revokeObjectURL(url);
      }
    } finally { setBusy(false); }
  };

  const onDownload = async () => {
    setBusy(true);
    try {
      const blob = await make();
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.download = "gharpayy-move-plan.png"; a.click();
      URL.revokeObjectURL(url);
    } finally { setBusy(false); }
  };

  return (
    <div className="rounded-2xl bg-white border border-black/5 shadow-sm p-3.5">
      <div className="flex items-center gap-2 mb-2.5">
        <Sparkles className="w-3.5 h-3.5 text-[#FFC72C]" />
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#1F47BA]">Your move plan</span>
      </div>

      {/* The actual card we'll snapshot */}
      <div className="rounded-xl overflow-hidden">
        <div ref={ref} style={{ width: 360, padding: 24, background: "linear-gradient(135deg, #075E54 0%, #128C7E 50%, #25D366 100%)", color: "#fff", fontFamily: "Inter, sans-serif" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 12, background: "linear-gradient(135deg, #fff, #FFF6D9)", color: "#075E54", fontWeight: 900, fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Playfair Display, serif" }}>G</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 0.5 }}>GHARPAYY</div>
                <div style={{ fontSize: 9, opacity: 0.8, letterSpacing: 1 }}>EXPERT MATCHED</div>
              </div>
            </div>
            <span style={{ fontSize: 9, padding: "4px 8px", borderRadius: 999, background: "rgba(255,255,255,0.18)", fontWeight: 700, letterSpacing: 1 }}>PRIVATE</span>
          </div>

          <div style={{ fontSize: 12, opacity: 0.85, marginBottom: 4 }}>Bangalore move plan for</div>
          <div style={{ fontSize: 32, fontWeight: 800, fontFamily: "Playfair Display, serif", lineHeight: 1.05, marginBottom: 22 }}>{name || "you"} 🏠</div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 18 }}>
            <Cell label="Zone" value={zone ? ZONE_LABEL[zone] || zone : "Central"} />
            <Cell label="Tier" value={tier ? TIER_LABEL[tier] || tier : "CLASSIC"} />
            <Cell label="Move-in" value={moveIn || "Soon"} />
            <Cell label="Status" value="In Aayushi's queue" highlight />
          </div>

          {vibes && vibes.length > 0 && (
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 10, opacity: 0.75, marginBottom: 6, letterSpacing: 1, fontWeight: 700 }}>VIBE</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {vibes.slice(0, 4).map(v => (
                  <span key={v} style={{ fontSize: 10, padding: "4px 10px", borderRadius: 999, background: "rgba(255,255,255,0.16)", fontWeight: 600 }}>{v}</span>
                ))}
              </div>
            </div>
          )}

          <div style={{ borderTop: "1px solid rgba(255,255,255,0.18)", paddingTop: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ fontSize: 10, opacity: 0.85 }}>Matched by Aayushi</div>
            <div style={{ fontSize: 10, opacity: 0.85, fontWeight: 700 }}>gharpayy.com</div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mt-3">
        <button type="button" onClick={onShare} disabled={busy}
          className="flex-1 py-2.5 rounded-full text-[13px] font-bold btn-gold flex items-center justify-center gap-2 disabled:opacity-60">
          <Share2 className="w-3.5 h-3.5" /> Share on WhatsApp
        </button>
        <button type="button" onClick={onDownload} disabled={busy}
          className="px-4 py-2.5 rounded-full text-[13px] font-semibold text-[#128C7E] bg-[#25D366]/10 hover:bg-[#25D366]/15 border border-[#25D366]/30 flex items-center justify-center gap-1.5">
          <Download className="w-3.5 h-3.5" /> Save
        </button>
      </div>
      <p className="text-[10.5px] text-[#667781] text-center mt-2 italic">Send to your flatmates or parents — beautiful proof you're sorted.</p>
    </div>
  );
}

function Cell({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div style={{ background: highlight ? "rgba(255,199,44,0.22)" : "rgba(255,255,255,0.10)", borderRadius: 10, padding: "10px 12px", border: highlight ? "1px solid rgba(255,199,44,0.5)" : "1px solid rgba(255,255,255,0.12)" }}>
      <div style={{ fontSize: 9, opacity: 0.85, letterSpacing: 1, fontWeight: 700, marginBottom: 3 }}>{label.toUpperCase()}</div>
      <div style={{ fontSize: 13, fontWeight: 700 }}>{value}</div>
    </div>
  );
}
