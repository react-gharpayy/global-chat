import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, Check, Phone, Home as HomeIcon,
  MessageCircle, Send, Zap, Copy, RotateCcw, Lock, Users, Sparkles,
} from "lucide-react";
import { ChatHeader, useTheme } from "@/components/form-ui";
import { TypingDots, ReadTick } from "@/components/typing-dots";
import { TrustRing } from "@/components/trust-ring";
// (MatchPreview intentionally not rendered on reveal — see plan)
import { MovePlanCard } from "@/components/move-plan-card";
import { matchedToday, tierPopularity, visitsBookedToday } from "@/lib/proof-seed";
import { tap, success } from "@/lib/haptics";

// ─── Gharpayy official WhatsApp ──────────────────────────────────────
const GHARPAYY_WA = "917988114576";
const GHARPAYY_WA_DISPLAY = "+91 79881 14576";

// Per-zone & student WhatsApp numbers — real lines from the Gharpayy team.
const ZONE_WA: Record<string, { wa: string; display: string; label: string; sub: string }> = {
  central: { wa: "918307396042", display: "+91 83073 96042", label: "Central zone — Koramangala",       sub: "Koramangala · S.G. Palya · Adugodi · Dairy Circle · Forum · MG Road · HSR" },
  orr:     { wa: "916363607724", display: "+91 63636 07724", label: "ORR zone — Bellandur / EcoWorld",   sub: "Marathahalli · Bellandur · Kadubeesanahalli · Sarjapur Rd · Mahadevapura" },
  east:    { wa: "916363607724", display: "+91 63636 07724", label: "East zone — Whitefield / ITPL",     sub: "Brookfield · Hoodi · Kundalahalli · ITPL · EPIP · Kadugodi · PMC" },
  north:   { wa: "918431513647", display: "+91 84315 13647", label: "North zone — Manyata",              sub: "Nagawara · Hebbal · Thanisandra · Mathikere" },
  south:   { wa: "917988114576", display: "+91 79881 14576", label: "Anywhere in Bangalore desk",        sub: "Yeshwanthpur · Peenya · UB City · Bagmane · WTC · Electronic City" },
};
const STUDENT_WA = { wa: "919118388864", display: "+91 91183 88864", label: "Student desk — all colleges", sub: "Christ · Jain · MCC · St Joseph · PES · IIM-B · RV · MSRIT" };

// ─── Types ───────────────────────────────────────────────────────────
type StepId =
  | "welcome" | "story" | "in_blr" | "curr_stay" | "notice"
  | "arrival" | "movein"
  | "zone" | "zone_areas" | "zone_radius" | "zone_special"
  | "workplace" | "budget" | "budget_exact"
  | "room" | "gender" | "name" | "matters" | "matters_other"
  | "dealbreakers" | "worry" | "visit" | "visit_when" | "contact" | "reveal";

type ChoiceOpt = { v: string; e: string; t: string; d: string };
type Step =
  | { type: "welcome" }
  | { type: "choice"; key: string; q: string; qs: string; opts: ChoiceOpt[]; optional?: boolean; next: (d: Data) => StepId }
  | { type: "text"; key: string; q: string; qs: string; ph: string; chips?: string[]; optional?: boolean; next: (d: Data) => StepId }
  | { type: "name"; q: string; qs: string; next: (d: Data) => StepId }
  | { type: "multi"; key: string; q: string; qs: string; opts: string[]; max: number; optional?: boolean; allowOther?: boolean; next: (d: Data) => StepId }
  | { type: "contact"; q: string; qs: string; next: (d: Data) => StepId }
  | { type: "reveal" };

type Data = {
  intent?: string; story?: string; in_blr?: string; curr_stay?: string;
  notice?: string; arrival?: string; movein?: string;
  zone?: string; areas?: string[]; area_other?: string; radius?: string; special_req?: string;
  workplace?: string; budget?: string; budget_exact?: string; budget_exact_custom?: string; food_pref?: string;
  room?: string; gender?: string;
  name?: string; matters?: string[]; matters_other?: string;
  dealbreakers?: string[]; worry?: string;
  visit?: string; visit_when?: string;
  phone?: string;
};

// ─── Gharpayy 5 zones (from gharpayy.com) ────────────────────────────
const ZONE_OPTS: ChoiceOpt[] = [
  { v: "east",    e: "", t: "East zone — Whitefield",        d: "ITPL, Brookfield, Marathalli area" },
  { v: "orr",     e: "", t: "ORR zone — Bellandur",          d: "Sarjapur, Embassy Tech, RMZ" },
  { v: "north",   e: "", t: "North zone — Manyata",          d: "Hebbal, Hennur, Yelahanka" },
  { v: "central", e: "", t: "Central zone — Koramangala",    d: "Indiranagar, MG Road, Domlur" },
  { v: "south",   e: "", t: "South zone — Electronic City",  d: "BTM, JP Nagar, Bommanahalli" },
];

// ─── Areas / landmarks per zone (multi-select) ───────────────────────
const ZONE_AREAS: Record<string, string[]> = {
  east:    ["Whitefield","Brookfield","Marathalli","Mahadevapura","ITPL","EPIP","Kundalahalli","Kundalahalli Gate","Varthur","Hoodi","KR Puram","Phoenix Marketcity","Graphite Lane","AECS Layout","Kadugodi","Channasandra","Hope Farm","Sadaramangala","Doddanekundi","Garudachar Palya","Borewell Road","Forum Shantiniketan","Hagadur","Immadihalli","Pattandur Agrahara"],
  orr:     ["Bellandur","Sarjapur Road","Kadubeesanahalli","Devarabeesanahalli","RMZ Ecoworld","Embassy Tech Village","Prestige Tech Park","Cessna Business Park","HSR Layout","Outer Ring Road","Kasavanahalli","Bagmane Tech Park","Iblur","Panathur","Carmelaram","Haralur Road","Sompura Gate","Wipro Sarjapur","Ecospace","Salarpuria Sattva","Bellandur Lake","Kaikondrahalli","Sakra Hospital"],
  north:   ["Nagawara","Manyata Tech Park","Hebbal","Yeshwanthpur","Hennur","Thanisandra","Jakkur","Yelahanka","Sahakar Nagar","Airport corridor","RT Nagar","Banaswadi","Kalyan Nagar","HRBR Layout","Horamavu","Kammanahalli","Bhartiya City","Yelahanka New Town","Vidyaranyapura","Aerospace Park","Kogilu","Devanahalli road","Jakkur Aerodrome"],
  central: ["Koramangala","Indiranagar","Vasanth Nagar","MG Road","Domlur","Ulsoor","Richmond Road","Cunningham Road","Lavelle Road","Frazer Town","Shivajinagar","Jeevan Bhima Nagar","HAL","New Thippasandra","CV Raman Nagar","Benson Town","Cox Town","Murphy Town","Halasuru","Brigade Road","Church Street","Commercial Street","St Marks Road","Residency Road","Langford Town"],
  south:   ["Electronic City Phase 1","Electronic City Phase 2","BTM Layout","JP Nagar","Jayanagar","Bommanahalli","Hosur Road","Bannerghatta Road","Kanakapura Road","Silk Board","Begur","Hulimavu","Arekere","Gottigere","Chandapura","Neeladri Nagar","Singasandra","Kudlu Gate","Hongasandra","Banashankari","Uttarahalli","Konanakunte","Kanakapura main road","NICE road junction"],
};

const RADIUS_OPTS: ChoiceOpt[] = [
  { v: "walk",  e: "", t: "Walking distance (~1 km)",   d: "Step out, you're there." },
  { v: "short", e: "", t: "Short ride (1–3 km)",         d: "5-min auto / scooter." },
  { v: "5km",   e: "", t: "Up to 5 km",                  d: "Quick commute, more options." },
  { v: "10km",  e: "", t: "Up to 10 km",                 d: "Wider net, best variety." },
  { v: "any",   e: "", t: "Anywhere in this zone",       d: "Show me everything." },
];

const BUDGET_EXACT_OPTS: Record<string, string[]> = {
  basic:   ["7000","8000","9000","10000","11000"],
  classic: ["12000","13000","14000","15000","16000","17000"],
  prive:   ["17000","19000","21000","23000","25000","26000"],
  luxemax: ["25000","30000","35000","40000","45000"],
};
const fmtINR = (n: string | number) => {
  const v = typeof n === "string" ? parseInt(n, 10) : n;
  if (!v || isNaN(v)) return "";
  return v >= 1000 ? `₹${(v / 1000).toFixed(v % 1000 === 0 ? 0 : 1).replace(/\.0$/, "")}k` : `₹${v}`;
};

// ─── Insights — vibe & community of each zone (no rent talk) ─────────
const ZONE_INSIGHT: Record<string, string> = {
  east:    "We host across this whole zone — Whitefield, Brookfield, Marathalli, Mahadevapura. ITPL/EPIP crowd, Phoenix on weekends. Strong waitlist, so worth locking early.",
  orr:    "Bellandur is one of our flagship zones. Lake-view mornings, ORR tech-park afternoons. Most residents here are mid/senior engineers from Wipro, Cisco, Accenture.",
  north:  "Nagawara + Manyata is our quietest, greenest zone. Walk-to-IBM-Manyata residents, Hebbal lake nearby, very low noise floors.",
  central: "Koramangala + Vasanth Nagar — founders, designers, creatives. Walk to almost everything. Limited rooms in this zone, fills fast.",
  south:  "Electronic City — Infosys/Wipro/TCS/Biocon engineers. Predictable suburban life, your weekday becomes a 5-min commute.",
};

