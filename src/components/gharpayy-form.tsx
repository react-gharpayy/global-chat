import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, Check, Sparkles, Phone, Shield, Home as HomeIcon,
  MessageCircle, Send, Zap, Copy, RotateCcw,
} from "lucide-react";
import { ChatHeader } from "@/components/form-ui";

// ─── Gharpayy official WhatsApp ──────────────────────────────────────
const GHARPAYY_WA = "917988114576";
const GHARPAYY_WA_DISPLAY = "+91 79881 14576";
const COUPON = "GHAR1000";

// ─── Types ───────────────────────────────────────────────────────────
type StepId =
  | "welcome" | "story" | "in_blr" | "curr_stay" | "notice"
  | "arrival" | "flight" | "movein" | "area" | "budget"
  | "room" | "gender" | "matters" | "dealbreakers" | "worry"
  | "contact" | "reveal";

type ChoiceOpt = { v: string; e: string; t: string; d: string };
type Step =
  | { type: "welcome" }
  | { type: "choice"; key: string; q: string; qs: string; opts: ChoiceOpt[]; optional?: boolean; next: (d: Data) => StepId }
  | { type: "text"; key: string; q: string; qs: string; ph: string; chips?: string[]; next: (d: Data) => StepId }
  | { type: "budget"; key: string; q: string; qs: string; next: (d: Data) => StepId }
  | { type: "multi"; key: string; q: string; qs: string; opts: string[]; max: number; optional?: boolean; next: (d: Data) => StepId }
  | { type: "contact"; q: string; qs: string; next: (d: Data) => StepId }
  | { type: "reveal" };

type Data = {
  intent?: string; story?: string; in_blr?: string; curr_stay?: string;
  notice?: string; arrival?: string; flight?: string; movein?: string;
  area?: string; budget?: string; room?: string; gender?: string;
  matters?: string[]; dealbreakers?: string[]; worry?: string;
  name?: string; phone?: string;
};

// ─── BLR insights — every screen adds value ──────────────────────────
const AREA_INSIGHTS: Record<string, string> = {
  koramangala: "Koramangala avg ₹13,500/mo · startup hub, foodie heaven, Sony Signal jams",
  hsr: "HSR avg ₹11,200/mo · clean, parky, metro coming 2026",
  whitefield: "Whitefield avg ₹10,400/mo · ITPL crowd, weekend brewery scene",
  indiranagar: "Indiranagar avg ₹15,800/mo · walkable, premium, 100ft Rd nightlife",
  bellandur: "Bellandur avg ₹10,800/mo · ORR tech-park central",
  electronic: "E-City avg ₹8,500/mo · closest to Infosys/Wipro/Biocon",
  marathahalli: "Marathahalli avg ₹9,800/mo · ORR tech parks, dense buses",
  btm: "BTM avg ₹9,200/mo · central, cheap, great metro",
  sarjapur: "Sarjapur Rd avg ₹11,500/mo · new tech, calmer, growing fast",
  hebbal: "Hebbal avg ₹10,200/mo · airport side, Manyata tech park",
  jp: "JP Nagar avg ₹10,500/mo · quieter, family vibe",
};
function areaInsight(area?: string) {
  if (!area) return null;
  const a = area.toLowerCase();
  for (const k of Object.keys(AREA_INSIGHTS)) if (a.includes(k)) return AREA_INSIGHTS[k];
  return `We have verified PGs near ${area.split(",")[0]} — Aayushi will share 3–5 today.`;
}
const BUDGET_INSIGHT: Record<string, string> = {
  u8: "Budget tier · 40+ verified shared rooms in BTM, E-City, Marathahalli",
  "8to12": "Sweet spot · 60% of our residents pay this — best value/quality ratio",
  "12to18": "Premium tier · single rooms, AC, home-cooked food, prime areas",
  "18to25": "Top comfort · attached bath, near-studio quality",
  "25to35": "Hotel-grade · housekeeping daily, walk-to-office options",
  "35plus": "Serviced apartment territory · we have a curated handful",
};
const STORY_INSIGHT: Record<string, string> = {
  newjob: "73% of new joiners regret their first PG. We'll get yours right.",
  upgrade: "9 in 10 of our residents came from another PG. You're not alone.",
  intern: "We have flexible 2–6 month stays with zero lock-in.",
  relocate: "BLR rents jumped 12% in 2025 — let's lock your room before you land.",
  blr: "Avg upgrader saves ₹2,000/mo by switching from chain PGs to verified locals.",
  explore: "No pressure — we'll show you what's actually available in your range.",
};

