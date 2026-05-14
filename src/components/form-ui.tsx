import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Lightbulb, Zap, Lock, Copy, Check } from "lucide-react";
import { HeaderTicker } from "@/components/header-ticker";
import type { Lang } from "@/lib/i18n";

export function ChatHeader({
  onBack,
  subtitle,
  waNumber,
  waDisplay,
}: {
  onBack?: () => void;
  subtitle?: string;
  waNumber?: string;
  waDisplay?: string;
}) {
  const [menu, setMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    if (!waNumber) return;
    try { await navigator.clipboard.writeText("+" + waNumber); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch {}
  };
  return (
    <div className="wa-header px-3 py-2.5 flex items-center gap-3 sticky top-0 z-30 shadow-md relative">
      {onBack ? (
        <button type="button" onClick={onBack} className="w-8 h-8 flex items-center justify-center -ml-1 rounded-full hover:bg-white/10">
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
      ) : <div className="w-2" />}
      <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-white to-emerald-50 flex items-center justify-center shadow ring-1 ring-white/30 relative overflow-hidden">
        <span className="text-[#075E54] font-black text-[15px] tracking-tight" style={{ fontFamily: "var(--font-display)" }}>G</span>
        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#25D366] ring-2 ring-[#075E54]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[15px] font-semibold text-white leading-tight truncate flex items-center gap-1.5">
          Gharpayy expert
          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-white/15 text-[9px] font-bold tracking-wider">
            <Lock className="w-2.5 h-2.5" /> PRIVATE
          </span>
        </p>
        <p className="text-[11px] text-emerald-200 leading-tight truncate flex items-center gap-1">
          <Zap className="w-3 h-3 text-yellow-300 fill-yellow-300" />
          {subtitle ?? "Online now · usually replies in minutes"}
        </p>
      </div>
      <button
        type="button"
        onClick={() => setMenu(m => !m)}
        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 text-white/90"
        aria-label="Menu"
      >
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
      </button>
      {menu && (
        <>
          <button type="button" onClick={() => setMenu(false)} className="fixed inset-0 z-40 cursor-default" aria-hidden />
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.15 }}
            className="absolute right-2 top-[58px] z-50 w-[260px] rounded-xl bg-white shadow-xl border border-black/5 overflow-hidden"
          >
            <div className="px-3.5 py-3 border-b border-black/5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#667781]">Direct WhatsApp</p>
              <p className="text-[15px] font-bold text-[#111B21] mt-0.5">{waDisplay ?? "—"}</p>
              <p className="text-[11px] text-[#667781] mt-0.5">Aayushi · Gharpayy team</p>
            </div>
            <button type="button" onClick={copy} className="w-full px-3.5 py-2.5 flex items-center gap-2 text-[13px] font-medium text-[#111B21] hover:bg-black/5">
              {copied ? <Check className="w-4 h-4 text-[#25D366]" /> : <Copy className="w-4 h-4 text-[#667781]" />}
              {copied ? "Copied" : "Copy number"}
            </button>
            <a
              href={waNumber ? `https://wa.me/${waNumber}` : "#"}
              target="_blank" rel="noopener noreferrer"
              className="w-full px-3.5 py-2.5 flex items-center gap-2 text-[13px] font-semibold text-[#128C7E] hover:bg-black/5 border-t border-black/5"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.413c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24z"/></svg>
              Open chat directly
            </a>
            <div className="px-3.5 py-2.5 border-t border-black/5 bg-[#FAFAF7] flex items-start gap-2">
              <Lock className="w-3 h-3 text-[#25D366] mt-0.5 flex-shrink-0" />
              <p className="text-[10.5px] text-[#667781] leading-snug">
                Your details only ever go to our internal team. Never to brokers, never sold.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}

export function BackBar({ step, onBack, progress, total }: {
  step: number; onBack: () => void; progress: number; total: number; lang: Lang;
}) {
  return (
    <>
      <ChatHeader onBack={onBack} subtitle={`Step ${step} of ${total} · 30s left`} />
      <div className="h-1 bg-black/5 relative">
        <motion.div className="h-full bg-gradient-to-r from-[#25D366] to-[#128C7E]"
          initial={{ width: 0 }} animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }} />
      </div>
    </>
  );
}

export function NextBtn({ onClick, label, disabled = false }: {
  onClick?: () => void; label: string; disabled?: boolean;
}) {
  return (
    <button type={onClick ? "button" : "submit"} onClick={onClick} disabled={disabled}
      className="w-full h-13 py-3.5 flex items-center justify-center gap-2 rounded-full text-[15px] font-bold btn-gold disabled:opacity-60">
      {disabled && <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />}
      {label}
    </button>
  );
}