// Story-based insight - community / what to expect
const STORY_INSIGHT: Record<string, string> = {
  newjob: "Most of our community started exactly here. We hold the room before your joining date.",
  upgrade: "9 in 10 residents came to us from a stay that didn't feel like home. We listen first, host second.",
  intern: "Flexible 2-6 month stays, no lock-in. Plenty of interns convert to full-time in the same room.",
  student: "We have student clusters near Christ, IIM-B, RV, PES, MSRIT, Jain, Mount Carmel — same-college floors when available.",
  relocate: "We pre-book before you land. Some residents move straight from the airport with one bag.",
  blr: "Quiet neighbours, working WiFi, owner who actually picks up. Boring stuff done right changes your day.",
  explore: "No pressure. You'll see real options - even imperfect ones, told honestly.",
};

// Workplace hint - empathy reply
function workplaceInsight(work?: string, zone?: string, story?: string) {
  if (!work) return null;
  const z = zone ? ZONE_OPTS.find(x => x.v === zone)?.t.split(" — ")[1] : "your zone";
  if (story === "student") {
    return `Got it — ${work}. We'll match you with same-college residents wherever possible, and keep commute under 20 min from ${z ?? "campus"}.`;
  }
  return `Got it — ${work}. We'll match places where commute stays under 25 min from ${z ?? "there"}. That's the real metric.`;
}

const BUDGET_INSIGHT: Record<string, string> = {
  basic: "BASIC tier - shared rooms, essentials, food, Wi-Fi. Most students and interns start here.",
  classic: "CLASSIC tier - larger layouts, better interiors, ventilation. Comfort that feels natural.",
  prive: "PRIVE tier - your own room, premium finishes, best food. Quiet floors, real privacy.",
  luxemax: "LUXE MAX - the flagship benchmark. Hotel-grade housekeeping, walk-to-office options.",
};

const WORRY_INSIGHT: Record<string, string> = {
  deposit: "Every paisa goes on an official Gharpayy receipt. Never a random owner's account.",
  bad_exp: "You're not the first. Most residents share their old stay's horror story on day 1 — and never have to repeat it.",
  budget_unsure: "Tell our expert your real number. We'll be honest about what fits.",
  parents: "Parents call us all the time. We can put them on a call directly if it helps.",
  visit: "We arrange visits every single day. Walk in, see the room, meet the people.",
  deciding: "We'll tell you the honest differences - even if a competitor wins on something.",
  ready: "Same-day matching. Expert calls within 30 minutes.",
};

// ─── Step engine ─────────────────────────────────────────────────────
const STEPS: Record<StepId, Step> = {
  welcome: { type: "welcome" },

  story: {
    type: "choice", key: "story",
    q: "What's your situation right now?",
    qs: "Tell me honestly. Shapes everything I'll find for you.",
    opts: [
      { v: "newjob", e: "", t: "New job offer / starting work", d: "Exciting chapter. Let's settle you right." },
      { v: "student", e: "", t: "Student starting at college / university", d: "Hostel-tired or first-time mover. Campus-zone stays ready." },
      { v: "upgrade", e: "", t: "Current stay isn't working out", d: "We know that feeling. Let's host you properly this time." },
      { v: "intern", e: "", t: "Short internship - 2 to 6 months", d: "Flexible, no lock-in." },
      { v: "relocate", e: "", t: "Moving to Bangalore from another city", d: "New city, blank slate. We'll smooth it out." },
      { v: "blr", e: "", t: "Already in BLR, want something better", d: "You deserve better than what you have now." },
      { v: "explore", e: "", t: "Just exploring options", d: "No pressure. See what's out there first." },
    ],
    next: (d) => d.story === "relocate" ? "arrival" : (d.story === "upgrade" || d.story === "blr") ? "curr_stay" : "in_blr",
  },

  in_blr: {
    type: "choice", key: "in_blr",
    q: "Are you in Bangalore right now?",
    qs: "Changes what I prioritise.",
    opts: [
      { v: "yes", e: "", t: "Yes, I'm already here", d: "Good. We can move fast." },
      { v: "no", e: "", t: "No, coming soon", d: "We'll have it ready before you land." },
    ],
    next: (d) => d.in_blr === "yes" ? "curr_stay" : "arrival",
  },

  curr_stay: {
    type: "choice", key: "curr_stay",
    q: "Where are you staying right now?",
    qs: "Helps me read your urgency.",
    opts: [
      { v: "hotel", e: "", t: "Hotel or temporary Airbnb", d: "Burning cash daily. Let's move fast." },
      { v: "pg", e: "", t: "Another shared stay", d: "Upgrading. We'll host you genuinely better." },
      { v: "flat", e: "", t: "Flat or apartment", d: "Moving to managed - less hassle." },
      { v: "friend", e: "", t: "With a friend or family", d: "Time to get your own space." },
      { v: "nowhere", e: "", t: "Not settled yet - urgent", d: "This becomes top priority. Right now." },
    ],
    next: (d) => (d.curr_stay === "hotel" || d.curr_stay === "friend" || d.curr_stay === "nowhere") ? "movein" : "notice",
  },

  notice: {
    type: "choice", key: "notice",
    q: "Have you given notice at your current place?",
    qs: "Tells me how much runway we have.",
    opts: [
      { v: "given", e: "", t: "Yes, last day coming up", d: "Good. Let's find your next home before then." },
      { v: "not_yet", e: "", t: "Not yet, haven't spoken to them", d: "No stress. We'll time this right." },
      { v: "difficult", e: "", t: "Owner is being difficult", d: "Common. We know how to navigate this." },
      { v: "free", e: "", t: "No contract, can leave anytime", d: "Flexible. Move at your pace." },
    ],
    next: () => "movein",
  },

  arrival: {
    type: "choice", key: "arrival",
    q: "When are you arriving in Bangalore?",
    qs: "Even a rough idea helps me hold the right rooms.",
    opts: [
      { v: "thisweek", e: "", t: "This week", d: "Rooms ready before you land." },
      { v: "thismonth", e: "", t: "This month", d: "Time to find something great." },
      { v: "nextmonth", e: "", t: "Next month", d: "We'll start matching today." },
      { v: "later", e: "", t: "2 to 3 months out", d: "We'll stay in touch as it gets closer." },
    ],
    next: () => "movein",
  },

  movein: {
    type: "choice", key: "movein",
    q: "When do you want to move in?",
    qs: "We work backwards from this.",
    opts: [
      { v: "now", e: "", t: "ASAP - I need it NOW", d: "Move-in ready rooms. We act today." },
      { v: "2wk", e: "", t: "Within 2 weeks", d: "Good window. We'll find and hold one." },
      { v: "month", e: "", t: "Month-end / next month start", d: "Popular window. Best selection." },
      { v: "next", e: "", t: "Next month or later", d: "Plan ahead, get the best options." },
    ],
    next: () => "zone",
  },

  zone: {
    type: "choice", key: "zone",
    q: "Which Gharpayy zone fits your day?",
    qs: "5 zones we host across. Pick the one closest to your daily life.",
    opts: ZONE_OPTS,
    next: () => "zone_areas",
  },

  zone_areas: {
    type: "multi", key: "areas", max: 5, allowOther: true,
    q: "Any specific areas or landmarks?",
    qs: "Pick up to 5 — saves us a back-and-forth call later.",
    opts: [],
    optional: true,
    next: () => "zone_radius",
  },

  zone_radius: {
    type: "choice", key: "radius",
    q: "How close do you want to be?",
    qs: "Tighter radius = fewer options but exact fit. Wider = more variety.",
    opts: RADIUS_OPTS,
    optional: true,
    next: () => "zone_special",
  },

  zone_special: {
    type: "text", key: "special_req", optional: true,
    q: "Any special requirement for the place? (Optional)",
    qs: "One line is enough. Skip if nothing comes to mind.",
    ph: "e.g. near a metro stop, parking for car, vegetarian floor…",
    next: () => "workplace",
  },

  workplace: {
    type: "text", key: "workplace",
    q: "Office or college name?",
    qs: "Exact name beats area — we match crowd + commute properly.",
    ph: "e.g. Infosys EC Phase 1, IIM Bangalore, Cisco Cessna…",
    chips: ["Infosys", "Wipro", "Cisco", "Accenture", "IBM Manyata", "Embassy Tech", "ITPL", "Christ University", "IIM Bangalore", "RV College", "PES University", "MSRIT", "Jain University", "Mount Carmel", "St. Joseph's"],
    next: () => "budget",
  },

  budget: {
    type: "choice", key: "budget",
    q: "Which Gharpayy tier feels right?",
    qs: "Pick the one closest to what you've planned. We'll match inside it.",
    opts: [
      { v: "basic",   e: "", t: "BASIC  ₹7k - ₹11k",   d: "Smart. Simple. Reliable. Shared rooms with essentials, food, Wi-Fi." },
      { v: "classic", e: "", t: "CLASSIC  ₹12k - ₹17k", d: "Comfort that feels natural. Larger layouts, better interiors, good ventilation." },
      { v: "prive",   e: "", t: "PRIVE  ₹17k - ₹26k",  d: "Your room. Your space. Your peace. Premium finishes, best food." },
      { v: "luxemax", e: "", t: "LUXE MAX  ₹25k - ₹45k", d: "The flagship benchmark. Hotel-grade housekeeping." },
    ],
    next: () => "budget_exact",
  },

  budget_exact: {
    type: "choice", key: "budget_exact",
    q: "Real monthly ceiling?",
    qs: "Honest number means we only show stays that fit. Saves the back-and-forth.",
    opts: [],
    next: () => "room",
  },

  room: {
    type: "choice", key: "room",
    q: "What kind of space do you need?",
    qs: "About what fits your life right now.",
    opts: [
      { v: "private", e: "", t: "My own room — full privacy", d: "Your own lock, your own quiet." },
      { v: "double",  e: "", t: "Double sharing — one roommate", d: "Most popular. Cost & comfort balance." },
      { v: "triple",  e: "", t: "Triple sharing — budget priority", d: "Most affordable. Roommates carefully vetted." },
      { v: "flex",    e: "", t: "Surprise me — best deal", d: "We match based on everything else." },
    ],
    next: () => "gender",
  },

  gender: {
    type: "choice", key: "gender",
    q: "This stay is for…",
    qs: "Helps us host you on the right floor.",
    opts: [
      { v: "boys", e: "👨", t: "Him / a guy", d: "Boys-only or coed floor — your call." },
      { v: "girls", e: "👩", t: "Her / a girl", d: "Girls-only or female floor — your call." },
      { v: "coed", e: "🤝", t: "Coed is fine", d: "Mixed-gender floors across our homes." },
      { v: "couple", e: "👫", t: "Me and my partner", d: "Couple-friendly homes, including 1BHKs." },
    ],
    next: () => "name",
  },

  name: {
    type: "name",
    q: "What should I call you?",
    qs: "Just your first name. Helps me address you properly when our team replies.",
    next: () => "matters",
  },

  matters: {
    type: "multi", key: "matters", max: 4, allowOther: true,
    q: "What really matters in a home?",
    qs: "Pick up to 4. These shape your daily life.",
    opts: ["Fast WiFi","Home-cooked food","AC room","Attached bathroom","Good crowd","Near metro/bus","CCTV & security","No curfew","Quiet space","Balcony","Veg-only kitchen","Gym","Daily housekeeping","Hot water 24/7","Power backup","Pet friendly"],
    next: () => "dealbreakers",
  },

  matters_other: {
    type: "text", key: "matters_other", optional: true,
    q: "Anything else that matters? (Write your own)",
    qs: "Skip if the chips above already covered it.",
    ph: "e.g. South-facing window, sound-proof walls…",
    next: () => "dealbreakers",
  },

  dealbreakers: {
    type: "multi", key: "dealbreakers", max: 3, optional: true,
    q: "Any absolute deal-breakers?",
    qs: "Things you've lived through and never want again. Pick up to 3 or skip.",
    opts: ["Owner drops in unannounced","Strict curfew before 10pm","Shared bathrooms only","No guests ever","Noisy roommates","Bad repetitive food","WiFi that keeps cutting","No parking","Too far from transport","Owner who delays deposits"],
    next: () => "worry",
  },

  worry: {
    type: "choice", key: "worry", optional: true,
    q: "What's worrying you about this search?",
    qs: "We address it before you even meet us. Not a trap.",
    opts: [
      { v: "deposit", e: "", t: "My deposit will get stuck", d: "Official receipt the moment you pay. Always." },
      { v: "bad_exp", e: "", t: "Had a rough stay before", d: "Tell us when we call — we'll make sure it's different." },
      { v: "budget_unsure", e: "", t: "Not sure I can afford the good ones", d: "Let's figure it out together." },
      { v: "parents", e: "", t: "My parents need comfort too", d: "We speak to families directly. Many parents call us first." },
      { v: "visit", e: "", t: "I need to see it in person", d: "We arrange visits every day. Zero pressure." },
      { v: "deciding", e: "", t: "Comparing a few options", d: "We'll tell you the honest differences." },
      { v: "ready", e: "", t: "Nothing - I'm ready to move fast", d: "Let's go. Options on the way today." },
    ],
    next: () => "visit",
  },

  visit: {
    type: "choice", key: "visit",
    q: (() => "")(),
    qs: "",
    opts: [],
    next: (d: Data) => d.visit === "skip" ? "contact" : "visit_when",
  } as unknown as Step,

  visit_when: {
    type: "choice", key: "visit_when",
    q: "Great - when works for you?",
    qs: "We'll lock it the moment you confirm. Reschedule anytime.",
    opts: [
      { v: "today", e: "", t: "Today / tomorrow", d: "Fastest path. Room held for you." },
      { v: "thisweek", e: "", t: "Sometime this week", d: "We'll send 2-3 slots." },
      { v: "weekend", e: "", t: "This weekend", d: "Most relaxed time to look around." },
      { v: "nextweek", e: "", t: "Next week or later", d: "We'll keep options open till then." },
    ],
    next: () => "contact",
  },

  contact: {
    type: "contact",
    q: "Last thing - your WhatsApp number.",
    qs: "So our expert can reply directly. Goes only to our internal team. Never to brokers, never sold.",
    next: () => "reveal",
  },

  reveal: { type: "reveal" },
};

