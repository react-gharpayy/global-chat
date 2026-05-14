import { motion } from "framer-motion";
import { ChevronLeft, Lightbulb } from "lucide-react";
import type { Lang } from "@/lib/i18n";

export function ChatHeader({ onBack, subtitle }: { onBack?: () => void; subtitle?: string }) {
  return (
    <div className="wa-header px-3 py-2.5 flex items-center gap-3 sticky top-0 z-30 shadow-md">
      {onBack ? (
        <button type="button" onClick={onBack} className="w-8 h-8 flex items-center justify-center -ml-1 rounded-full hover:bg-white/10">
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
      ) : <div className="w-2" />}
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FFD451] to-[#E5A800] flex items-center justify-center text-[#0A1A3D] font-black text-sm shadow ring-2 ring-white/10">G</div>
      <div className="flex-1 min-w-0">
        <p className="text-[15px] font-semibold text-white leading-tight truncate">Gharpayy</p>
        <p className="text-[11px] text-emerald-200 leading-tight truncate flex items-center gap-1">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          {subtitle ?? "online · typing…"}
        </p>
      </div>
      <div className="flex items-center gap-3 text-white/85">
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M15.5 5h-.79l-.28-.27A6.47 6.47 0 0 0 9.5 3 6.5 6.5 0 1 0 16 9.5c0-1.61-.59-3.09-1.55-4.23l.27-.27v-.79l5 4.99L20 11l-4.5-4.5z"/></svg>
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/></svg>
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
      </div>
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