export function GlassCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-xl p-3.5 bubble-in ${className}`}>{children}</div>;
}

export function FieldLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-sm font-semibold text-[#111B21] mb-2.5">{children}</p>;
}

export function Sub({ children }: { children: React.ReactNode }) {
  return <p className="text-[13px] mb-4 text-[#667781]">{children}</p>;
}

export function StepTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="bubble-in inline-block max-w-[88%] px-3.5 py-2.5 mb-4 ml-1 bubble-pop">
      {eyebrow && <p className="text-[10px] font-bold uppercase tracking-wider mb-1 text-[#1F47BA]">{eyebrow}</p>}
      <p className="text-[15px] font-semibold text-[#111B21] leading-snug whitespace-pre-line">{title}</p>
      <p className="text-[10px] text-[#667781] text-right mt-0.5">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
    </div>
  );
}

/* BLR Insight chat bubble — adds value between steps */
export function InsightBubble({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, type: "spring", stiffness: 280, damping: 22 }}
      className="bubble-insight inline-block max-w-[92%] px-3 py-2 mb-3 ml-1">
      <div className="flex items-start gap-2">
        <Lightbulb className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
        <div className="text-[12px] leading-snug font-medium">{children}</div>
      </div>
    </motion.div>
  );
}

export function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" onClick={() => onChange(!value)}
      className="w-12 h-6 rounded-full relative flex-shrink-0 transition-all duration-300"
      style={{ background: value ? "#25D366" : "rgba(0,0,0,0.18)" }}>
      <motion.div className="w-4 h-4 rounded-full bg-white absolute top-1 shadow"
        animate={{ left: value ? "calc(100% - 20px)" : "4px" }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }} />
    </button>
  );
}

export function PillGroup({ options, value, onChange, cols = 2 }: {
  options: { id: string; label: string; sub?: string; icon?: React.ReactNode }[];
  value: string | undefined;
  onChange: (v: string) => void;
  cols?: 2 | 3;
}) {
  return (
    <div className={`grid gap-2.5 ${cols === 2 ? "grid-cols-2" : "grid-cols-3"}`}>
      {options.map(o => {
        const active = value === o.id;
        return (
          <motion.button
            key={o.id}
            type="button"
            onClick={() => onChange(o.id)}
            whileTap={{ scale: 0.96 }}
            className="rounded-2xl px-3 py-3 text-left transition-all relative overflow-hidden"
            style={{
              background: active
                ? "linear-gradient(135deg, #DCF8C6, #B7E8A1)"
                : "#FFFFFF",
              border: `1.5px solid ${active ? "#25D366" : "rgba(15,23,42,0.08)"}`,
              boxShadow: active
                ? "0 4px 14px rgba(37,211,102,0.25), 0 0 0 3px rgba(37,211,102,0.12)"
                : "0 1px 0.5px rgba(11,20,26,0.08)",
            }}>
            {o.icon && <div className="mb-1">{o.icon}</div>}
            <span className="block text-[13px] font-semibold text-[#111B21]">{o.label}</span>
            {o.sub && <span className="block text-[11px] mt-0.5 text-[#667781]">{o.sub}</span>}
          </motion.button>
        );
      })}
    </div>
  );
}

export function TextInput({ value, onChange, placeholder, type = "text" }: {
  value: string | undefined; onChange: (v: string) => void; placeholder: string; type?: string;
}) {
  return (
    <input type={type} value={value ?? ""} onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-full px-5 h-12 text-[14px] outline-none bg-white border border-black/10 text-[#111B21] placeholder:text-[#8696a0] focus:border-[#25D366] focus:shadow-[0_0_0_3px_rgba(37,211,102,0.15)] transition-all" />
  );
}

export function BudgetSlider({ min, max, onChange }: {
  min: number; max: number; onChange: (mn: number, mx: number) => void;
}) {
  const totalMin = 5000, totalMax = 50000;
  return (
    <div className="space-y-4 bubble-in p-4">
      <div className="flex justify-between items-end">
        <span className="text-xs text-[#667781]">Monthly budget</span>
        <span className="text-base font-bold gold-gradient-text">
          ₹{min.toLocaleString()} – ₹{max.toLocaleString()}
        </span>
      </div>
      <div className="space-y-3">
        <div>
          <label className="text-[11px] text-[#667781]">Min: ₹{min.toLocaleString()}</label>
          <input type="range" min={totalMin} max={totalMax} step={500} value={min}
            onChange={e => { const v = Number(e.target.value); if (v < max) onChange(v, max); }}
            className="w-full accent-[#25D366]" />
        </div>
        <div>
          <label className="text-[11px] text-[#667781]">Max: ₹{max.toLocaleString()}</label>
          <input type="range" min={totalMin} max={totalMax} step={500} value={max}
            onChange={e => { const v = Number(e.target.value); if (v > min) onChange(min, v); }}
            className="w-full accent-[#25D366]" />
        </div>
      </div>
    </div>
  );
}

export function Confetti() {
  const pieces = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    color: ["#25D366","#128C7E","#1F47BA","#FFC72C","#DCF8C6","#FFD451"][i % 6],
    left: `${(i / 40) * 100}%`,
    delay: i * 0.05,
    duration: 2.4 + (i % 5) * 0.3,
    size: 6 + (i % 6),
  }));
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {pieces.map(p => (
        <motion.div key={p.id}
          initial={{ y: -24, rotate: 0, opacity: 1 }}
          animate={{ y: "115vh", rotate: 900, opacity: 0 }}
          transition={{ duration: p.duration, delay: p.delay, ease: "easeIn" }}
          style={{ position: "absolute", top: 0, left: p.left, width: p.size, height: p.size,
            backgroundColor: p.color, borderRadius: p.id % 3 === 0 ? "50%" : "3px" }} />
      ))}
    </div>
  );
}

export const anim = {
  enter: { x: "100%", opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: { x: "-100%", opacity: 0 },
};

export const trans = { duration: 0.3, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] };