// "visit" step needs dynamic question (depends on in_blr); we patch it at render time via overrides:
const VISIT_DYNAMIC = (d: Data) => {
  const inBlr = d.in_blr === "yes" || (!d.in_blr && d.story !== "relocate");
  if (inBlr) {
    return {
      q: "Want to visit a place before booking?",
      qs: "5-min tour beats 10 chats. We'll arrange it the same day if you say yes.",
      opts: [
        { v: "visit", e: "", t: "Yes - take me on a visit", d: "Walk in, see the room, meet the people." },
        { v: "prebook", e: "", t: "Skip visit - let's pre-book", d: "I trust you to host me right. Save my spot." },
        { v: "skip", e: "", t: "Not yet - call me first", d: "Talk to expert before deciding." },
      ] as ChoiceOpt[],
    };
  }
  return {
    q: "Want to pre-book before landing?",
    qs: "Many residents pre-book and walk in straight from the airport with one bag. You can also choose a virtual tour first.",
    opts: [
      { v: "prebook", e: "", t: "Yes - lock my room before I land", d: "Pre-book guarantee. Walk in straight from the airport." },
      { v: "visit", e: "", t: "Show me a virtual tour first", d: "VR walkthrough on call. Then decide." },
      { v: "skip", e: "", t: "Just call me first", d: "Talk to expert before deciding." },
    ] as ChoiceOpt[],
  };
};

// ─── Labels ──────────────────────────────────────────────────────────
const L_INTENT: Record<string,string> = { perfect:"Most homely stay", budget:"Most affordable", nearby:"Close to office/college", safe:"Safety & trust priority" };
const L_STORY: Record<string,string> = { newjob:"New job/college start", student:"Student", upgrade:"Upgrading PG", intern:"Internship", relocate:"Relocating to BLR", blr:"Already in BLR - upgrading", explore:"Exploring options" };
const L_CURR: Record<string,string> = { hotel:"Hotel (temp)", pg:"PG/hostel", flat:"Flat/apartment", friend:"Friend/family", nowhere:"URGENT - not settled" };
const L_NOTICE: Record<string,string> = { given:"Notice given", not_yet:"Not yet", difficult:"Complicated", free:"No contract" };
const L_ARRIVAL: Record<string,string> = { thisweek:"This week", thismonth:"This month", nextmonth:"Next month", later:"2-3 months out" };
const L_MOVEIN: Record<string,string> = { now:"ASAP - urgent","2wk":"Within 2 weeks", month:"Month-end", next:"Next month or later" };
const L_ZONE: Record<string,string> = { east:"East zone (Whitefield)", orr:"ORR zone (Bellandur)", north:"North zone (Manyata)", central:"Central zone (Koramangala/Vasanth Nagar)", south:"South zone (Electronic City)" };
const L_BUDGET: Record<string,string> = { basic:"BASIC ₹7k-11k", classic:"CLASSIC ₹12k-17k", prive:"PRIVE ₹17k-26k", luxemax:"LUXE MAX ₹25k-45k" };
const L_ROOM: Record<string,string> = { private:"Private room", double:"Double sharing", triple:"Triple sharing", flex:"Best deal (flexible)" };
const L_GENDER: Record<string,string> = { boys:"Male PG", girls:"Female PG", coed:"Coed", couple:"Couple" };
const L_WORRY: Record<string,string> = { deposit:"Deposit security", bad_exp:"Past bad experience", budget_unsure:"Budget uncertainty", parents:"Parents' comfort", visit:"In-person visit needed", deciding:"Comparing options", ready:"Ready to move fast" };
const L_VISIT: Record<string,string> = { visit:"Wants a visit / VR tour", prebook:"Wants to pre-book", skip:"Call first" };
const L_VISIT_WHEN: Record<string,string> = { today:"Today/tomorrow", thisweek:"This week", weekend:"This weekend", nextweek:"Next week+" };
const L_RADIUS: Record<string,string> = { walk:"Walking (~1 km)", short:"Short ride (1-3 km)", "5km":"Up to 5 km", "10km":"Up to 10 km", any:"Anywhere in zone" };
const L_FOOD: Record<string,string> = { included:"Food included", extra:"Food extra is fine" };