// ─── Step engine ─────────────────────────────────────────────────────
const STEPS: Record<StepId, Step> = {
  welcome: { type: "welcome" },

  story: {
    type: "choice", key: "story",
    q: "What's your situation right now?",
    qs: "Tell us honestly — this shapes everything we find for you.",
    opts: [
      { v: "newjob", e: "🎉", t: "Just got a job offer / starting college", d: "Exciting new chapter — let's settle you right" },
      { v: "upgrade", e: "😤", t: "My current PG isn't working out", d: "We know that feeling. Let's fix it properly." },
      { v: "intern", e: "💼", t: "Short internship — 2 to 6 months", d: "Flexible, no lock-in — we have exactly that" },
      { v: "relocate", e: "✈️", t: "Moving to Bangalore from another city", d: "New city, blank slate — we'll make it smooth" },
      { v: "blr", e: "🏙️", t: "Already in BLR, want something better", d: "You deserve better than what you have now" },
      { v: "explore", e: "🔍", t: "Just exploring options for now", d: "No pressure — see what's out there first" },
    ],
    next: (d) => d.story === "relocate" ? "arrival" : (d.story === "upgrade" || d.story === "blr") ? "curr_stay" : "in_blr",
  },

  in_blr: {
    type: "choice", key: "in_blr",
    q: "Are you in Bangalore right now?",
    qs: "Changes what we prioritize finding for you.",
    opts: [
      { v: "yes", e: "📍", t: "Yes, I'm already here", d: "Good — we can move fast" },
      { v: "no", e: "✈️", t: "No, I'm coming soon", d: "We'll have it ready before you land" },
    ],
    next: (d) => d.in_blr === "yes" ? "curr_stay" : "arrival",
  },

  curr_stay: {
    type: "choice", key: "curr_stay",
    q: "Where are you staying right now?",
    qs: "Helps us understand your urgency.",
    opts: [
      { v: "hotel", e: "🏨", t: "Hotel or temporary Airbnb", d: "Burning cash daily — let's move fast" },
      { v: "pg", e: "🏠", t: "Another PG or hostel", d: "Upgrading — we'll find genuinely better" },
      { v: "flat", e: "🏢", t: "Flat or apartment", d: "Moving to managed — less hassle" },
      { v: "friend", e: "👥", t: "Staying with a friend or family", d: "Time to get your own space" },
      { v: "nowhere", e: "🚨", t: "Not settled yet — urgent help needed", d: "This becomes our top priority. Right now." },
    ],
    next: (d) => (d.curr_stay === "hotel" || d.curr_stay === "friend" || d.curr_stay === "nowhere") ? "movein" : "notice",
  },

  notice: {
    type: "choice", key: "notice",
    q: "Have you given notice at your current place?",
    qs: "Tells us how much runway we're working with.",
    opts: [
      { v: "given", e: "✅", t: "Yes — last day coming up", d: "Good. Let's find your next home before then." },
      { v: "not_yet", e: "🕐", t: "Not yet — haven't spoken to them", d: "No stress. We'll time this right." },
      { v: "difficult", e: "😬", t: "Owner is being difficult", d: "Common. We know how to navigate this." },
      { v: "free", e: "👍", t: "No contract — can leave anytime", d: "Flexible. Move at whatever pace suits you." },
    ],
    next: () => "movein",
  },

  arrival: {
    type: "choice", key: "arrival",
    q: "When are you arriving in Bangalore?",
    qs: "Even a rough idea helps us hold the right rooms.",
    opts: [
      { v: "thisweek", e: "🔥", t: "This week", d: "Rooms ready before you land" },
      { v: "thismonth", e: "📅", t: "This month", d: "Time to find something great" },
      { v: "nextmonth", e: "🗓️", t: "Next month", d: "We'll start matching today" },
      { v: "later", e: "🔮", t: "2 to 3 months from now", d: "We'll stay in touch as it gets closer" },
    ],
    next: () => "flight",
  },

  flight: {
    type: "choice", key: "flight",
    q: "Have you booked your travel?",
    qs: "Helps us understand how firm your timeline is.",
    opts: [
      { v: "yes", e: "✈️", t: "Yes — ticket booked", d: "We'll work backwards from your arrival" },
      { v: "no", e: "🎟️", t: "Not yet — still planning", d: "We'll hold options when you're ready" },
    ],
    next: () => "movein",
  },

  movein: {
    type: "choice", key: "movein",
    q: "When do you want to move in?",
    qs: "We work backwards from this to lock in the right options.",
    opts: [
      { v: "now", e: "🚀", t: "ASAP — I need it NOW", d: "Move-in ready rooms. We act today." },
      { v: "2wk", e: "📅", t: "Within the next 2 weeks", d: "Good window — we'll find and hold one" },
      { v: "month", e: "🗓️", t: "Month-end / next month start", d: "Popular window — best selection" },
      { v: "next", e: "⏳", t: "Next month or later", d: "We'll plan ahead, get the best options" },
    ],
    next: () => "area",
  },

  area: {
    type: "text", key: "area",
    q: "Where's your daily life in BLR?",
    qs: "Office, college, or wherever you spend your day. Cutting your commute is literally our job.",
    ph: "e.g. Koramangala, near Infosys, HSR…",
    chips: ["Koramangala","HSR Layout","Whitefield","Indiranagar","Bellandur","Electronic City","Marathahalli","BTM Layout","Sarjapur Rd","Hebbal"],
    next: () => "budget",
  },

  budget: {
    type: "budget", key: "budget",
    q: "What feels right to spend each month?",
    qs: "Be honest — we find the best in your range, not the most expensive.",
    next: () => "room",
  },

  room: {
    type: "choice", key: "room",
    q: "What kind of space do you need?",
    qs: "About what fits your life right now — no wrong answer.",
    opts: [
      { v: "private", e: "🛏️", t: "My own room — full privacy", d: "Your own lock, your own quiet" },
      { v: "double", e: "👥", t: "Double sharing — one roommate", d: "Most popular. Cost & comfort balance." },
      { v: "triple", e: "👨‍👩‍👦", t: "Triple sharing — budget priority", d: "Most affordable. Roommates carefully vetted." },
      { v: "flex", e: "✨", t: "Surprise me — best deal", d: "We match based on everything else" },
    ],
    next: () => "gender",
  },

  gender: {
    type: "choice", key: "gender",
    q: "This stay is for…",
    qs: "Helps us find the right property and community match.",
    opts: [
      { v: "boys", e: "👨", t: "Looking for boys / male PG", d: "Boys-only or coed — both available" },
      { v: "girls", e: "👩", t: "Looking for girls / female PG", d: "Girls-only or female floor — your choice" },
      { v: "coed", e: "🤝", t: "Coed is fine for me", d: "Mixed-gender properties across BLR" },
      { v: "couple", e: "👫", t: "Me and my partner", d: "Couple-friendly properties available" },
    ],
    next: () => "matters",
  },

  matters: {
    type: "multi", key: "matters", max: 4,
    q: "What really matters in a home?",
    qs: "Pick up to 4. Go with your gut — these affect your daily life.",
    opts: ["Fast WiFi","Home-cooked food","AC room","Attached bathroom","Good crowd","Near metro/bus","CCTV & security","No curfew","Quiet space","Balcony","Veg-only kitchen","Gym","Daily housekeeping","Hot water 24/7"],
    next: () => "dealbreakers",
  },

  dealbreakers: {
    type: "multi", key: "dealbreakers", max: 3, optional: true,
    q: "Any absolute deal-breakers?",
    qs: "Things you've experienced and never want again. Pick up to 3 — or skip.",
    opts: ["Owner drops in unannounced","Strict curfew before 10pm","Shared bathrooms only","No guests ever","Noisy roommates","Bad repetitive food","WiFi that keeps cutting","No parking","Too far from transport","Owner who delays deposits"],
    next: () => "worry",
  },

  worry: {
    type: "choice", key: "worry", optional: true,
    q: "What's worrying you about this search?",
    qs: "We ask so we can address it before you even meet us. Not a trap.",
    opts: [
      { v: "deposit", e: "💰", t: "My deposit will get stuck", d: "Official receipt the moment you pay. Always." },
      { v: "bad_exp", e: "😞", t: "I had a bad PG experience before", d: "Tell us when she calls — we'll make sure it's different here" },
      { v: "budget_unsure", e: "🤔", t: "Not sure I can afford the good ones", d: "Let's figure it out. ₹1,000 off already helps." },
      { v: "parents", e: "👨‍👩‍👦", t: "My parents need to feel comfortable", d: "We speak to families directly. Many parents call us first." },
      { v: "visit", e: "👁️", t: "I need to see it in person first", d: "We arrange visits every day. Zero pressure." },
      { v: "deciding", e: "⚖️", t: "I'm comparing a few options", d: "We'll tell you the honest differences — even if not in our favour." },
      { v: "ready", e: "🚀", t: "Nothing — I'm ready to move fast", d: "Let's go. Options on the way today." },
    ],
    next: () => "contact",
  },

  contact: {
    type: "contact",
    q: "Last step — let's make it official.",
    qs: "Put a name and number to your story — we'll do everything from here.",
    next: () => "reveal",
  },

  reveal: { type: "reveal" },
};

