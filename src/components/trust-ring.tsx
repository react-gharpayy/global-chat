import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

const STAGES = [
  "Verifying your details…",
  "Matching with Aayushi's shortlist…",
  "Locking your slot in the queue…",
  "Done.",
];

export function TrustRing({ onDone }: { onDone: () => void }) {
  const [stage, setStage] = useState(0);
  useEffect(() => {
    const ids: ReturnType<typeof setTimeout>[] = [];
    ids.push(setTimeout(() => setStage(1), 800));
    ids.push(setTimeout(() => setStage(2), 1600));
    ids.push(setTimeout(() => setStage(3), 2400));
    ids.push(setTimeout(onDone, 2900));
    return () => ids.forEach(clearTimeout);
  }, [onDone]);

  const done = stage === 3;
  return (
    <div className="flex flex-col items-center justify-center py-8 gap-4 bubble-in p-6 self-center max-w-[88%]">
      <div className="relative w-20 h-20">
        <svg viewBox="0 0 100 100" className="w-20 h-20 -rotate-90">
          <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(37,211,102,0.15)" strokeWidth="6" />
          <motion.circle cx="50" cy="50" r="42" fill="none" stroke="#25D366" strokeWidth="6" strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 42}
            initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
            animate={{ strokeDashoffset: done ? 0 : 2 * Math.PI * 42 * (1 - (stage + 1) / 3.2) }}
            transition={{ duration: 0.7, ease: "easeOut" }} />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          {done
            ? <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 350, damping: 18 }}
                className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center shadow-lg">
                <Check className="w-6 h-6 text-white" strokeWidth={3.5} />
              </motion.div>
            : <span className="text-lg font-bold gold-gradient-text">{Math.round(((stage + 1) / 3.2) * 100)}%</span>}
        </div>
      </div>
      <motion.p key={stage} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
        className="text-[13px] font-semibold text-[#111B21] text-center">
        {STAGES[stage]}
      </motion.p>
    </div>
  );
}