function buildMsg(d: Data, elapsed: number): string {
  const lines: string[] = [];
  lines.push("*GHARPAYY* New Lead");
  lines.push("————————————————");
  lines.push(`📝 *Name:* ${d.name || "-"}`);
  lines.push(`📱 *Phone:* ${d.phone || "-"}`);
  lines.push("");
  if (d.intent) lines.push(`*Looking for:* ${L_INTENT[d.intent] || d.intent}`);
  if (d.story) lines.push(`*Situation:* ${L_STORY[d.story] || d.story}`);
  if (d.in_blr) lines.push(`*In BLR:* ${d.in_blr === "yes" ? "Yes" : "No"}`);
  if (d.curr_stay) lines.push(`*Currently in:* ${L_CURR[d.curr_stay]}`);
  if (d.notice) lines.push(`*Notice:* ${L_NOTICE[d.notice]}`);
  if (d.arrival) lines.push(`*Arriving:* ${L_ARRIVAL[d.arrival]}`);
  if (d.movein) lines.push(`*Move-in:* ${L_MOVEIN[d.movein]}`);
  if (d.zone) lines.push(`🗺️ *Zone:* ${L_ZONE[d.zone]}`);
  if (d.areas?.length || d.area_other) lines.push(`*Areas:* ${[...(d.areas || []), d.area_other].filter(Boolean).join(", ")}`);
  if (d.radius) lines.push(`*Radius:* ${L_RADIUS[d.radius]}`);
  if (d.special_req) lines.push(`*Special:* ${d.special_req}`);
  if (d.workplace) lines.push(`*Workplace:* ${d.workplace}`);
  if (d.budget) {
    const ex = d.budget_exact === "flex" ? "flexible inside tier"
      : d.budget_exact === "custom" ? (d.budget_exact_custom ? `ceiling ${fmtINR(d.budget_exact_custom)}/mo` : "")
      : d.budget_exact ? `ceiling ${fmtINR(d.budget_exact)}/mo` : "";
    const food = d.food_pref ? L_FOOD[d.food_pref] : "";
    const tail = [ex, food].filter(Boolean).join(" · ");
    lines.push(`💰 *Budget:* ${L_BUDGET[d.budget]}${tail ? ` · ${tail}` : ""}`);
  }
  if (d.room) lines.push(`*Room:* ${L_ROOM[d.room]}`);
  if (d.gender) lines.push(`*For:* ${L_GENDER[d.gender]}`);
  if (d.matters?.length) lines.push(`\n*Must-haves:* ${d.matters.join(", ")}`);
  if (d.matters_other) lines.push(`*Also:* ${d.matters_other}`);
  if (d.dealbreakers?.length) lines.push(`*Deal-breakers:* ${d.dealbreakers.join(", ")}`);
  if (d.worry) lines.push(`\n*Concern:* ${L_WORRY[d.worry]}`);
  if (d.visit) lines.push(`*Next action:* ${L_VISIT[d.visit]}${d.visit_when ? ` - ${L_VISIT_WHEN[d.visit_when]}` : ""}`);
  lines.push("————————————————");
  lines.push(`via Gharpayy expert${elapsed ? ` · ${elapsed}s` : ""}`);
  lines.push("Reply within 30 mins.");
  return lines.join("\n");
}

// Echo label for a completed step
function echoFor(step: StepId, d: Data): string | null {
  const s = STEPS[step];
  if (step === "welcome") return d.intent ? L_INTENT[d.intent] : null;
  if (step === "name") return d.name ? `${d.name}` : null;
  if (step === "visit") {
    return d.visit ? `${L_VISIT[d.visit]}` : null;
  }
  if (step === "zone_areas") {
    const a = [...(d.areas || []), d.area_other].filter(Boolean);
    return a.length ? a.map(x => `✓ ${x}`).join("  ") : null;
  }
  if (step === "budget_exact") {
    if (d.budget_exact === "flex") return "Flexible inside tier";
    if (d.budget_exact === "custom") return d.budget_exact_custom ? `Ceiling ${fmtINR(d.budget_exact_custom)}/mo` : null;
    return d.budget_exact ? `Ceiling ${fmtINR(d.budget_exact)}/mo${d.food_pref ? ` · ${L_FOOD[d.food_pref]}` : ""}` : null;
  }
  if (!s) return null;
  if (s.type === "choice") {
    const v = (d as Record<string, unknown>)[s.key] as string | undefined;
    const opt = s.opts.find(o => o.v === v);
    return opt ? `${opt.e ? opt.e + " " : ""}${opt.t}` : null;
  }
  if (s.type === "text") {
    const v = (d as Record<string, unknown>)[s.key] as string | undefined;
    return v ? String(v) : null;
  }
  if (s.type === "multi") {
    const arr = (d as Record<string, unknown>)[s.key] as string[] | undefined;
    return arr?.length ? arr.map(x => `✓ ${x}`).join("  ") : null;
  }
  return null;
}

function insightFor(step: StepId, d: Data): string | null {
  if (step === "story" && d.story) return STORY_INSIGHT[d.story] || null;
  if (step === "zone" && d.zone) return ZONE_INSIGHT[d.zone] || null;
  if (step === "workplace" && d.workplace) return workplaceInsight(d.workplace, d.zone, d.story);
  if (step === "budget" && d.budget) return BUDGET_INSIGHT[d.budget] || null;
  if (step === "worry" && d.worry) return WORRY_INSIGHT[d.worry] || null;
  return null;
}

// Live social-proof line for completed steps
function proofFor(step: StepId, d: Data): string | null {
  if (step === "zone" && d.zone) return `${matchedToday(d.zone)} people from your zone matched this week.`;
  if (step === "budget" && d.budget && d.zone) return `Most popular tier in your zone — ${tierPopularity(d.zone, d.budget)}% pick this.`;
  if (step === "visit" && d.visit === "visit") return `${visitsBookedToday()} visits already booked today.`;
  return null;
}

// Question label for HistoryStep (handles dynamic visit step)
function questionFor(step: StepId, d: Data): string | null {
  if (step === "visit") return VISIT_DYNAMIC(d).q;
  const s = STEPS[step];
  if (!s || s.type === "welcome" || s.type === "reveal") return null;
  return "q" in s ? s.q : null;
}

// ═══════════════════════════════════════════════════════════════════════
//  COMPONENT
// ═══════════════════════════════════════════════════════════════════════
// Total visible steps (rough — for "X of Y")
const TOTAL_STEPS = 14;

// ─── Auto-advance hook ───────────────────────────────────────────────
function useAutoAdvance(value: unknown, ready: boolean, fn: () => void, ms = 900) {
  useEffect(() => {
    if (!ready) return;
    const t = setTimeout(fn, ms);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, ready]);
}

