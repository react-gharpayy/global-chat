import { motion } from "framer-motion";
import { MapPin, Bike, Users } from "lucide-react";
import { seatsLeft } from "@/lib/proof-seed";

type Match = {
  id: string;
  name: string;
  area: string;
  commuteMin: number;
  vibe: string[];
  gradient: string;
  walkTo?: string;
};

const ZONE_MATCHES: Record<string, Match[]> = {
  east: [
    { id: "wf-1", name: "House on Graphite Lane",  area: "Whitefield · 0.8km from ITPL",   commuteMin: 8,  vibe: ["IT folks", "Café strip", "Pet-friendly"], gradient: "from-emerald-400 to-teal-600", walkTo: "ITPL gate 4" },
    { id: "wf-2", name: "Brookfield Quiet Block",  area: "Brookfield · near Phoenix",      commuteMin: 14, vibe: ["Quiet floor", "AC rooms", "Veg kitchen"], gradient: "from-amber-400 to-orange-600" },
    { id: "wf-3", name: "Mahadevapura Loft",       area: "Mahadevapura · metro 4 min",     commuteMin: 11, vibe: ["Solo rooms", "Co-working corner"], gradient: "from-sky-400 to-indigo-600" },
  ],
  orr: [
    { id: "or-1", name: "Bellandur Lake View",     area: "Bellandur · lake side",          commuteMin: 9,  vibe: ["Lake morning runs", "Engineers", "Pet-friendly"], gradient: "from-cyan-400 to-blue-600", walkTo: "Embassy Tech" },
    { id: "or-2", name: "Sarjapur Quiet House",    area: "Sarjapur Rd · gated lane",       commuteMin: 12, vibe: ["Founders", "Late-night WiFi", "Roof deck"], gradient: "from-violet-400 to-purple-700" },
    { id: "or-3", name: "RMZ Walk-to-Work",        area: "Bellandur · 6 min to RMZ",       commuteMin: 6,  vibe: ["Walk to office", "Hot breakfast"], gradient: "from-emerald-400 to-green-700" },
  ],
  north: [
    { id: "no-1", name: "Manyata Garden Floor",    area: "Nagawara · IBM gate",            commuteMin: 7,  vibe: ["Walk to Manyata", "Quiet", "Garden"], gradient: "from-lime-400 to-emerald-700" },
    { id: "no-2", name: "Hebbal Lake Stay",        area: "Hebbal · near lake",             commuteMin: 13, vibe: ["Runners", "Veg-only", "Balcony"], gradient: "from-sky-400 to-blue-700" },
    { id: "no-3", name: "Yeshwanthpur House",      area: "Yeshwanthpur · metro 3 min",     commuteMin: 16, vibe: ["Metro corridor", "Mixed crowd"], gradient: "from-rose-400 to-pink-700" },
  ],
  central: [
    { id: "ce-1", name: "Koramangala 5th Block",   area: "Koramangala · 80ft road",        commuteMin: 6,  vibe: ["Founders & designers", "Cafés below"], gradient: "from-fuchsia-400 to-purple-700" },
    { id: "ce-2", name: "Indiranagar Quiet House", area: "Indiranagar · 100ft side lane",  commuteMin: 9,  vibe: ["Pet-friendly", "Roof terrace", "Quiet floor"], gradient: "from-amber-400 to-rose-600" },
    { id: "ce-3", name: "Vasanth Nagar Studio",    area: "Vasanth Nagar · MG Road",        commuteMin: 8,  vibe: ["Solo rooms", "Walk to MG"], gradient: "from-teal-400 to-emerald-700" },
  ],
  south: [
    { id: "so-1", name: "Electronic City Phase 1", area: "EC Phase 1 · Infosys gate",      commuteMin: 5,  vibe: ["Walk to Infosys", "Hot breakfast"], gradient: "from-emerald-400 to-cyan-700" },
    { id: "so-2", name: "BTM Stay",                area: "BTM 2nd Stage · main road",      commuteMin: 14, vibe: ["Foodie street", "Mixed crowd"], gradient: "from-orange-400 to-red-600" },
    { id: "so-3", name: "JP Nagar Garden",         area: "JP Nagar · 6th phase",           commuteMin: 17, vibe: ["Quiet", "Families nearby"], gradient: "from-lime-400 to-green-700" },
  ],
};

export function MatchPreview({ zone, name, compact = false }: { zone?: string; name?: string; compact?: boolean }) {
  const matches = (zone && ZONE_MATCHES[zone]) || ZONE_MATCHES.central;
  const greeting = name ? `${name}, Aayushi already lined these up` : "Aayushi already lined these up";
  return (
    <div className={`rounded-2xl bg-white border border-black/5 shadow-sm p-3.5 ${compact ? "" : "mt-1"}`}>
      <div className="flex items-center gap-2 mb-2.5">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#1F47BA]">Pre-shortlisted</span>
        <span className="flex-1 h-px bg-black/5" />
        <span className="text-[10px] text-[#667781]">live</span>
      </div>
      <p className="text-[13px] font-semibold text-[#111B21] leading-snug mb-3">{greeting}</p>
      <div className="space-y-2.5">
        {matches.map((m, i) => {
          const seats = seatsLeft(m.id);
          return (
            <motion.div key={m.id}
              initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 * i }}
              className="flex gap-2.5 rounded-xl overflow-hidden border border-black/5 hover:border-[#25D366]/40 transition-colors">
              <div className={`w-16 flex-shrink-0 bg-gradient-to-br ${m.gradient} flex items-center justify-center`}>
                <MapPin className="w-5 h-5 text-white/95 drop-shadow" />
              </div>
              <div className="flex-1 min-w-0 py-2 pr-2">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[12.5px] font-bold text-[#111B21] leading-tight truncate">{m.name}</p>
                  <span className={`text-[9.5px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 ${seats <= 2 ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-700"}`}>
                    {seats} seat{seats > 1 ? "s" : ""} left
                  </span>
                </div>
                <p className="text-[10.5px] text-[#667781] mt-0.5 truncate">{m.area}</p>
                <div className="flex items-center gap-2 mt-1 text-[10px] text-[#128C7E]">
                  <span className="inline-flex items-center gap-0.5"><Bike className="w-2.5 h-2.5" /> {m.commuteMin} min</span>
                  <span className="inline-flex items-center gap-0.5"><Users className="w-2.5 h-2.5" /> {m.vibe[0]}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
      <p className="text-[10.5px] text-[#667781] mt-2.5 italic text-center">Address shown after the call · zero broker fee</p>
    </div>
  );
}