// ─── Estimate total steps for accurate progress ──────────────────────
function estimateTotal(d: Data): number {
  const base: StepId[] = ["story","movein","area","budget","room","gender","matters","dealbreakers","worry","contact"];
  if (!d.story || (d.story !== "upgrade" && d.story !== "blr")) base.unshift("in_blr");
  if (d.in_blr === "no" || d.story === "relocate") {
    const i = base.indexOf("movein"); base.splice(i, 0, "arrival", "flight");
  } else if (d.in_blr === "yes" || d.story === "upgrade" || d.story === "blr") {
    const i = base.indexOf("movein"); base.splice(i, 0, "curr_stay");
    if (d.curr_stay && d.curr_stay !== "hotel" && d.curr_stay !== "friend" && d.curr_stay !== "nowhere") {
      base.splice(base.indexOf("movein"), 0, "notice");
    }
  }
  return Math.max(12, base.length);
}

// ─── Budget tiers ────────────────────────────────────────────────────
const BUDGETS = [
  { v: "u8",     r: "Under ₹8,000",       d: "Budget-first — hidden gems exist" },
  { v: "8to12",  r: "₹8,000 – ₹12,000",   d: "Most popular range — great balance" },
  { v: "12to18", r: "₹12,000 – ₹18,000",  d: "Private rooms with real facilities" },
  { v: "18to25", r: "₹18,000 – ₹25,000",  d: "Premium comfort, attached bathroom" },
  { v: "25to35", r: "₹25,000 – ₹35,000",  d: "Top tier — near studio quality" },
  { v: "35plus", r: "₹35,000+",           d: "Luxury / serviced apartment" },
];

// ─── Labels for reveal & WA message ──────────────────────────────────
const L_INTENT: Record<string,string> = { perfect:"Homely stay", budget:"Most affordable", nearby:"Close to office/college", safe:"Safety & trust priority" };
const L_STORY: Record<string,string> = { newjob:"New job/college start", upgrade:"Upgrading PG", intern:"Internship", relocate:"Relocating to BLR", blr:"Already in BLR — upgrading", explore:"Exploring options" };
const L_CURR: Record<string,string> = { hotel:"Hotel (temp)", pg:"PG/hostel", flat:"Flat/apartment", friend:"Friend/family", nowhere:"URGENT — not settled" };
const L_NOTICE: Record<string,string> = { given:"Notice given", not_yet:"Not yet", difficult:"Complicated", free:"No contract" };
const L_ARRIVAL: Record<string,string> = { thisweek:"This week", thismonth:"This month", nextmonth:"Next month", later:"2–3 months out" };
const L_MOVEIN: Record<string,string> = { now:"ASAP — urgent","2wk":"Within 2 weeks", month:"Month-end", next:"Next month or later" };
const L_BUDGET: Record<string,string> = { u8:"Under ₹8k","8to12":"₹8k–12k","12to18":"₹12k–18k","18to25":"₹18k–25k","25to35":"₹25k–35k","35plus":"₹35k+" };
const L_ROOM: Record<string,string> = { private:"Private room", double:"Double sharing", triple:"Triple sharing", flex:"Best deal (flexible)" };
const L_GENDER: Record<string,string> = { boys:"Male PG", girls:"Female PG", coed:"Coed", couple:"Couple" };
const L_WORRY: Record<string,string> = { deposit:"Deposit security", bad_exp:"Past bad experience", budget_unsure:"Budget uncertainty", parents:"Parents' comfort", visit:"In-person visit needed", deciding:"Comparing options", ready:"Ready to move fast" };

