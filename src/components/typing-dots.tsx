import { motion } from "framer-motion";

export function TypingDots() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="bubble-in self-start ml-1 inline-flex items-center gap-1 px-3 py-2.5">
      {[0, 1, 2].map(i => (
        <motion.span key={i}
          className="w-1.5 h-1.5 rounded-full bg-[#667781]"
          animate={{ y: [0, -3, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }} />
      ))}
    </motion.div>
  );
}

/** Double blue tick for read receipts on user (out) bubbles */
export function ReadTick({ read = true }: { read?: boolean }) {
  return (
    <span className="inline-flex items-center gap-0.5 ml-1">
      <svg viewBox="0 0 16 11" className="w-3.5 h-3.5" style={{ color: read ? "#53BDEB" : "#8696a0" }}>
        <path fill="currentColor" d="M11.071.653a.5.5 0 0 1 .034.707l-6.5 7a.5.5 0 0 1-.74-.012L.835 4.354a.5.5 0 0 1 .763-.648l2.66 3.13L10.364.687a.5.5 0 0 1 .707-.034z"/>
        <path fill="currentColor" d="M15.071.653a.5.5 0 0 1 .034.707l-6.5 7a.5.5 0 0 1-.74-.012l-1.5-1.764a.5.5 0 1 1 .763-.648l1.137 1.337L14.364.687a.5.5 0 0 1 .707-.034z"/>
      </svg>
    </span>
  );
}