export default function GharpayyForm() {
  const { theme, toggle: toggleTheme } = useTheme();
  const [data, setData] = useState<Data>({});
  const [history, setHistory] = useState<StepId[]>([]);
  const [future, setFuture] = useState<StepId[]>([]);
  const [cur, setCur] = useState<StepId>("welcome");
  const [tStart, setTStart] = useState<number | null>(null);
  const [now, setNow] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [customNum, setCustomNum] = useState("");
  const [showCustom, setShowCustom] = useState(false);
  const [copied, setCopied] = useState(false);
  const [typing, setTyping] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!tStart || cur === "welcome" || cur === "reveal") return;
    const id = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(id);
  }, [tStart, cur]);

  // 60-tick countdown where each tick = 2 real seconds (relaxed pacing).
  const [secsLeft, setSecsLeft] = useState(60);
  useEffect(() => {
    if (!tStart || cur === "welcome" || cur === "reveal") return;
    const id = setInterval(() => setSecsLeft(s => (s > 0 ? s - 1 : 0)), 2000);
    return () => clearInterval(id);
  }, [tStart, cur]);

  // Aayushi "typing" before each new question
  useEffect(() => {
    if (cur === "welcome" || cur === "reveal") { setTyping(false); return; }
    setTyping(true);
    const t = setTimeout(() => setTyping(false), 700);
    return () => clearTimeout(t);
  }, [cur]);

  useEffect(() => {
    const s = STEPS[cur];
    if (s.type === "text" || s.type === "contact" || s.type === "name") {
      setTimeout(() => inputRef.current?.focus(), 800);
    }
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }), 800);
  }, [cur, history.length]);

  void now;
  const elapsedSec = tStart ? Math.round((Date.now() - tStart) / 1000) : 0;
  const fullness = Math.min(100, Math.round((history.length / 16) * 100));
  const stepNumber = Math.min(TOTAL_STEPS, history.length + 1);

  const advance = useCallback((nextId?: StepId) => {
    const s = STEPS[cur];
    let nxt: StepId | null = nextId || null;
    if (!nxt) {
      if (s.type === "welcome" || s.type === "reveal") nxt = null;
      else nxt = s.next(data);
    }
    if (!nxt) return;
    setHistory(h => [...h, cur]);
    setFuture([]);
    setCur(nxt);
  }, [cur, data]);

  const back = useCallback(() => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setHistory(h => h.slice(0, -1));
    setFuture(f => [cur, ...f]);
    setCur(prev);
  }, [history, cur]);

  const forward = useCallback(() => {
    if (future.length === 0) return;
    if (cur === "contact" && (data.phone || "").replace(/\D/g, "").length < 10) return;
    const next = future[0];
    setFuture(f => f.slice(1));
    setHistory(h => [...h, cur]);
    setCur(next);
  }, [future, cur, data.phone]);

  // Keyboard nav
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey && e.key === "ArrowLeft") { e.preventDefault(); back(); }
      if (e.altKey && e.key === "ArrowRight") { e.preventDefault(); forward(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [back, forward]);

  const setIntent = (v: string) => {
    tap();
    setData(d => ({ ...d, intent: v }));
    if (!tStart) setTStart(Date.now());
    setHistory(h => [...h, "welcome"]);
    setFuture([]);
    setCur("story");
  };

  const pickChoice = (key: string, v: string) => {
    tap();
    setData(d => {
      const next = { ...d, [key]: v };
      const s = STEPS[cur];
      if (s.type === "choice") {
        setTimeout(() => {
          setHistory(h => [...h, cur]);
          setFuture([]);
          setCur(s.next(next));
        }, 220);
      }
      return next;
    });
  };

  // Special pick for the dynamic visit step
  const pickVisit = (v: string) => {
    tap();
    setData(d => {
      const next = { ...d, visit: v };
      setTimeout(() => {
        setHistory(h => [...h, "visit"]);
        setFuture([]);
        setCur(v === "skip" ? "contact" : "visit_when");
      }, 220);
      return next;
    });
  };

  const toggleMulti = (key: string, v: string, max: number) => {
    tap();
    setData(d => {
      const arr = (d as Record<string, unknown>)[key] as string[] | undefined || [];
      const i = arr.indexOf(v);
      if (i > -1) return { ...d, [key]: arr.filter(x => x !== v) };
      if (arr.length >= max) return d;
      return { ...d, [key]: [...arr, v] };
    });
  };

  const submitName = () => {
    if (!data.name?.trim()) return;
    tap();
    setHistory(h => [...h, "name"]);
    setFuture([]);
    setCur("matters");
  };

  const submitContact = () => {
    if ((data.phone || "").replace(/\D/g, "").length < 10) return;
    setElapsed(tStart ? Math.round((Date.now() - tStart) / 1000) : 0);
    setHistory(h => [...h, "contact"]);
    setFuture([]);
    setSubmitting(true);
  };

  const finishSubmit = useCallback(() => {
    success();
    setSubmitting(false);
    setCur("reveal");
  }, []);

  const restart = () => {
    setData({}); setHistory([]); setFuture([]); setCur("welcome"); setTStart(null); setElapsed(0);
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
      return true;
    } catch { return false; }
  };

  const [autoCopied, setAutoCopied] = useState<null | boolean>(null);
  useEffect(() => {
    if (cur !== "reveal") { setAutoCopied(null); return; }
    let cancelled = false;
    (async () => {
      try {
        await navigator.clipboard.writeText(waMessage);
        if (!cancelled) { setAutoCopied(true); setCopied(true); }
      } catch {
        if (!cancelled) setAutoCopied(false);
      }
    })();
    return () => { cancelled = true; };
  }, [cur, waMessage]);

  const isInteractive = cur !== "welcome" && cur !== "reveal";
  const subtitle = cur === "welcome"
    ? "Online now · usually replies in minutes"
    : cur === "reveal"
      ? "✓ Lead received - expert notified"
      : `Online · listening (${elapsedSec}s)`;

  // Compute current visit dynamic content
  const visitDyn = VISIT_DYNAMIC(data);

  return (
    <div className="min-h-[100dvh] w-full flex justify-center" style={{ background: "var(--brand-navy)" }}>
      <div className="w-full max-w-md relative min-h-[100dvh] flex flex-col overflow-hidden wa-chat-bg">
        <ChatHeader
          onBack={isInteractive && history.length > 0 && !submitting ? back : undefined}
          onForward={isInteractive && future.length > 0 && !submitting ? forward : undefined}
          subtitle={subtitle}
          waNumber={GHARPAYY_WA}
          waDisplay={GHARPAYY_WA_DISPLAY}
          zone={data.zone}
          showTicker={isInteractive}
          theme={theme}
          onToggleTheme={toggleTheme}
        />

        {isInteractive && (
          <div className="px-3 py-1.5 flex items-center gap-2 border-b border-black/5" style={{ background: "var(--gp-surface)" }}>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold tabular-nums"
              style={{ background: secsLeft > 10 ? "rgba(37,211,102,0.14)" : "rgba(229,57,53,0.14)", color: secsLeft > 10 ? "#128C7E" : "#C62828" }}>
              ⏱ 0:{String(secsLeft).padStart(2, "0")}
            </span>
            <div className="flex-1 h-[5px] rounded-full bg-black/10 overflow-hidden">
              <motion.div className="h-full bg-gradient-to-r from-[#25D366] to-[#128C7E]"
                initial={false}
                animate={{ width: `${fullness}%` }}
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }} />
            </div>
            <span className="text-[10.5px] font-semibold" style={{ color: "var(--gp-text-muted)" }}>
              {fullness < 30 ? "warming up" : fullness < 60 ? "getting closer" : fullness < 90 ? "almost there" : "one tap away"}
            </span>
          </div>
        )}

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4">
          <div className="flex flex-col gap-2.5">

            <div className="flex justify-center mb-1">
              <span className="px-3 py-1 rounded-full text-[11px] font-medium text-[#54656F] bg-white/85 shadow-sm">Today</span>
            </div>

            {isInteractive && (
              <div className="self-center max-w-[92%] px-3 py-1.5 rounded-full bg-[#FFF6D9] border border-[#FFC72C]/40 text-[10.5px] text-[#5A3A00] font-medium flex items-center gap-1.5 mb-1">
                <Zap className="w-3 h-3 text-[#E5A800] fill-[#FFC72C]" />
                The more you share, the faster our expert prioritises your stay.
              </div>
            )}

            {/* History */}
            {history.map((step, idx) => (
              <HistoryStep key={`${step}-${idx}`} step={step} data={data} />
            ))}

            {/* WELCOME */}
            {cur === "welcome" && (
              <>
                <Bubble side="in" delay={0.05}>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#667781] mb-1">Gharpayy expert</p>
                  <p className="text-[15px] font-semibold text-[#111B21] leading-snug">Hey 👋</p>
                  <p className="text-[14px] text-[#111B21] leading-snug mt-1">
                    This isn't a form. It's a chat with me.
                  </p>
                  <p className="text-[14px] text-[#111B21] leading-snug mt-1.5">
                    Tell me <b>where</b> in Bangalore you want to live, <b>from when</b>, and <b>how soon</b> - I'll prioritise your case and pull the best stay for you. Whatever you're looking for, we'll try to get it.
                  </p>
                </Bubble>
                <Bubble side="in" delay={0.22}>
                  <p className="text-[14px] text-[#111B21] leading-snug font-medium">
                    So… how can I help you with your stay-hunt in Bangalore?
                  </p>
                  <p className="text-[12px] text-[#667781] leading-snug mt-1">
                    Pick whatever fits. We'll go from there.
                  </p>
                </Bubble>

                <div className="space-y-2 mt-1">
                  {[
                    { v: "perfect", t: "I want the most homely stay possible", d: "Feel at home, not just have a room." },
                    { v: "budget",  t: "The most affordable option in BLR",   d: "Best value is what I care about." },
                    { v: "nearby",  t: "Close to my office or college",        d: "My commute is killing me." },
                    { v: "safe",    t: "Safe, trustworthy, family-approved",   d: "Safety matters most." },
                  ].map((o, i) => (
                    <motion.button key={o.v} type="button"
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + i * 0.06 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setIntent(o.v)}
                      className="w-full flex items-center gap-3 rounded-2xl p-3 text-left bg-white border border-black/5 shadow-sm hover:shadow-md hover:border-[#25D366] active:scale-95 transition-all group">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-[#111B21] text-[13.5px] leading-tight">{o.t}</p>
                        <p className="text-[11px] text-[#667781] mt-0.5 leading-tight">{o.d}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[#25D366] opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all flex-shrink-0" />
                    </motion.button>
                  ))}
                </div>

                <p className="text-center text-[11px] text-[#667781] mt-3 italic px-4 leading-snug">
                  Less is more. One room. One promise. Done right.
                </p>
              </>
            )}

            {/* SUBMITTING — trust ring */}
            {submitting && <TrustRing onDone={finishSubmit} />}

            {/* TYPING — Aayushi composing */}
            <AnimatePresence>
              {typing && !submitting && cur !== "welcome" && cur !== "reveal" && <TypingDots key="typing" />}
            </AnimatePresence>

            {/* ACTIVE STEP */}
            {!typing && !submitting && (
            <AnimatePresence mode="popLayout">
              <motion.div
                key={cur}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col gap-2.5"
              >
                {/* CHOICE */}
                {STEPS[cur].type === "choice" && cur !== "visit" && cur !== "budget_exact" && (
                  <ChoiceBlock
                    step={STEPS[cur] as Extract<Step, { type: "choice" }>}
                    selected={(data as Record<string, unknown>)[(STEPS[cur] as Extract<Step, { type: "choice" }>).key] as string | undefined}
                    onPick={(v) => pickChoice((STEPS[cur] as Extract<Step, { type: "choice" }>).key, v)}
                    onSkip={() => advance()}
                    stepNumber={stepNumber}
                    total={TOTAL_STEPS}
                  />
                )}

                {/* DYNAMIC VISIT */}
                {cur === "visit" && (
                  <ChoiceBlock
                    step={{ type: "choice", key: "visit", q: visitDyn.q, qs: visitDyn.qs, opts: visitDyn.opts, next: () => "visit_when" }}
                    selected={data.visit}
                    onPick={pickVisit}
                    onSkip={() => { setHistory(h => [...h, "visit"]); setFuture([]); setCur("contact"); }}
                    stepNumber={stepNumber}
                    total={TOTAL_STEPS}
                  />
                )}

                {/* BUDGET EXACT (per-tier chips + custom + food toggle) */}
                {cur === "budget_exact" && (
                  <BudgetExactBlock
                    data={data}
                    setData={setData}
                    onAdvance={() => advance()}
                    stepNumber={stepNumber}
                    total={TOTAL_STEPS}
                  />
                )}


                {/* TEXT */}
                {STEPS[cur].type === "text" && (() => {
                  const s = STEPS[cur] as Extract<Step, { type: "text" }>;
                  const val = (data as Record<string, unknown>)[s.key] as string | undefined;
                  return (
                    <TextBlock
                      step={s}
                      val={val}
                      inputRef={inputRef}
                      onChange={v => setData(d => ({ ...d, [s.key]: v }))}
                      onAdvance={() => advance()}
                      stepNumber={stepNumber}
                      total={TOTAL_STEPS}
                    />
                  );
                })()}

                {/* NAME (mid-flow, friendlier than contact form) */}
                {STEPS[cur].type === "name" && (
                  <NameBlock
                    q={(STEPS[cur] as Extract<Step, { type: "name" }>).q}
                    qs={(STEPS[cur] as Extract<Step, { type: "name" }>).qs}
                    name={data.name}
                    inputRef={inputRef}
                    onChange={v => setData(d => ({ ...d, name: v }))}
                    onSubmit={submitName}
                    stepNumber={stepNumber}
                    total={TOTAL_STEPS}
                  />
                )}

                {/* MULTI */}
                {STEPS[cur].type === "multi" && (() => {
                  const s = STEPS[cur] as Extract<Step, { type: "multi" }>;
                  const arr = ((data as Record<string, unknown>)[s.key] as string[]) || [];
                  const isAreas = cur === "zone_areas";
                  const opts = isAreas ? (ZONE_AREAS[data.zone || ""] || []) : s.opts;
                  const otherTarget: StepId | null = cur === "matters" ? "matters_other" : null;
                  return (
                    <MultiBlock
                      step={s}
                      arr={arr}
                      opts={opts}
                      isAreas={isAreas}
                      areaOther={data.area_other || ""}
                      setAreaOther={v => setData(d => ({ ...d, area_other: v }))}
                      onToggle={v => toggleMulti(s.key, v, s.max)}
                      onWriteOther={otherTarget ? () => { setHistory(h => [...h, cur]); setFuture([]); setCur(otherTarget); } : undefined}
                      onAdvance={() => advance()}
                      stepNumber={stepNumber}
                      total={TOTAL_STEPS}
                    />
                  );
                })()}

                {/* CONTACT (phone only - name already collected) */}
                {STEPS[cur].type === "contact" && (
                  <>
                    <Bubble side="in" delay={0.05}>
                      <p className="text-[15px] font-bold text-[#111B21] leading-snug">{(STEPS[cur] as Extract<Step, { type: "contact" }>).q}</p>
                      <p className="text-[12.5px] text-[#667781] mt-1 leading-snug">{(STEPS[cur] as Extract<Step, { type: "contact" }>).qs}</p>
                    </Bubble>
                    <p className="text-[11px] text-[#667781] leading-snug px-1 flex items-start gap-1.5">
                      <Lock className="w-3 h-3 text-[#25D366] mt-0.5 flex-shrink-0" />
                      Goes only to our internal team. Never to brokers, never sold.
                    </p>
                    <div className="bg-white rounded-2xl p-4 shadow-sm border border-black/5 space-y-3">
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-[#667781] block mb-1.5">WhatsApp number</label>
                        <div className="flex items-center gap-2 bg-[#F0F2F5] rounded-xl px-3 py-2.5 focus-within:ring-2 focus-within:ring-[#25D366]/30">
                          <span className="text-[14px] text-[#667781] font-semibold">+91</span>
                          <input ref={inputRef} type="tel" placeholder="98765 43210" inputMode="numeric"
                            value={(() => {
                              const d = (data.phone || "").replace(/\D/g, "").replace(/^91/, "").slice(0, 10);
                              return d.length > 5 ? `${d.slice(0,5)} ${d.slice(5)}` : d;
                            })()}
                            onChange={e => {
                              const digits = e.target.value.replace(/\D/g, "").replace(/^91/, "").slice(0, 10);
                              setData(d => ({ ...d, phone: digits }));
                            }}
                            onKeyDown={e => { if (e.key === "Enter") submitContact(); }}
                            className="flex-1 bg-transparent text-[14px] text-[#111B21] placeholder:text-[#9aa6ad] outline-none" />
                        </div>
                      </div>
                    </div>
                    <button type="button" onClick={submitContact}
                      disabled={(data.phone || "").replace(/\D/g, "").length < 10}
                      className="w-full py-3.5 rounded-full text-[15px] font-bold btn-gold disabled:opacity-60 flex items-center justify-center gap-2">
                      Send to expert <ArrowRight className="w-4 h-4" />
                    </button>
                  </>
                )}

                {/* REVEAL */}
                {cur === "reveal" && (
                  <>
                    <Bubble side="in" delay={0.05}>
                      <p className="text-[15px] font-bold text-[#111B21] leading-snug">
                        Got it{data.name ? `, ${data.name}` : ""}.
                      </p>
                      <p className="text-[13px] text-[#111B21] leading-snug mt-1">
                        You're #{1 + (matchedToday(data.zone) % 4)} in Aayushi's queue. We have everything we need to start.
                      </p>
                    </Bubble>

                    {autoCopied !== null && (
                      <div className={`self-center max-w-[94%] px-3 py-2 rounded-full text-[11.5px] font-semibold flex items-center gap-1.5 ${autoCopied ? "bg-[#25D366]/10 text-[#128C7E] border border-[#25D366]/30" : "bg-amber-50 text-amber-800 border border-amber-200"}`}>
                        <Copy className="w-3 h-3" />
                        {autoCopied ? "Brief auto-copied — paste anywhere ✓" : "Tap copy below to grab your brief"}
                      </div>
                    )}

                    <MovePlanCard
                      name={data.name}
                      zone={data.zone}
                      tier={data.budget}
                      moveIn={data.movein ? L_MOVEIN[data.movein] : undefined}
                      vibes={[
                        ...(data.matters ?? []).slice(0, 3),
                        ...(data.gender ? [L_GENDER[data.gender]] : []),
                      ]}
                    />

                    <div className="rounded-2xl bg-white border border-black/5 shadow-sm p-4 space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#25D366] to-[#128C7E] flex items-center justify-center flex-shrink-0 shadow">
                          <MessageCircle className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-[#667781]">Send your brief to</p>
                          <p className="font-bold text-[#111B21] text-[15px] leading-tight">Gharpayy team</p>
                          <p className="text-[12px] text-[#25D366] font-semibold leading-tight">{GHARPAYY_WA_DISPLAY}</p>
                        </div>
                      </div>

                      <a href={gharpayyUrl} target="_blank" rel="noopener noreferrer"
                         className="w-full py-3.5 rounded-full text-[15px] font-bold btn-gold flex items-center justify-center gap-2">
                        <Send className="w-4 h-4" /> Send on WhatsApp
                      </a>

                      <button type="button" onClick={copy}
                        title={autoCopied ? "Already on your clipboard" : ""}
                        className="w-full py-2.5 rounded-full text-[13px] font-semibold text-[#128C7E] bg-[#25D366]/10 hover:bg-[#25D366]/15 border border-[#25D366]/30 flex items-center justify-center gap-2">
                        <Copy className="w-3.5 h-3.5" /> {copied ? (autoCopied ? "Copy again" : "Copied ✓") : "Copy my brief"}
                      </button>

                      {!showCustom ? (
                        <button type="button" onClick={() => setShowCustom(true)}
                          className="w-full text-[12px] text-[#667781] hover:text-[#25D366] py-1 transition-colors">
                          Send to a different number →
                        </button>
                      ) : (
                        <div className="pt-2 border-t border-black/5 space-y-2">
                          <input type="tel" inputMode="numeric"
                            placeholder="WhatsApp number (10 digits)"
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

                    {/* Zone-specific WhatsApp picker */}
                    <div className="rounded-2xl bg-white border border-black/5 shadow-sm p-4">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#667781] mb-1">Reach your zone directly</p>
                      <p className="text-[12px] text-[#667781] leading-snug mb-3">Each Gharpayy zone has its own expert on WhatsApp. Tap the one that fits — your full brief is pre-filled.</p>
                      <div className="space-y-2">
                        {(data.story === "student" ? [{ key: "student", ...STUDENT_WA }] : [])
                          .concat(Object.entries(ZONE_WA).map(([k, v]) => ({ key: k, ...v })))
                          .map((z) => {
                            const url = `https://wa.me/${z.wa}?text=${encodeURIComponent(waMessage)}`;
                            const isYours = data.zone && z.key === data.zone;
                            const isStudent = z.key === "student";
                            return (
                              <a key={z.key} href={url} target="_blank" rel="noopener noreferrer"
                                 className={`flex items-center gap-3 rounded-xl p-2.5 border transition-all ${isYours || isStudent ? "border-[#25D366] bg-[#25D366]/5" : "border-black/5 hover:border-[#25D366]/40 bg-white"}`}>
                                <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${isStudent ? "bg-gradient-to-br from-[#1F47BA] to-[#0F2F8A]" : "bg-gradient-to-br from-[#25D366] to-[#128C7E]"}`}>
                                  <MessageCircle className="w-4 h-4 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-[12.5px] font-bold text-[#111B21] leading-tight truncate">
                                    {z.label}{isYours ? "  ·  your zone" : ""}
                                  </p>
                                  <p className="text-[10.5px] text-[#667781] leading-tight truncate">{z.sub}</p>
                                  <p className="text-[11px] text-[#128C7E] font-semibold leading-tight mt-0.5">{z.display}</p>
                                </div>
                                <Send className="w-4 h-4 text-[#25D366] flex-shrink-0" />
                              </a>
                            );
                          })}
                      </div>
                    </div>

                    <div className="rounded-2xl bg-white border border-black/5 shadow-sm p-4">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#667781] mb-2.5">What happens next</p>
                      <div className="space-y-2.5">
                        {[
                          { icon: <Zap className="w-3.5 h-3.5" />, t: "Within 2 min", d: "Expert sees your brief on WhatsApp" },
                          { icon: <Phone className="w-3.5 h-3.5" />, t: "Within 30 min", d: `Personal call to ${data.phone || "you"}` },
                          { icon: <HomeIcon className="w-3.5 h-3.5" />, t: "Same day", d: "Matched stays from your zone" },
                          { icon: <Check className="w-3.5 h-3.5" />, t: data.visit === "prebook" ? "Within 24h" : "Within 48h",
                            d: data.visit === "prebook" ? "Pre-booking confirmed" : data.visit === "visit" ? "Visit / VR tour scheduled" : "Call to plan next step" },
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

                    <details className="rounded-2xl bg-white border border-black/5 shadow-sm p-4 group">
                      <summary className="text-[12px] font-bold text-[#667781] uppercase tracking-wider cursor-pointer flex items-center justify-between">
                        Full brief <span className="text-[#25D366] group-open:rotate-180 transition-transform">▾</span>
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
                      <RotateCcw className="w-3 h-3" /> Start over
                    </button>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
            )}

            <div ref={bottomRef} className="h-2" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Question card: clean Q + sub (no counter) ──────────────────────
function QuestionCard({ q, qs }: { q: string; qs: string; stepNumber?: number; total?: number }) {
  return (
    <Bubble side="in" delay={0.05}>
      <p className="text-[16.5px] font-bold text-[#111B21] leading-snug" style={{ fontFamily: "var(--font-display)" }}>{q}</p>
      {qs && <p className="text-[12.5px] text-[#667781] mt-1.5 leading-snug">{qs}</p>}
    </Bubble>
  );
}

const ABCD = ["A", "B", "C", "D", "E", "F", "G", "H"];

// ─── Reusable choice block ──────────────────────────────────────────
function ChoiceBlock({
  step, selected, onPick, onSkip, stepNumber, total,
}: {
  step: Extract<Step, { type: "choice" }>;
  selected: string | undefined;
  onPick: (v: string) => void;
  onSkip: () => void;
  stepNumber?: number;
  total?: number;
}) {
  return (
    <>
      <QuestionCard q={step.q} qs={step.qs} stepNumber={stepNumber} total={total} />
      <p className="text-[9.5px] font-bold uppercase tracking-wider px-1 text-[#667781]">Tap to choose</p>
      <div className="space-y-2">
        {step.opts.map((o, i) => {
          const on = selected === o.v;
          return (
            <motion.button key={o.v} type="button"
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onPick(o.v)}
              data-step={step.key}
              data-answer-key={o.v}
              aria-label={`${ABCD[i]}: ${o.t}`}
              className={`w-full flex items-center gap-3 rounded-2xl p-3 min-h-[56px] text-left border shadow-sm transition-all ${on ? "bg-[#DCF8C6] border-[#25D366]" : "bg-white border-black/5 hover:border-[#25D366]/40"}`}>
              <span className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-extrabold ${on ? "bg-[#25D366] text-white" : "bg-black/5 text-[#667781]"}`}>
                {ABCD[i]}
              </span>
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
      {step.optional && <SkipRow onSkip={onSkip} />}
    </>
  );
}

// ─── HistoryStep: replays a completed Q+A as static bubbles ──────────
function HistoryStep({ step, data }: { step: StepId; data: Data }) {
  const echo = echoFor(step, data);
  const insight = insightFor(step, data);
  const proof = proofFor(step, data);

  if (step === "welcome") {
    return echo ? (
      <Bubble side="out">
        <p className="text-[13px] text-[#111B21] leading-snug">{echo}<ReadTick /></p>
      </Bubble>
    ) : null;
  }

  const q = questionFor(step, data);

  return (
    <>
      {q && (
        <Bubble side="in">
          <p className="text-[13.5px] text-[#111B21] leading-snug">{q}</p>
        </Bubble>
      )}
      {echo && (
        <Bubble side="out">
          <p className="text-[13px] text-[#111B21] leading-snug">{echo}<ReadTick /></p>
        </Bubble>
      )}
      {insight && (
        <Bubble side="in">
          <p className="text-[12.5px] text-[#5A3A00] leading-snug flex items-start gap-1.5">
            <span className="opacity-70">💡</span>
            <span>{insight}</span>
          </p>
        </Bubble>
      )}
      {proof && (
        <div className="self-center max-w-[92%] px-3 py-1.5 rounded-full bg-[#1F47BA]/8 border border-[#1F47BA]/20 text-[10.5px] text-[#1F47BA] font-semibold flex items-center gap-1.5">
          {proof}
        </div>
      )}
    </>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────
function Bubble({ side, children, delay = 0 }: { side: "in" | "out"; children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
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

function SkipRow({ onSkip }: { onSkip: () => void }) {
  return (
    <button type="button" onClick={onSkip}
      className="self-center text-[11.5px] text-[#667781] hover:text-[#25D366] py-1.5 px-3 rounded-full transition-colors">
      Rather not say - skip →
    </button>
  );
}

function summaryRows(d: Data): [string, string][] {
  const rows: [string, string | undefined][] = [
    ["Looking for", d.intent ? L_INTENT[d.intent] : undefined],
    ["Situation", d.story ? L_STORY[d.story] : undefined],
    ["In BLR now", d.in_blr === "yes" ? "Yes, already here" : d.in_blr === "no" ? "No, coming soon" : undefined],
    ["Currently in", d.curr_stay ? L_CURR[d.curr_stay] : undefined],
    ["Notice", d.notice ? L_NOTICE[d.notice] : undefined],
    ["Arriving", d.arrival ? L_ARRIVAL[d.arrival] : undefined],
    ["Move-in", d.movein ? L_MOVEIN[d.movein] : undefined],
    ["Zone", d.zone ? L_ZONE[d.zone] : undefined],
    ["Areas", [...(d.areas || []), d.area_other].filter(Boolean).join(", ") || undefined],
    ["Radius", d.radius ? L_RADIUS[d.radius] : undefined],
    ["Special", d.special_req],
    ["Workplace", d.workplace],
    ["Tier", d.budget ? `${L_BUDGET[d.budget]}/month` : undefined],
    ["Ceiling", d.budget_exact === "flex" ? "Flexible inside tier" : d.budget_exact === "custom" ? (d.budget_exact_custom ? `${fmtINR(d.budget_exact_custom)}/mo` : undefined) : d.budget_exact ? `${fmtINR(d.budget_exact)}/mo` : undefined],
    ["Food", d.food_pref ? L_FOOD[d.food_pref] : undefined],
    ["Room", d.room ? L_ROOM[d.room] : undefined],
    ["For", d.gender ? L_GENDER[d.gender] : undefined],
    ["Name", d.name],
    ["Must-haves", d.matters?.join(", ")],
    ["Also wants", d.matters_other],
    ["Deal-breakers", d.dealbreakers?.join(", ")],
    ["Concern", d.worry ? L_WORRY[d.worry] : undefined],
    ["Next action", d.visit ? `${L_VISIT[d.visit]}${d.visit_when ? ` (${L_VISIT_WHEN[d.visit_when]})` : ""}` : undefined],
    ["Phone", d.phone],
  ];
  return rows.filter(([, v]) => v).map(([k, v]) => [k, v as string]);
}

// ─── Auto-advance pill (saved · moving on…) ──────────────────────────
function AutoAdvancePill({ label = "Saved · moving on…" }: { label?: string }) {
  return (
    <div className="self-center px-3 py-1.5 rounded-full bg-[#25D366]/10 border border-[#25D366]/30 text-[11px] font-semibold text-[#128C7E] flex items-center gap-1.5">
      <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse" />
      {label}
    </div>
  );
}

// ─── BUDGET EXACT block ──────────────────────────────────────────────
function BudgetExactBlock({
  data, setData, onAdvance, stepNumber, total,
}: {
  data: Data;
  setData: React.Dispatch<React.SetStateAction<Data>>;
  onAdvance: () => void;
  stepNumber?: number;
  total?: number;
}) {
  const tier = data.budget || "basic";
  const opts = BUDGET_EXACT_OPTS[tier] || [];
  const tierLabel = L_BUDGET[tier] || "this tier";
  const isCustom = data.budget_exact === "custom";
  const ready = !!data.budget_exact && (!isCustom || (data.budget_exact_custom || "").length >= 3);
  useAutoAdvance(`${data.budget_exact}|${data.budget_exact_custom}|${data.food_pref}`, ready, onAdvance, isCustom ? 1100 : 800);
  return (
    <>
      <QuestionCard q={`Real monthly ceiling inside ${tierLabel}?`}
        qs="Honest number means we only show stays that fit. One tap saves a 20-min back-and-forth call later."
        stepNumber={stepNumber} total={total} />
      <p className="text-[9.5px] font-bold uppercase tracking-wider px-1 text-[#667781]">Tap your number</p>
      <div className="bg-white rounded-2xl p-3 shadow-sm border border-black/5">
        <div className="flex flex-wrap gap-1.5">
          {opts.map(n => {
            const on = data.budget_exact === n;
            return (
              <button key={n} type="button"
                onClick={() => { tap(); setData(d => ({ ...d, budget_exact: n, budget_exact_custom: undefined })); }}
                className={`px-3 py-2 rounded-full text-[13px] font-semibold border transition-all ${on ? "bg-[#25D366] text-white border-[#25D366]" : "bg-white text-[#111B21] border-black/10 hover:border-[#25D366] hover:bg-[#25D366]/5"}`}>
                {fmtINR(n)}
              </button>
            );
          })}
          <button type="button"
            onClick={() => { tap(); setData(d => ({ ...d, budget_exact: "flex", budget_exact_custom: undefined })); }}
            className={`px-3 py-2 rounded-full text-[13px] font-semibold border transition-all ${data.budget_exact === "flex" ? "bg-[#25D366] text-white border-[#25D366]" : "bg-white text-[#128C7E] border-[#25D366]/40 hover:bg-[#25D366]/10"}`}>
            Flexible inside tier
          </button>
          <button type="button"
            onClick={() => { tap(); setData(d => ({ ...d, budget_exact: "custom" })); }}
            className={`px-3 py-2 rounded-full text-[13px] font-semibold border border-dashed transition-all ${isCustom ? "bg-[#25D366]/10 text-[#128C7E] border-[#128C7E]" : "text-[#128C7E] border-[#128C7E]/40 hover:bg-[#25D366]/5"}`}>
            + Set my own number
          </button>
        </div>
        {isCustom && (
          <div className="mt-2.5 pt-2.5 border-t border-black/5">
            <input type="number" inputMode="numeric" placeholder="e.g. 18500" autoFocus
              value={data.budget_exact_custom || ""}
              onChange={e => setData(d => ({ ...d, budget_exact_custom: e.target.value.replace(/\D/g, "") }))}
              className="w-full bg-[#F0F2F5] rounded-xl px-3 py-2 text-[14px] text-[#111B21] placeholder:text-[#9aa6ad] outline-none focus:ring-2 focus:ring-[#25D366]/30" />
            <p className="text-[10.5px] text-[#667781] mt-1.5">Per month, in rupees.</p>
          </div>
        )}
        <div className="mt-3 pt-2.5 border-t border-black/5">
          <p className="text-[10.5px] font-bold uppercase tracking-wider text-[#667781] mb-1.5">Food</p>
          <div className="flex gap-1.5">
            {(["included","extra"] as const).map(f => {
              const on = data.food_pref === f;
              return (
                <button key={f} type="button"
                  onClick={() => { tap(); setData(d => ({ ...d, food_pref: on ? undefined : f })); }}
                  className={`px-3 py-1.5 rounded-full text-[12px] font-medium border transition-all ${on ? "bg-[#25D366] text-white border-[#25D366]" : "bg-white text-[#111B21] border-black/10 hover:border-[#25D366]"}`}>
                  {on && "✓ "}{L_FOOD[f]}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      {ready && <AutoAdvancePill />}
    </>
  );
}

// ─── TEXT block (auto-advance after 900ms idle) ──────────────────────
function TextBlock({
  step, val, inputRef, onChange, onAdvance, stepNumber, total,
}: {
  step: Extract<Step, { type: "text" }>;
  val: string | undefined;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onChange: (v: string) => void;
  onAdvance: () => void;
  stepNumber?: number;
  total?: number;
}) {
  const minLen = step.optional ? 1 : 2;
  const ready = (val || "").trim().length >= minLen;
  useAutoAdvance(val, ready, onAdvance, 900);
  return (
    <>
      <QuestionCard q={step.q} qs={step.qs} stepNumber={stepNumber} total={total} />
      <p className="text-[9.5px] font-bold uppercase tracking-wider px-1 text-[#667781]">Type your answer</p>
      <div className="bg-white rounded-2xl p-3 shadow-sm border border-black/5">
        <input ref={inputRef} type="text"
          placeholder={step.ph}
          value={val || ""}
          onChange={e => onChange(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && (val || "").length > 1) onAdvance(); }}
          className="w-full bg-transparent text-[15px] text-[#111B21] placeholder:text-[#9aa6ad] outline-none" />
        {step.chips && (
          <div className="flex flex-wrap gap-1.5 mt-2.5 pt-2.5 border-t border-black/5">
            {step.chips.map(c => (
              <button key={c} type="button"
                onClick={() => onChange(c)}
                className="px-2.5 py-1 rounded-full text-[11px] font-medium text-[#128C7E] bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/20 transition-colors">
                {c}
              </button>
            ))}
          </div>
        )}
      </div>
      {ready ? <AutoAdvancePill /> : (
        step.optional && (
          <button type="button" onClick={onAdvance}
            className="self-center text-[11.5px] text-[#667781] hover:text-[#25D366] py-1.5 px-3 rounded-full transition-colors">
            Skip →
          </button>
        )
      )}
    </>
  );
}

// ─── NAME block (auto-advance after 900ms idle) ──────────────────────
function NameBlock({
  q, qs, name, inputRef, onChange, onSubmit, stepNumber, total,
}: {
  q: string; qs: string;
  name: string | undefined;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onChange: (v: string) => void;
  onSubmit: () => void;
  stepNumber?: number;
  total?: number;
}) {
  const ready = (name || "").trim().length >= 1;
  useAutoAdvance(name, ready, onSubmit, 900);
  return (
    <>
      <QuestionCard q={q} qs={qs} stepNumber={stepNumber} total={total} />
      <p className="text-[9.5px] font-bold uppercase tracking-wider px-1 text-[#667781]">Type your first name</p>
      <div className="bg-white rounded-2xl p-3 shadow-sm border border-black/5">
        <input ref={inputRef} type="text"
          placeholder="First name"
          value={name || ""}
          onChange={e => onChange(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && ready) onSubmit(); }}
          className="w-full bg-transparent text-[15px] text-[#111B21] placeholder:text-[#9aa6ad] outline-none" />
      </div>
      {ready && <AutoAdvancePill />}
    </>
  );
}

// ─── MULTI block (live countdown after last toggle) ──────────────────
function MultiBlock({
  step, arr, opts, isAreas, areaOther, setAreaOther, onToggle, onWriteOther, onAdvance, stepNumber, total,
}: {
  step: Extract<Step, { type: "multi" }>;
  arr: string[];
  opts: string[];
  isAreas: boolean;
  areaOther: string;
  setAreaOther: (v: string) => void;
  onToggle: (v: string) => void;
  onWriteOther?: () => void;
  onAdvance: () => void;
  stepNumber?: number;
  total?: number;
}) {
  const ready = arr.length > 0 || (isAreas && areaOther.trim().length > 0);
  // 2.5s window after any change; reset on each toggle / area_other edit
  const [countdown, setCountdown] = useState(0);
  useEffect(() => {
    if (!ready) { setCountdown(0); return; }
    setCountdown(3);
    const t1 = setTimeout(() => setCountdown(2), 800);
    const t2 = setTimeout(() => setCountdown(1), 1600);
    const t3 = setTimeout(() => { setCountdown(0); onAdvance(); }, 2500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [arr.join("|"), areaOther]);
  return (
    <>
      <QuestionCard q={step.q} qs={step.qs} stepNumber={stepNumber} total={total} />
      <p className="text-[9.5px] font-bold uppercase tracking-wider px-1 text-[#667781]">Tap any that apply</p>
      <div className="bg-white rounded-2xl p-3 shadow-sm border border-black/5">
        <div className="flex flex-wrap gap-1.5">
          {opts.map(o => {
            const on = arr.includes(o);
            const disabled = !on && arr.length >= step.max;
            return (
              <button key={o} type="button"
                disabled={disabled}
                onClick={() => onToggle(o)}
                className={`px-3 py-1.5 rounded-full text-[12.5px] font-medium border transition-all ${on ? "bg-[#25D366] text-white border-[#25D366]" : disabled ? "bg-black/5 text-black/30 border-transparent cursor-not-allowed" : "bg-white text-[#111B21] border-black/10 hover:border-[#25D366] hover:bg-[#25D366]/5"}`}>
                {on && "✓ "}{o}
              </button>
            );
          })}
          {step.allowOther && onWriteOther && (
            <button type="button"
              onClick={onWriteOther}
              className="px-3 py-1.5 rounded-full text-[12.5px] font-medium border border-dashed border-[#128C7E]/40 text-[#128C7E] bg-[#25D366]/5 hover:bg-[#25D366]/10">
              + Write your own
            </button>
          )}
        </div>
        {isAreas && (
          <div className="mt-2.5 pt-2.5 border-t border-black/5">
            <label className="text-[10.5px] font-bold uppercase tracking-wider text-[#667781] block mb-1">+ Add another area</label>
            <input type="text" placeholder="e.g. Kasavanahalli, Bagmane Tech Park"
              value={areaOther}
              onChange={e => setAreaOther(e.target.value)}
              className="w-full bg-[#F0F2F5] rounded-xl px-3 py-2 text-[13px] text-[#111B21] placeholder:text-[#9aa6ad] outline-none focus:ring-2 focus:ring-[#25D366]/30" />
          </div>
        )}
        <p className="text-[11px] text-[#667781] mt-2.5 pt-2.5 border-t border-black/5">
          {arr.length} of {step.max} selected
        </p>
      </div>
      {ready && countdown > 0 ? (
        <button type="button" onClick={onAdvance}
          className="self-center px-3 py-1.5 rounded-full bg-[#25D366]/10 border border-[#25D366]/30 text-[11px] font-semibold text-[#128C7E] flex items-center gap-1.5 hover:bg-[#25D366]/20">
          <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse" />
          Auto-continuing in {countdown}… (tap to skip wait)
        </button>
      ) : step.optional && !ready ? (
        <button type="button" onClick={onAdvance}
          className="self-center text-[11.5px] text-[#667781] hover:text-[#25D366] py-1.5 px-3 rounded-full transition-colors">
          Skip →
        </button>
      ) : null}
    </>
  );
}