function buildMsg(d: Data, elapsed: number): string {
  const lines: string[] = [];
  lines.push("*GHARPAYY* ⚡ New Lead");
  lines.push("————————————————");
  lines.push(`📝 *Name:* ${d.name || "—"}`);
  lines.push(`📱 *Phone:* ${d.phone || "—"}`);
  lines.push("");
  if (d.intent) lines.push(`🎯 *Looking for:* ${L_INTENT[d.intent] || d.intent}`);
  if (d.story) lines.push(`📌 *Situation:* ${L_STORY[d.story] || d.story}`);
  if (d.in_blr) lines.push(`📍 *In BLR:* ${d.in_blr === "yes" ? "Yes" : "No"}`);
  if (d.curr_stay) lines.push(`🏠 *Currently in:* ${L_CURR[d.curr_stay]}`);
  if (d.notice) lines.push(`📋 *Notice:* ${L_NOTICE[d.notice]}`);
  if (d.arrival) lines.push(`✈️ *Arriving:* ${L_ARRIVAL[d.arrival]}`);
  if (d.flight) lines.push(`🎫 *Travel:* ${d.flight === "yes" ? "Booked ✓" : "Not booked"}`);
  if (d.movein) lines.push(`📆 *Move-in:* ${L_MOVEIN[d.movein]}`);
  if (d.area) lines.push(`📍 *Area:* ${d.area}`);
  if (d.budget) lines.push(`💰 *Budget:* ${L_BUDGET[d.budget]}/month`);
  if (d.room) lines.push(`🛏️ *Room:* ${L_ROOM[d.room]}`);
  if (d.gender) lines.push(`👤 *For:* ${L_GENDER[d.gender]}`);
  if (d.matters?.length) lines.push(`\n✨ *Must-haves:* ${d.matters.join(", ")}`);
  if (d.dealbreakers?.length) lines.push(`🚫 *Deal-breakers:* ${d.dealbreakers.join(", ")}`);
  if (d.worry) lines.push(`\n💬 *Main concern:* ${L_WORRY[d.worry]}`);
  lines.push(`\n🎟️ *Coupon:* ${COUPON} (₹1,000 off)`);
  lines.push("————————————————");
  lines.push(`via Gharpayy SuperStay${elapsed ? ` · ${elapsed}s` : ""}`);
  lines.push("Call within 30 mins.");
  return lines.join("\n");
}

