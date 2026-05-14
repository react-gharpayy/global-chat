import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Zap } from "lucide-react";
import { lastReplyTicker, matchedToday, visitsBookedToday } from "@/lib/proof-seed";

export function HeaderTicker({ zone }: { zone?: string }) {
  const items = [
    `⚡ ${lastReplyTicker()}`,
    `🏠 ${matchedToday(zone)} matched today${zone ? " in your zone" : ""}`,
    `🚪 ${visitsBookedToday()} visits booked this morning`,
    `✓ Online · usually replies in minutes`,
  ];
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI(x => (x + 1) % items.length), 3800);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zone]);
  return (
    <span className="relative block h-3.5 overflow-hidden text-[11px] text-emerald-200 leading-tight">
      <AnimatePresence mode="wait">
        <motion.span key={i}
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -12, opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="absolute inset-0 flex items-center gap-1 truncate">
          <Zap className="w-3 h-3 text-yellow-300 fill-yellow-300 flex-shrink-0" />
          <span className="truncate">{items[i]}</span>
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
