import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import type { Lang } from "@/lib/i18n";
import { t } from "@/lib/i18n";

export function Orb({ className, color }: { className: string; color: string }) {
  return (
    <div className={`absolute rounded-full pointer-events-none opacity-15 ${className}`}
      style={{ background: color, filter: "blur(70px)" }} />
  );
}

export function BackBar({ step, onBack, progress, total, lang }: {
  step: number; onBack: () => void; progress: number; total: number; lang: Lang;
}) {
  return (
    <div className="px-6 pt-6 pb-2 flex items-center gap-3 relative z-20">
      <button type="button" onClick={onBack}
        className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 glass-surface">
        <ChevronLeft className="w-4 h-4 text-foreground" />
      </button>
      <div className="flex-1 h-1 rounded-full" style={{ background: "rgba(255,255,255,0.07)" }}>
        <motion.div className="h-full rounded-full bg-primary"
          style={{ boxShadow: "0 0 8px rgba(234,179,8,0.5)" }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }} />
      </div>
      <span className="text-xs font-semibold flex-shrink-0 text-primary">{step}/{total}</span>
    </div>
  );
}

export function NextBtn({ onClick, label, disabled = false }: {
  onClick?: () => void; label: string; disabled?: boolean;
}) {
  return (
    <button type={onClick ? "button" : "submit"} onClick={onClick} disabled={disabled}
      className="w-full h-14 flex items-center justify-center gap-2.5 rounded-2xl text-base font-extrabold btn-gold disabled:opacity-60 transition-all">
      {disabled && <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />}
      {label}
    </button>
  );
}

export function GlassCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl p-4 glass-surface ${className}`}>
      {children}
    </div>
  );
}

export function FieldLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-base font-bold text-foreground mb-3 leading-snug">{children}</p>;
}

export function Sub({ children }: { children: React.ReactNode }) {
  return <p className="text-sm mb-6 text-muted-foreground">{children}</p>;
}

export function StepTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-7">
      <p className="text-xs font-bold uppercase tracking-widest mb-2.5 text-primary">{eyebrow}</p>
      <h2 className="text-3xl font-black text-foreground leading-tight whitespace-pre-line">{title}</h2>
    </div>
  );
}

export function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" onClick={() => onChange(!value)}
      className="w-14 h-7 rounded-full relative flex-shrink-0 transition-all duration-300"
      style={{ background: value ? "oklch(0.80 0.16 85)" : "rgba(255,255,255,0.12)" }}>
      <motion.div className="w-5 h-5 rounded-full bg-foreground absolute top-1"
        animate={{ left: value ? "calc(100% - 24px)" : "4px" }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }} />
    </button>
  );
}

export function PillGroup({ options, value, onChange, cols = 2 }: {
  options: { id: string; label: string; sub?: string }[];
  value: string | undefined;
  onChange: (v: string) => void;
  cols?: 2 | 3;
}) {
  return (
    <div className={`grid gap-2.5 ${cols === 2 ? "grid-cols-2" : "grid-cols-3"}`}>
      {options.map(o => {
        const active = value === o.id;
        return (
          <button key={o.id} type="button" onClick={() => onChange(o.id)}
            className="rounded-2xl p-3.5 text-left transition-all"
            style={{
              background: active ? "rgba(234,179,8,0.14)" : "rgba(255,255,255,0.03)",
              border: `1px solid ${active ? "oklch(0.80 0.16 85)" : "rgba(255,255,255,0.08)"}`,
              boxShadow: active ? "0 4px 16px rgba(234,179,8,0.18)" : "none",
            }}>
            <span className="block text-sm font-bold" style={{ color: active ? "oklch(0.88 0.12 85)" : "oklch(0.80 0.02 85)" }}>{o.label}</span>
            {o.sub && <span className="block text-xs mt-0.5 text-muted-foreground">{o.sub}</span>}
          </button>
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
      className="w-full rounded-2xl px-5 h-14 text-base transition-all outline-none glass-surface text-foreground placeholder:text-muted-foreground focus:border-primary focus:shadow-[0_0_0_3px_rgba(234,179,8,0.12)]" />
  );
}

export function BudgetSlider({ min, max, onChange }: {
  min: number; max: number; onChange: (mn: number, mx: number) => void;
}) {
  const totalMin = 5000, totalMax = 50000, range = totalMax - totalMin;
  return (
    <div className="space-y-5">
      <div className="flex justify-between items-end">
        <span className="text-sm text-muted-foreground">Monthly budget</span>
        <span className="text-xl font-black gold-gradient-text">
          ₹{min.toLocaleString()} – ₹{max.toLocaleString()}
        </span>
      </div>
      <div className="space-y-4">
        <div>
          <label className="text-xs text-muted-foreground">Min: ₹{min.toLocaleString()}</label>
          <input type="range" min={totalMin} max={totalMax} step={500} value={min}
            onChange={e => { const v = Number(e.target.value); if (v < max) onChange(v, max); }}
            className="w-full accent-primary" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground">Max: ₹{max.toLocaleString()}</label>
          <input type="range" min={totalMin} max={totalMax} step={500} value={max}
            onChange={e => { const v = Number(e.target.value); if (v > min) onChange(min, v); }}
            className="w-full accent-primary" />
        </div>
      </div>
    </div>
  );
}

export function Confetti() {
  const pieces = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    color: ["#EAB308","#8B5CF6","#F97316","#10B981","#3B82F6","#EC4899"][i % 6],
    left: `${(i / 30) * 100}%`,
    delay: i * 0.06,
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

export const trans = { duration: 0.3, ease: [0.4, 0, 0.2, 1] as number[] };