// ═══════════════════════════════════════════════════════════════════════
//  COMPONENT
// ═══════════════════════════════════════════════════════════════════════
export default function GharpayyForm() {
  const [data, setData] = useState<Data>({});
  const [history, setHistory] = useState<StepId[]>([]);
  const [cur, setCur] = useState<StepId>("welcome");
  const [tStart, setTStart] = useState<number | null>(null);
  const [now, setNow] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [customNum, setCustomNum] = useState("");
  const [showCustom, setShowCustom] = useState(false);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // live timer
  useEffect(() => {
    if (!tStart || cur === "welcome" || cur === "reveal") return;
    const id = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(id);
  }, [tStart, cur]);

  // autofocus
  useEffect(() => {
    const s = STEPS[cur];
    if (s.type === "text" || s.type === "contact") {
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [cur]);

  const total = useMemo(() => estimateTotal(data), [data]);
  const pos = history.length;
  const progress = cur === "welcome" ? 0 : cur === "reveal" ? 100 : Math.min(96, Math.round(pos / total * 100));
  void now; // re-render trigger from interval
  const elapsedSec = tStart ? Math.round((Date.now() - tStart) / 1000) : 0;

  const advance = useCallback((nextId?: StepId) => {
    const s = STEPS[cur];
    const nxt = nextId || (s.type !== "welcome" && s.type !== "reveal" ? s.next(data) : null);
    if (!nxt) return;
    setHistory(h => [...h, cur]);
    setCur(nxt);
  }, [cur, data]);

  const back = useCallback(() => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setHistory(h => h.slice(0, -1));
    setCur(prev);
  }, [history]);

  const setIntent = (v: string) => {
    setData(d => ({ ...d, intent: v }));
    if (!tStart) setTStart(Date.now());
    setHistory(h => [...h, "welcome"]);
    setCur("story");
  };

  const pickChoice = (key: string, v: string) => {
    setData(d => {
      const next = { ...d, [key]: v };
      const s = STEPS[cur];
      if (s.type === "choice") {
        setTimeout(() => {
          setHistory(h => [...h, cur]);
          setCur(s.next(next));
        }, 280);
      }
      return next;
    });
  };

  const toggleMulti = (key: string, v: string, max: number) => {
    setData(d => {
      const arr = (d as any)[key] as string[] | undefined || [];
      const i = arr.indexOf(v);
      if (i > -1) return { ...d, [key]: arr.filter(x => x !== v) };
      if (arr.length >= max) return d;
      return { ...d, [key]: [...arr, v] };
    });
  };

  const submitContact = () => {
    if (!data.name?.trim() || (data.phone || "").replace(/\D/g, "").length < 10) return;
    setElapsed(tStart ? Math.round((Date.now() - tStart) / 1000) : 0);
    setHistory(h => [...h, "contact"]);
    setCur("reveal");
  };

  const restart = () => {
    setData({}); setHistory([]); setCur("welcome"); setTStart(null); setElapsed(0);
    setCustomNum(""); setShowCustom(false);
  };

  const waMessage = useMemo(() => buildMsg(data, elapsed), [data, elapsed]);
  const gharpayyUrl = `https://wa.me/${GHARPAYY_WA}?text=${encodeURIComponent(waMessage)}`;
  const customDigits = customNum.replace(/\D/g, "");
  const customUrl = customDigits.length >= 10
    ? `https://wa.me/${customDigits.length === 10 ? "91" + customDigits : customDigits}?text=${encodeURIComponent(waMessage)}`
    : "";

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(waMessage);
      setCopied(true); setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div className="min-h-[100dvh] w-full flex justify-center" style={{ background: "var(--brand-navy)" }}>
      <div className="w-full max-w-md relative min-h-[100dvh] flex flex-col overflow-hidden wa-chat-bg">
        <ChatHeader
          onBack={cur !== "welcome" && cur !== "reveal" && history.length > 0 ? back : undefined}
          subtitle={cur === "welcome" ? "online · usually replies in 10 min" : cur === "reveal" ? "✓ Lead received" : `Step ${pos} of ~${total} · ${elapsedSec}s`}
        />

        {/* Progress bar */}
        {cur !== "welcome" && (
          <div className="h-1 bg-black/5">
            <motion.div className="h-full bg-gradient-to-r from-[#25D366] to-[#128C7E]"
              initial={false}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }} />
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-4 py-4">
          <AnimatePresence mode="wait">
            <motion.div key={cur}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
              className="flex flex-col gap-3">

              {/* ═══════ WELCOME ═══════ */}
              {cur === "welcome" && (
                <>
                  <div className="flex justify-center mb-1">
                    <span className="px-3 py-1 rounded-full text-[11px] font-medium text-[#54656F] bg-[#E1F5FE]/90 shadow-sm">Today</span>
                  </div>
                  <Bubble side="in" delay={0.05}>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#1F47BA] mb-1">Aayushi · Gharpayy</p>
                    <p className="text-[15px] font-semibold text-[#111B21] leading-snug">Hey! 👋</p>
                    <p className="text-[14px] text-[#111B21] leading-snug mt-1">
                      Your Bangalore home is <b>30 seconds</b> away. This isn't a form — it's a conversation.
                      Tell us what you're really looking for. <b>Zero brokerage</b>, real verified rooms.
                    </p>
                  </Bubble>
                  <Bubble side="in" delay={0.18}>
                    <div className="flex items-center gap-2 mb-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#FFC72C]" />
                      <p className="text-[11px] font-bold text-[#5A3A00] uppercase tracking-wider">₹1,000 off — unlocks at the end</p>
                    </div>
                    <p className="text-[13px] text-[#111B21] leading-snug">What brings you here today?</p>
                  </Bubble>

                  <div className="space-y-2 mt-1">
                    {[
                      { v: "perfect", e: "🏡", t: "I want the most homely stay possible", d: "Feel at home — not just have a room" },
                      { v: "budget",  e: "💸", t: "The most affordable option in BLR",   d: "Best value is all I care about" },
                      { v: "nearby",  e: "📍", t: "Close to my office or college",        d: "My commute is killing me" },
                      { v: "safe",    e: "🔒", t: "Safe, trustworthy, family-approved",   d: "Safety matters most" },
                    ].map((o, i) => (
                      <motion.button key={o.v} type="button"
                        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + i * 0.06 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setIntent(o.v)}
                        className="w-full flex items-center gap-3 rounded-2xl p-3 text-left bg-white border border-black/5 shadow-sm hover:shadow-md hover:border-[#25D366] active:scale-95 transition-all group">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-xl bg-[#25D366]/10 border border-[#25D366]/20">{o.e}</div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-[#111B21] text-[13.5px] leading-tight">{o.t}</p>
                          <p className="text-[11px] text-[#667781] mt-0.5 leading-tight">{o.d}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-[#25D366] opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all flex-shrink-0" />
                      </motion.button>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[10px] text-[#667781] mt-3">
                    <span className="flex items-center gap-1"><Shield className="w-3 h-3 text-[#25D366]" /> Zero brokerage</span>
                    <span>·</span>
                    <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-[#25D366]" /> Personal call</span>
                    <span>·</span>
                    <span className="flex items-center gap-1"><HomeIcon className="w-3 h-3 text-[#25D366]" /> Verified PGs</span>
                  </div>
                </>
              )}

              {/* ═══════ CHOICE STEP ═══════ */}
              {STEPS[cur].type === "choice" && cur !== "welcome" && cur !== "reveal" && (
                <>
                  <UserEcho prev={history[history.length - 1]} data={data} />
                  <Bubble side="in" delay={0.05}>
                    <p className="text-[15px] font-bold text-[#111B21] leading-snug">{(STEPS[cur] as any).q}</p>
                    <p className="text-[12.5px] text-[#667781] mt-1 leading-snug">{(STEPS[cur] as any).qs}</p>
                  </Bubble>
                  {ContextInsight(cur, data)}
                  <div className="space-y-2">
                    {((STEPS[cur] as any).opts as ChoiceOpt[]).map((o, i) => {
                      const on = (data as any)[(STEPS[cur] as any).key] === o.v;
                      return (
                        <motion.button key={o.v} type="button"
                          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.12 + i * 0.04 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => pickChoice((STEPS[cur] as any).key, o.v)}
                          className={`w-full flex items-center gap-3 rounded-2xl p-3 text-left border shadow-sm transition-all group ${on ? "bg-[#DCF8C6] border-[#25D366]" : "bg-white border-black/5 hover:border-[#25D366]/40"}`}>
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-xl ${on ? "bg-[#25D366]/20 border border-[#25D366]/40" : "bg-[#25D366]/10 border border-[#25D366]/20"}`}>{o.e}</div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-[#111B21] text-[13.5px] leading-tight">{o.t}</p>
                            <p className="text-[11px] text-[#667781] mt-0.5 leading-tight">{o.d}</p>
                          </div>
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${on ? "bg-[#25D366]" : "border border-black/10"}`}>
                            {on && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                  {(STEPS[cur] as any).optional && (
                    <button type="button" onClick={() => advance()} className="text-[12px] text-[#667781] hover:text-[#25D366] py-2 transition-colors">
                      Skip this one →
                    </button>
                  )}
                </>
              )}

              {/* ═══════ TEXT STEP ═══════ */}
              {STEPS[cur].type === "text" && (
                <>
                  <UserEcho prev={history[history.length - 1]} data={data} />
                  <Bubble side="in" delay={0.05}>
                    <p className="text-[15px] font-bold text-[#111B21] leading-snug">{(STEPS[cur] as any).q}</p>
                    <p className="text-[12.5px] text-[#667781] mt-1 leading-snug">{(STEPS[cur] as any).qs}</p>
                  </Bubble>
                  {areaInsight(data.area) && cur === "area" && data.area && data.area.length > 2 && (
                    <Bubble side="in" delay={0.1}>
                      <div className="flex items-start gap-2">
                        <span className="text-base">💡</span>
                        <p className="text-[12.5px] text-[#5A3A00] leading-snug">{areaInsight(data.area)}</p>
                      </div>
                    </Bubble>
                  )}
                  <div className="bg-white rounded-2xl p-3 shadow-sm border border-black/5">
                    <input ref={inputRef} type="text"
                      placeholder={(STEPS[cur] as any).ph}
                      value={(data as any)[(STEPS[cur] as any).key] || ""}
                      onChange={e => setData(d => ({ ...d, [(STEPS[cur] as any).key]: e.target.value }))}
                      onKeyDown={e => { if (e.key === "Enter" && ((data as any)[(STEPS[cur] as any).key] || "").length > 1) advance(); }}
                      className="w-full bg-transparent text-[15px] text-[#111B21] placeholder:text-[#9aa6ad] outline-none" />
                    {(STEPS[cur] as any).chips && (
                      <div className="flex flex-wrap gap-1.5 mt-2.5 pt-2.5 border-t border-black/5">
                        {((STEPS[cur] as any).chips as string[]).map(c => (
                          <button key={c} type="button"
                            onClick={() => setData(d => ({ ...d, [(STEPS[cur] as any).key]: c }))}
                            className="px-2.5 py-1 rounded-full text-[11px] font-medium text-[#1F47BA] bg-[#1F47BA]/8 hover:bg-[#1F47BA]/15 border border-[#1F47BA]/15 transition-colors">
                            {c}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <ContinueBtn disabled={!((data as any)[(STEPS[cur] as any).key] || "").length || ((data as any)[(STEPS[cur] as any).key] || "").length < 2} onClick={() => advance()} />
                </>
              )}

              {/* ═══════ BUDGET STEP ═══════ */}
              {STEPS[cur].type === "budget" && (
                <>
                  <UserEcho prev={history[history.length - 1]} data={data} />
                  <Bubble side="in" delay={0.05}>
                    <p className="text-[15px] font-bold text-[#111B21] leading-snug">{(STEPS[cur] as any).q}</p>
                    <p className="text-[12.5px] text-[#667781] mt-1 leading-snug">{(STEPS[cur] as any).qs}</p>
                  </Bubble>
                  {data.budget && BUDGET_INSIGHT[data.budget] && (
                    <Bubble side="in" delay={0.1}>
                      <div className="flex items-start gap-2">
                        <span className="text-base">💡</span>
                        <p className="text-[12.5px] text-[#5A3A00] leading-snug">{BUDGET_INSIGHT[data.budget]}</p>
                      </div>
                    </Bubble>
                  )}
                  <div className="space-y-2">
                    {BUDGETS.map((b, i) => {
                      const on = data.budget === b.v;
                      return (
                        <motion.button key={b.v} type="button"
                          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.12 + i * 0.04 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => {
                            setData(d => ({ ...d, budget: b.v }));
                            setTimeout(() => advance(), 280);
                          }}
                          className={`w-full flex items-center justify-between gap-3 rounded-2xl p-3 text-left border shadow-sm transition-all ${on ? "bg-[#DCF8C6] border-[#25D366]" : "bg-white border-black/5 hover:border-[#25D366]/40"}`}>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-[#111B21] text-[14px] leading-tight">{b.r}</p>
                            <p className="text-[11px] text-[#667781] mt-0.5 leading-tight">{b.d}</p>
                          </div>
                          <div className={`text-lg font-bold flex-shrink-0 ${on ? "text-[#25D366]" : "text-[#9aa6ad]"}`}>{on ? "✓" : "→"}</div>
                        </motion.button>
                      );
                    })}
                  </div>
                </>
              )}

              {/* ═══════ MULTI STEP ═══════ */}
              {STEPS[cur].type === "multi" && (
                <>
                  <UserEcho prev={history[history.length - 1]} data={data} />
                  <Bubble side="in" delay={0.05}>
                    <p className="text-[15px] font-bold text-[#111B21] leading-snug">{(STEPS[cur] as any).q}</p>
                    <p className="text-[12.5px] text-[#667781] mt-1 leading-snug">{(STEPS[cur] as any).qs}</p>
                  </Bubble>
                  <div className="bg-white rounded-2xl p-3 shadow-sm border border-black/5">
                    <div className="flex flex-wrap gap-1.5">
                      {((STEPS[cur] as any).opts as string[]).map(o => {
                        const arr = ((data as any)[(STEPS[cur] as any).key] as string[]) || [];
                        const on = arr.includes(o);
                        const max = (STEPS[cur] as any).max as number;
                        const disabled = !on && arr.length >= max;
                        return (
                          <button key={o} type="button"
                            disabled={disabled}
                            onClick={() => toggleMulti((STEPS[cur] as any).key, o, max)}
                            className={`px-3 py-1.5 rounded-full text-[12.5px] font-medium border transition-all ${on ? "bg-[#25D366] text-white border-[#25D366]" : disabled ? "bg-black/5 text-black/30 border-transparent cursor-not-allowed" : "bg-white text-[#111B21] border-black/10 hover:border-[#25D366] hover:bg-[#25D366]/5"}`}>
                            {on && "✓ "}{o}
                          </button>
                        );
                      })}
                    </div>
                    <p className="text-[11px] text-[#667781] mt-2.5 pt-2.5 border-t border-black/5">
                      {(((data as any)[(STEPS[cur] as any).key] as string[]) || []).length} of {(STEPS[cur] as any).max} selected
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {(STEPS[cur] as any).optional && (
                      <button type="button" onClick={() => advance()}
                        className="flex-1 py-3 rounded-full text-[13px] font-semibold text-[#667781] bg-white border border-black/10 hover:border-black/20">
                        Skip
                      </button>
                    )}
                    <ContinueBtn
                      disabled={!(STEPS[cur] as any).optional && (((data as any)[(STEPS[cur] as any).key] as string[]) || []).length === 0}
                      onClick={() => advance()}
                      className="flex-1"
                    />
                  </div>
                </>
              )}

              {/* ═══════ CONTACT STEP ═══════ */}
              {STEPS[cur].type === "contact" && (
                <>
                  <Bubble side="in" delay={0.05}>
                    <div className="flex items-center gap-2 mb-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#FFC72C]" />
                      <p className="text-[11px] font-bold text-[#5A3A00] uppercase tracking-wider">Last step — your ₹1,000 is almost yours</p>
                    </div>
                    <p className="text-[15px] font-bold text-[#111B21] leading-snug">{(STEPS[cur] as any).q}</p>
                    <p className="text-[12.5px] text-[#667781] mt-1 leading-snug">{(STEPS[cur] as any).qs}</p>
                  </Bubble>
                  <div className="bg-white rounded-2xl p-4 shadow-sm border border-black/5 space-y-3">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[#667781] block mb-1.5">Your name</label>
                      <input ref={inputRef} type="text" placeholder="What should we call you?"
                        value={data.name || ""}
                        onChange={e => setData(d => ({ ...d, name: e.target.value }))}
                        className="w-full bg-[#F0F2F5] rounded-xl px-3 py-2.5 text-[14px] text-[#111B21] placeholder:text-[#9aa6ad] outline-none focus:ring-2 focus:ring-[#25D366]/30" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[#667781] block mb-1.5">WhatsApp number</label>
                      <input type="tel" placeholder="10-digit mobile" inputMode="numeric"
                        value={data.phone || ""}
                        onChange={e => setData(d => ({ ...d, phone: e.target.value }))}
                        onKeyDown={e => { if (e.key === "Enter") submitContact(); }}
                        className="w-full bg-[#F0F2F5] rounded-xl px-3 py-2.5 text-[14px] text-[#111B21] placeholder:text-[#9aa6ad] outline-none focus:ring-2 focus:ring-[#25D366]/30" />
                    </div>
                  </div>
                  <p className="text-[11px] text-[#667781] leading-snug px-1">
                    🔒 Your details go only to our own team — never to brokers or third parties. Gharpayy promise.
                  </p>
                  <button type="button" onClick={submitContact}
                    disabled={!data.name?.trim() || (data.phone || "").replace(/\D/g, "").length < 10}
                    className="w-full py-3.5 rounded-full text-[15px] font-bold btn-gold disabled:opacity-60 flex items-center justify-center gap-2">
                    Claim my ₹1,000 off <ArrowRight className="w-4 h-4" />
                  </button>
                </>
              )}

              {/* ═══════ REVEAL ═══════ */}
              {cur === "reveal" && (
                <>
                  <Bubble side="in" delay={0.05}>
                    <p className="text-[15px] font-bold text-[#111B21] leading-snug">
                      {elapsed > 0 && elapsed <= 45 ? "⚡ Speed bonus unlocked!" : "🎉 You're in!"}
                    </p>
                    <p className="text-[13px] text-[#111B21] leading-snug mt-1">
                      Hi <b>{data.name || "there"}</b> — we have everything we need.
                    </p>
                  </Bubble>

                  {/* Coupon card */}
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="rounded-2xl p-4 text-center text-white shadow-lg"
                    style={{ background: "linear-gradient(135deg, #1F47BA, #0A1A3D)" }}>
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#FFC72C] mb-1.5">
                      {elapsed > 0 && elapsed <= 45 ? "Speed bonus — you earned it!" : "Your exclusive coupon"}
                    </p>
                    <p className="text-[36px] font-black tracking-[5px] text-[#FFC72C] my-1" style={{ fontFamily: "var(--font-display)" }}>{COUPON}</p>
                    <p className="text-[12px] text-white/85 leading-relaxed">
                      ₹1,000 off your first month's rent
                      {elapsed > 0 && elapsed <= 45 && (
                        <><br /><span className="text-[#FFC72C] font-semibold">Filled in {elapsed}s — genuinely impressive</span></>
                      )}
                      <br />Valid 30 days · share when you book
                    </p>
                  </motion.div>

                  {/* WhatsApp send card */}
                  <div className="rounded-2xl bg-white border border-black/5 shadow-sm p-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#25D366] to-[#128C7E] flex items-center justify-center flex-shrink-0 shadow">
                        <MessageCircle className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[#667781]">Send your lead summary to</p>
                        <p className="font-bold text-[#111B21] text-[15px] leading-tight">Gharpayy team</p>
                        <p className="text-[12px] text-[#25D366] font-semibold leading-tight">{GHARPAYY_WA_DISPLAY}</p>
                      </div>
                    </div>

                    <a href={gharpayyUrl} target="_blank" rel="noopener noreferrer"
                       className="w-full py-3.5 rounded-full text-[15px] font-bold btn-gold flex items-center justify-center gap-2">
                      <Send className="w-4 h-4" /> Send to WhatsApp
                    </a>

                    <button type="button" onClick={copy}
                      className="w-full py-2.5 rounded-full text-[13px] font-semibold text-[#128C7E] bg-[#25D366]/10 hover:bg-[#25D366]/15 border border-[#25D366]/30 flex items-center justify-center gap-2">
                      <Copy className="w-3.5 h-3.5" /> {copied ? "Copied ✓" : "Copy lead summary"}
                    </button>

                    {!showCustom ? (
                      <button type="button" onClick={() => setShowCustom(true)}
                        className="w-full text-[12px] text-[#667781] hover:text-[#25D366] py-1 transition-colors">
                        Send to a different WhatsApp number →
                      </button>
                    ) : (
                      <div className="pt-2 border-t border-black/5 space-y-2">
                        <input type="tel" inputMode="numeric"
                          placeholder="Enter WhatsApp number (10 digits)"
                          value={customNum}
                          onChange={e => setCustomNum(e.target.value)}
                          className="w-full bg-[#F0F2F5] rounded-xl px-3 py-2.5 text-[13px] text-[#111B21] placeholder:text-[#9aa6ad] outline-none focus:ring-2 focus:ring-[#25D366]/30" />
                        {customUrl ? (
                          <a href={customUrl} target="_blank" rel="noopener noreferrer"
                             className="w-full py-2.5 rounded-full text-[13px] font-bold text-white bg-[#25D366] hover:bg-[#1ebe5a] flex items-center justify-center gap-2">
                            <Send className="w-3.5 h-3.5" /> Send to +{customDigits.length === 10 ? "91" + customDigits : customDigits}
                          </a>
                        ) : (
                          <p className="text-[11px] text-[#667781] text-center">Enter at least 10 digits</p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* What happens next timeline */}
                  <div className="rounded-2xl bg-white border border-black/5 shadow-sm p-4">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#667781] mb-2.5">What happens next</p>
                    <div className="space-y-2.5">
                      {[
                        { icon: <Zap className="w-3.5 h-3.5" />, t: "Within 2 min", d: "Aayushi sees your lead on WhatsApp" },
                        { icon: <Phone className="w-3.5 h-3.5" />, t: "Within 30 min", d: `Personal call to ${data.phone || "you"}` },
                        { icon: <HomeIcon className="w-3.5 h-3.5" />, t: "Same day", d: "3–5 verified rooms matched to your profile" },
                        { icon: <Check className="w-3.5 h-3.5" />, t: "Within 48h", d: "Property visit (if you want one) — zero pressure" },
                      ].map((s, i) => (
                        <div key={i} className="flex items-start gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-[#25D366]/15 text-[#128C7E] flex items-center justify-center flex-shrink-0 mt-0.5">{s.icon}</div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[12px] font-bold text-[#111B21] leading-tight">{s.t}</p>
                            <p className="text-[11.5px] text-[#667781] leading-snug mt-0.5">{s.d}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Lead summary */}
                  <details className="rounded-2xl bg-white border border-black/5 shadow-sm p-4 group">
                    <summary className="text-[12px] font-bold text-[#667781] uppercase tracking-wider cursor-pointer flex items-center justify-between">
                      Full lead profile <span className="text-[#25D366] group-open:rotate-180 transition-transform">▾</span>
                    </summary>
                    <div className="mt-3 space-y-1.5">
                      {summaryRows(data).map((r, i) => (
                        <div key={i} className="flex gap-2 py-1.5 border-b border-black/5 last:border-0 text-[12px]">
                          <span className="text-[#667781] min-w-[88px] flex-shrink-0">{r[0]}</span>
                          <span className="text-[#111B21] font-medium flex-1">{r[1]}</span>
                        </div>
                      ))}
                    </div>
                  </details>

                  <button type="button" onClick={restart}
                    className="text-[12px] text-[#667781] hover:text-[#25D366] py-2 flex items-center justify-center gap-1.5 transition-colors">
                    <RotateCcw className="w-3 h-3" /> Start a new lead
                  </button>
                </>
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────
function Bubble({ side, children, delay = 0 }: { side: "in" | "out"; children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className={`max-w-[88%] px-3.5 py-2.5 ${side === "in" ? "bubble-in self-start ml-1" : "bubble-out self-end mr-1"}`}>
      {children}
    </motion.div>
  );
}

function ContinueBtn({ onClick, disabled, className = "" }: { onClick: () => void; disabled?: boolean; className?: string }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled}
      className={`py-3.5 rounded-full text-[14.5px] font-bold btn-gold disabled:opacity-60 flex items-center justify-center gap-2 ${className}`}>
      Continue <ArrowRight className="w-4 h-4" />
    </button>
  );
}

// Echo the user's last answer as an out-bubble (chat continuity)
function UserEcho({ prev, data }: { prev?: StepId; data: Data }) {
  if (!prev) return null;
  const s = STEPS[prev];
  let label: string | null = null;
  if (prev === "welcome" && data.intent) label = L_INTENT[data.intent];
  else if (s && (s.type === "choice")) {
    const v = (data as any)[s.key];
    const opt = s.opts.find(o => o.v === v);
    if (opt) label = `${opt.e} ${opt.t}`;
  } else if (s && s.type === "text") {
    label = (data as any)[s.key];
  } else if (s && s.type === "budget") {
    const b = BUDGETS.find(x => x.v === data.budget); if (b) label = `💰 ${b.r}`;
  } else if (s && s.type === "multi") {
    const arr = (data as any)[s.key] as string[] | undefined;
    if (arr?.length) label = arr.map(x => `✓ ${x}`).join("  ");
  }
  if (!label) return null;
  return (
    <Bubble side="out">
      <p className="text-[13px] text-[#111B21] leading-snug">{label}</p>
    </Bubble>
  );
}

// Inline insight bubble per step
function ContextInsight(cur: StepId, data: Data) {
  let text: string | null = null;
  if (cur === "in_blr" || cur === "curr_stay" || cur === "arrival") text = data.story ? STORY_INSIGHT[data.story] : null;
  if (!text) return null;
  return (
    <Bubble side="in" delay={0.1}>
      <div className="flex items-start gap-2">
        <span className="text-base">💡</span>
        <p className="text-[12.5px] text-[#5A3A00] leading-snug">{text}</p>
      </div>
    </Bubble>
  );
}

function summaryRows(d: Data): [string, string][] {
  const rows: [string, string | undefined][] = [
    ["Looking for", d.intent ? L_INTENT[d.intent] : undefined],
    ["Situation", d.story ? L_STORY[d.story] : undefined],
    ["In BLR now", d.in_blr === "yes" ? "Yes, already here" : d.in_blr === "no" ? "No, coming soon" : undefined],
    ["Currently in", d.curr_stay ? L_CURR[d.curr_stay] : undefined],
    ["Notice period", d.notice ? L_NOTICE[d.notice] : undefined],
    ["Arriving", d.arrival ? L_ARRIVAL[d.arrival] : undefined],
    ["Travel", d.flight === "yes" ? "Booked ✓" : d.flight === "no" ? "Not booked" : undefined],
    ["Move-in", d.movein ? L_MOVEIN[d.movein] : undefined],
    ["Area", d.area],
    ["Budget", d.budget ? `${L_BUDGET[d.budget]}/month` : undefined],
    ["Room type", d.room ? L_ROOM[d.room] : undefined],
    ["Stay for", d.gender ? L_GENDER[d.gender] : undefined],
    ["Must-haves", d.matters?.length ? d.matters.join(" · ") : undefined],
    ["Deal-breakers", d.dealbreakers?.length ? d.dealbreakers.join(" · ") : undefined],
    ["Main concern", d.worry ? L_WORRY[d.worry] : undefined],
    ["Coupon", COUPON],
  ];
  return rows.filter(r => r[1]) as [string, string][];
}
