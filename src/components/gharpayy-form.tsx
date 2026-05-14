import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, Check, ChevronDown, Sparkles, Phone, Shield, Star,
  Utensils, Laptop, Moon, Car, AlertCircle, Clock,
  TrendingDown, Home as HomeIcon, Plane, Globe,
  MessageCircle, Headphones, Key, CalendarCheck, Users, MapPin, Send, Zap,
} from "lucide-react";
import { type Lang, langLabels, t, getAmenityKeys } from "@/lib/i18n";
import {
  ChatHeader, BackBar, NextBtn, GlassCard, FieldLabel, Sub, StepTitle, InsightBubble,
  Toggle, PillGroup, TextInput, BudgetSlider, Confetti, anim, trans,
} from "@/components/form-ui";

// 👉 Gharpayy official WhatsApp (no '+', country code prefixed)
const GHARPAYY_WHATSAPP = "917988114576";
const GHARPAYY_WHATSAPP_DISPLAY = "+91 79881 14576";

type Scenario = "arrived" | "escape" | "moving" | "upgrade" | "budget" | null;

interface LeadData {
  scenario: Scenario;
  timeInHotel?: string;
  mainPain?: string;
  fromCity?: string;
  arrivalDate?: string;
  travelBooked?: boolean;
  currentRent?: string;
  wishList?: string;
  targetBudgetMax?: string;
  preferredLocation?: string;
  budgetMin?: number;
  budgetMax?: number;
  roomType?: string;
  gender?: string;
  occupation?: string;
  diet?: string;
  wfhDays?: string;
  returnTime?: string;
  needsParking?: boolean;
  whatMatters?: string[];
  name?: string;
  phone?: string;
  email?: string;
}

// Removed dead SCENARIO_2. Flow: WELCOME → SCENARIO_1 → LOCATION → LIFESTYLE → CONTACT → SUCCESS
const S = { WELCOME: 0, SCENARIO_1: 1, LOCATION: 2, LIFESTYLE: 3, CONTACT: 4, SUCCESS: 5 };
const TOTAL = 4;

const scenarioColors: Record<string, string> = {
  arrived: "#1F47BA",
  escape: "#DC2626",
  moving: "#7C3AED",
  upgrade: "#FFC72C",
  budget: "#25D366",
};

function getScenarioConfig(lang: Lang) {
  return [
    { id: "arrived" as const, icon: Clock, headline: t(lang, "scenarioArrived"), sub: t(lang, "scenarioArrivedSub"), color: scenarioColors.arrived },
    { id: "escape" as const, icon: AlertCircle, headline: t(lang, "scenarioEscape"), sub: t(lang, "scenarioEscapeSub"), color: scenarioColors.escape },
    { id: "moving" as const, icon: Plane, headline: t(lang, "scenarioMoving"), sub: t(lang, "scenarioMovingSub"), color: scenarioColors.moving },
    { id: "upgrade" as const, icon: Star, headline: t(lang, "scenarioUpgrade"), sub: t(lang, "scenarioUpgradeSub"), color: scenarioColors.upgrade },
    { id: "budget" as const, icon: TrendingDown, headline: t(lang, "scenarioBudget"), sub: t(lang, "scenarioBudgetSub"), color: scenarioColors.budget },
  ];
}

/* ─── BLR Insights — every step delivers value, never wastes time ─── */
function getBlrInsight(scenario: Scenario, location?: string, budgetMid?: number): string | null {
  // Scenario-driven insight after they pick scenario
  if (scenario === "arrived") return "💡 Avg hotel in BLR costs ₹3,500/night. A premium PG = same as 4 hotel nights.";
  if (scenario === "escape") return "💡 89% of our residents moved from another PG. You're not alone.";
  if (scenario === "moving") return "💡 BLR rents jumped 12% in 2025. Lock your room before landing.";
  if (scenario === "upgrade") return "💡 Most upgraders save ₹2,000/mo by switching from chain PGs to verified local ones.";
  if (scenario === "budget") return "💡 Quietest savings: HSR Sector 7, BTM 2nd Stage — ₹3k–4k less than Koramangala.";
  return null;
}

function getLocationInsight(location?: string): string | null {
  if (!location) return null;
  const loc = location.toLowerCase();
  if (loc.includes("koramangala")) return "💡 Koramangala avg rent: ₹13,500. Best for startups, foodies & nightlife.";
  if (loc.includes("hsr")) return "💡 HSR avg rent: ₹11,200. Tech crowd, parks, fast metro coming 2026.";
  if (loc.includes("indiranagar")) return "💡 Indiranagar avg rent: ₹15,800. Premium, walkable, well-connected.";
  if (loc.includes("electronic") || loc.includes("ecity")) return "💡 E-City avg rent: ₹8,500. Closest to Infosys, Wipro, Biocon campuses.";
  if (loc.includes("whitefield")) return "💡 Whitefield avg rent: ₹10,400. ITPL crowd, less traffic than Marathahalli.";
  if (loc.includes("btm")) return "💡 BTM avg rent: ₹9,200. Central, budget-friendly, great metro access.";
  if (loc.includes("marathahalli")) return "💡 Marathahalli avg rent: ₹9,800. Near ORR tech parks, dense bus network.";
  if (loc.includes("jp nagar") || loc.includes("jpnagar")) return "💡 JP Nagar avg rent: ₹10,500. Quieter, family vibe, near Bannerghatta Rd.";
  return `💡 We have verified PGs in ${location.split(",")[0]}. Aayushi will share 3–5 today.`;
}

function getBudgetInsight(min: number, max: number): string {
  const mid = (min + max) / 2;
  if (mid < 8000) return "💡 ₹5–8k zone: shared rooms, basic. We have 40+ verified options.";
  if (mid < 12000) return "💡 Sweet spot. 60% of our residents pay this range — best value/quality.";
  if (mid < 18000) return "💡 Premium tier: single rooms, AC, home food, prime locations.";
  return "💡 Luxury PG / studio range. Hotel-grade amenities, walk-to-office options.";
}

function buildWhatsAppMessage(data: LeadData, lang: Lang, chips: string[], budgetMin: number, budgetMax: number, fillTime: number, name: string): string {
  const lines: string[] = [];
  lines.push(`🏠 *Gharpayy lead — Find My Stay*`);
  lines.push("");
  if (name) lines.push(`👤 *Name:* ${name}`);
  if (data.scenario) {
    const scenarioKeys: Record<string, "scenarioArrived" | "scenarioEscape" | "scenarioMoving" | "scenarioUpgrade" | "scenarioBudget"> = {
      arrived: "scenarioArrived", escape: "scenarioEscape", moving: "scenarioMoving",
      upgrade: "scenarioUpgrade", budget: "scenarioBudget",
    };
    const key = scenarioKeys[data.scenario];
    lines.push(`📋 *Situation:* ${key ? t(lang, key) : data.scenario}`);
  }
  if (data.preferredLocation) lines.push(`📍 *Area:* ${data.preferredLocation}`);
  lines.push(`💰 *Budget:* ₹${budgetMin.toLocaleString()} – ₹${budgetMax.toLocaleString()}/mo`);
  if (data.roomType) lines.push(`🛏️ *Room:* ${data.roomType}`);
  if (data.gender) {
    const map: Record<string,string> = { male: "Looking for boys", female: "Looking for girls", other: "Coed (mixed)" };
    lines.push(`👥 *Living with:* ${map[data.gender] || data.gender}`);
  }
  if (data.occupation) lines.push(`💼 *Occupation:* ${data.occupation}`);
  if (data.diet) lines.push(`🍽️ *Diet:* ${data.diet}`);
  if (data.wfhDays) lines.push(`💻 *WFH:* ${data.wfhDays}`);
  if (data.needsParking) lines.push(`🚗 *Parking:* Yes`);
  if (chips.length > 0) lines.push(`✅ *Must-haves:* ${chips.join(", ")}`);
  lines.push("");
  lines.push(`⏱️ Filled in ${fillTime}s`);
  lines.push(`🎟️ Coupon: SUPERSTAY1000 (₹1,000 off)`);
  return lines.join("\n");
}

export default function GharpayyForm() {
  const [lang, setLang] = useState<Lang>("en");
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [step, setStep] = useState(S.WELCOME);
  const [data, setData] = useState<LeadData>({ scenario: null });
  const [budgetMin, setBudgetMin] = useState(8000);
  const [budgetMax, setBudgetMax] = useState(15000);
  const [chips, setChips] = useState<string[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [fillTime, setFillTime] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [nameVal, setNameVal] = useState("");
  const [phoneVal, setPhoneVal] = useState("");
  const [emailVal, setEmailVal] = useState("");
  const [phoneErr, setPhoneErr] = useState("");
  const [nameErr, setNameErr] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [customWaNum, setCustomWaNum] = useState("");
  const [showCustomNum, setShowCustomNum] = useState(false);

  const set = useCallback((patch: Partial<LeadData>) => setData(d => ({ ...d, ...patch })), []);
  const startTimer = useCallback(() => { if (!startTime) setStartTime(Date.now()); }, [startTime]);
  const next = useCallback((n = 1) => { startTimer(); setStep(s => s + n); }, [startTimer]);
  const back = useCallback(() => setStep(s => Math.max(0, s - 1)), []);

  const progress = step > 0 && step < S.SUCCESS ? (step / TOTAL) * 100 : 0;
  const scenario = data.scenario;

  const scenarioEyebrow = () => {
    const map: Record<string, "eyebrowArrived" | "eyebrowEscape" | "eyebrowMoving" | "eyebrowUpgrade" | "eyebrowBudget"> = {
      arrived: "eyebrowArrived", escape: "eyebrowEscape", moving: "eyebrowMoving",
      upgrade: "eyebrowUpgrade", budget: "eyebrowBudget",
    };
    return scenario ? t(lang, map[scenario]) : "";
  };

  const handleSubmit = async () => {
    let hasErr = false;
    if (!nameVal.trim() || nameVal.trim().length < 2) { setNameErr(t(lang, "nameError")); hasErr = true; }
    else setNameErr("");
    if (!phoneVal.trim() || phoneVal.trim().length < 10) { setPhoneErr(t(lang, "phoneError")); hasErr = true; }
    else setPhoneErr("");
    if (hasErr) return;

    setSubmitting(true);
    const elapsed = startTime ? Math.round((Date.now() - startTime) / 1000) : 0;
    setFillTime(elapsed);
    await new Promise(r => setTimeout(r, 600));
    set({ name: nameVal, phone: phoneVal, email: emailVal || undefined, budgetMin, budgetMax, whatMatters: chips });
    setShowConfetti(true);
    setStep(S.SUCCESS);
    setTimeout(() => setShowConfetti(false), 4500);
    setSubmitting(false);
  };

  const amenityKeys = getAmenityKeys();
  const waMessage = useMemo(
    () => buildWhatsAppMessage({ ...data, name: nameVal, phone: phoneVal, email: emailVal }, lang, chips, budgetMin, budgetMax, fillTime, nameVal),
    [data, nameVal, phoneVal, emailVal, lang, chips, budgetMin, budgetMax, fillTime]
  );
  const gharpayyWaUrl = `https://wa.me/${GHARPAYY_WHATSAPP}?text=${encodeURIComponent(waMessage)}`;
  const customDigits = customWaNum.replace(/\D/g, "");
  const customWaUrl = customDigits.length >= 10
    ? `https://wa.me/${customDigits.length === 10 ? "91" + customDigits : customDigits}?text=${encodeURIComponent(waMessage)}`
    : "";

  const scenarioInsight = getBlrInsight(scenario);
  const locationInsight = getLocationInsight(data.preferredLocation);
  const budgetInsight = getBudgetInsight(budgetMin, budgetMax);

  return (
    <div className="min-h-[100dvh] w-full flex justify-center" style={{ background: "var(--brand-navy)" }}>
      {showConfetti && <Confetti />}
      <div className="w-full max-w-md relative min-h-[100dvh] flex flex-col overflow-hidden wa-chat-bg">
        {step === S.WELCOME && <ChatHeader subtitle="online · usually replies in 10 min" />}
        {step > 0 && step < S.SUCCESS && (
          <BackBar step={step} onBack={back} progress={progress} total={TOTAL} lang={lang} />
        )}
        {step === S.SUCCESS && <ChatHeader subtitle="✓ Lead received" />}

        <div className="flex-1 flex flex-col overflow-y-auto">
          <AnimatePresence mode="wait">

            {/* ──── WELCOME ──── */}
            {step === S.WELCOME && (
              <motion.div key="welcome" variants={anim} initial="enter" animate="center" exit="exit" transition={trans}
                className="flex-1 flex flex-col px-4 pt-4 pb-8">

                {/* Date pill */}
                <div className="flex justify-center mb-3">
                  <span className="px-3 py-1 rounded-full text-[11px] font-medium text-[#54656F] bg-[#E1F5FE]/90 shadow-sm">Today</span>
                </div>

                {/* Lang selector */}
                <div className="flex justify-end mb-3 relative">
                  <button type="button" onClick={() => setShowLangMenu(!showLangMenu)}
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 bg-white shadow-sm border border-black/5">
                    <Globe className="w-3 h-3 text-[#1F47BA]" />
                    <span className="text-[11px] font-bold text-[#1F47BA]">{langLabels[lang]}</span>
                    <ChevronDown className="w-3 h-3 text-[#1F47BA]" />
                  </button>
                  {showLangMenu && (
                    <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                      className="absolute top-full mt-1.5 right-0 z-50 rounded-xl p-1 bg-white shadow-lg min-w-[140px] border border-black/5">
                      {(Object.keys(langLabels) as Lang[]).map(l => (
                        <button key={l} type="button"
                          onClick={() => { setLang(l); setShowLangMenu(false); }}
                          className={`w-full text-left px-3 py-2 rounded-lg text-[12px] font-semibold transition-all ${lang === l ? "text-[#1F47BA] bg-[#1F47BA]/10" : "text-[#111B21] hover:bg-black/5"}`}>
                          {langLabels[l]}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </div>

                {/* Greeting bubble */}
                <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
                  className="bubble-in max-w-[88%] mb-2 ml-1 px-3.5 py-2.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#1F47BA] mb-1">Aayushi · Gharpayy</p>
                  <p className="text-[15px] font-semibold text-[#111B21] leading-snug">Hey! 👋</p>
                  <p className="text-[14px] text-[#111B21] leading-snug mt-1">
                    Tired of scrolling 50 PG sites? I'll match you to the right Bangalore stay in <b>under 10 min</b>. <b>Zero brokerage</b>, real verified rooms.
                  </p>
                  <p className="text-[10px] text-[#667781] text-right mt-1">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </motion.div>

                <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                  className="bubble-in max-w-[88%] mb-4 ml-1 px-3.5 py-2.5">
                  <p className="text-[14px] text-[#111B21] leading-snug">
                    Quick question — what brings you here today?
                  </p>
                  <p className="text-[10px] text-[#667781] text-right mt-1">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </motion.div>

                {/* Scenario quick replies (WhatsApp-style suggested reply chips) */}
                <div className="space-y-2 mb-4">
                  {getScenarioConfig(lang).map((s, i) => {
                    const Icon = s.icon;
                    return (
                      <motion.button key={s.id} type="button"
                        initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + i * 0.06 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => { set({ scenario: s.id }); next(); }}
                        className="w-full flex items-center gap-3 rounded-2xl pl-3 pr-3.5 py-3 text-left bg-white border border-black/5 shadow-sm hover:shadow-md hover:border-[#25D366] active:scale-95 transition-all group">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ background: `${s.color}15`, border: `1px solid ${s.color}30` }}>
                          <Icon className="w-5 h-5" style={{ color: s.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-[#111B21] text-[13.5px] leading-tight">{s.headline}</p>
                          <p className="text-[11px] text-[#667781] mt-0.5 leading-tight">{s.sub}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-[#25D366] opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all flex-shrink-0" />
                      </motion.button>
                    );
                  })}
                </div>

                {/* Trust strip */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
                  className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[10px] text-[#667781] mt-2">
                  <span className="flex items-center gap-1"><Shield className="w-3 h-3 text-[#25D366]" /> Zero brokerage</span>
                  <span>·</span>
                  <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-[#25D366]" /> Personal call</span>
                  <span>·</span>
                  <span className="flex items-center gap-1"><HomeIcon className="w-3 h-3 text-[#25D366]" /> Verified PGs</span>
                </motion.div>
              </motion.div>
            )}

            {/* ──── SCENARIO STEP 1 ──── */}
            {step === S.SCENARIO_1 && (
              <motion.div key="sc1" variants={anim} initial="enter" animate="center" exit="exit" transition={trans}
                className="flex-1 flex flex-col px-4 pt-5 pb-8">

                {scenarioInsight && <InsightBubble delay={0.1}>{scenarioInsight}</InsightBubble>}

                {scenario === "arrived" && (
                  <div className="flex-1 flex flex-col">
                    <StepTitle eyebrow={scenarioEyebrow()} title={t(lang, "arrivedTitle")} />
                    <Sub>{t(lang, "arrivedSub")}</Sub>
                    <PillGroup
                      options={[
                        { id: "1_3", label: t(lang, "arrived1_3"), sub: t(lang, "arrived1_3Sub") },
                        { id: "4_7", label: t(lang, "arrived4_7"), sub: t(lang, "arrived4_7Sub") },
                        { id: "1_2_weeks", label: t(lang, "arrived1_2weeks"), sub: t(lang, "arrived1_2weeksSub") },
                        { id: "not_yet", label: t(lang, "arrivedNotYet"), sub: t(lang, "arrivedNotYetSub") },
                      ]}
                      value={data.timeInHotel} onChange={v => { set({ timeInHotel: v }); next(); }} />
                  </div>
                )}

                {scenario === "escape" && (
                  <div className="flex-1 flex flex-col">
                    <StepTitle eyebrow={scenarioEyebrow()} title={t(lang, "escapeTitle")} />
                    <Sub>{t(lang, "escapeSub")}</Sub>
                    <div className="space-y-2">
                      {(["escapeNoise","escapeCleanliness","escapeFood","escapeOwner","escapeWifi","escapeCurfew","escapeExpensive","escapeMultiple"] as const).map(key => {
                        const id = key.replace("escape", "").toLowerCase();
                        const active = data.mainPain === id;
                        return (
                          <motion.button key={id} type="button" whileTap={{ scale: 0.97 }}
                            onClick={() => { set({ mainPain: id }); next(); }}
                            className="w-full text-left px-3.5 py-3 rounded-2xl text-[13px] font-medium transition-all"
                            style={{
                              background: active ? "linear-gradient(135deg, #DCF8C6, #B7E8A1)" : "#FFFFFF",
                              border: `1.5px solid ${active ? "#25D366" : "rgba(15,23,42,0.08)"}`,
                              color: "#111B21",
                              boxShadow: active ? "0 4px 14px rgba(37,211,102,0.2)" : "0 1px 0.5px rgba(11,20,26,0.08)",
                            }}>
                            {active && <Check className="inline w-3.5 h-3.5 mr-2 text-[#128C7E]" />}{t(lang, key)}
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {scenario === "moving" && (
                  <div className="flex-1 flex flex-col gap-5">
                    <StepTitle eyebrow={scenarioEyebrow()} title={t(lang, "movingTitle")} />
                    <Sub>{t(lang, "movingSub")}</Sub>
                    <div>
                      <FieldLabel>{t(lang, "movingFromCity")}</FieldLabel>
                      <TextInput value={data.fromCity} onChange={v => set({ fromCity: v })}
                        placeholder={t(lang, "movingFromCityPlaceholder")} />
                    </div>
                    <div>
                      <FieldLabel>{t(lang, "movingArrivalDate")}</FieldLabel>
                      <TextInput value={data.arrivalDate} onChange={v => set({ arrivalDate: v })} placeholder="" type="date" />
                    </div>
                    <GlassCard className="flex items-center justify-between">
                      <p className="text-sm font-bold text-foreground">{t(lang, "movingTravelBooked")}</p>
                      <Toggle value={data.travelBooked ?? false} onChange={v => set({ travelBooked: v })} />
                    </GlassCard>
                    <NextBtn onClick={() => next()} label={t(lang, "continueBtn")} />
                  </div>
                )}

                {scenario === "upgrade" && (
                  <div className="flex-1 flex flex-col gap-5">
                    <StepTitle eyebrow={scenarioEyebrow()} title={t(lang, "upgradeTitle")} />
                    <Sub>{t(lang, "upgradeSub")}</Sub>
                    <div>
                      <FieldLabel>{t(lang, "upgradeCurrentRent")}</FieldLabel>
                      <TextInput value={data.currentRent} onChange={v => set({ currentRent: v })}
                        placeholder={t(lang, "upgradeCurrentRentPlaceholder")} />
                    </div>
                    <div>
                      <FieldLabel>{t(lang, "upgradeWishList")}</FieldLabel>
                      <TextInput value={data.wishList} onChange={v => set({ wishList: v })}
                        placeholder={t(lang, "upgradeWishListPlaceholder")} />
                    </div>
                    <NextBtn onClick={() => next()} label={t(lang, "continueBtn")} />
                  </div>
                )}

                {scenario === "budget" && (
                  <div className="flex-1 flex flex-col gap-5">
                    <StepTitle eyebrow={scenarioEyebrow()} title={t(lang, "budgetTitle")} />
                    <Sub>{t(lang, "budgetSub")}</Sub>
                    <div>
                      <FieldLabel>{t(lang, "budgetCurrentRent")}</FieldLabel>
                      <TextInput value={data.currentRent} onChange={v => set({ currentRent: v })}
                        placeholder={t(lang, "budgetCurrentRentPlaceholder")} />
                    </div>
                    <div>
                      <FieldLabel>{t(lang, "budgetTargetMax")}</FieldLabel>
                      <TextInput value={data.targetBudgetMax} onChange={v => set({ targetBudgetMax: v })}
                        placeholder={t(lang, "budgetTargetMaxPlaceholder")} />
                    </div>
                    <NextBtn onClick={() => next()} label={t(lang, "continueBtn")} />
                  </div>
                )}
              </motion.div>
            )}

            {/* ──── LOCATION + ROOM (no dead step) ──── */}
            {step === S.LOCATION && (
              <motion.div key="location" variants={anim} initial="enter" animate="center" exit="exit" transition={trans}
                className="flex-1 flex flex-col px-4 pt-5 pb-8">
                <div className="flex-1 space-y-5">
                  <StepTitle eyebrow={scenarioEyebrow()} title={t(lang, "locationTitle")} />

                  <div>
                    <FieldLabel>{t(lang, "locationPreferred")}</FieldLabel>
                    <TextInput value={data.preferredLocation} onChange={v => set({ preferredLocation: v })}
                      placeholder={t(lang, "locationPlaceholder")} />
                    {locationInsight && (
                      <motion.div key={locationInsight} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                        className="mt-2">
                        <InsightBubble>{locationInsight}</InsightBubble>
                      </motion.div>
                    )}
                  </div>

                  <BudgetSlider min={budgetMin} max={budgetMax} onChange={(mn, mx) => { setBudgetMin(mn); setBudgetMax(mx); }} />
                  <InsightBubble>{budgetInsight}</InsightBubble>

                  <div>
                    <FieldLabel>{t(lang, "roomType")}</FieldLabel>
                    <PillGroup cols={3}
                      options={[
                        { id: "single", label: t(lang, "roomSingle") },
                        { id: "sharing", label: t(lang, "roomSharing") },
                        { id: "any", label: t(lang, "roomAny") },
                      ]}
                      value={data.roomType} onChange={v => set({ roomType: v })} />
                  </div>

                  <div>
                    <FieldLabel>{t(lang, "gender")}</FieldLabel>
                    <PillGroup cols={3}
                      options={[
                        { id: "female", label: t(lang, "genderFemale") },
                        { id: "male", label: t(lang, "genderMale") },
                        { id: "other", label: t(lang, "genderOther") },
                      ]}
                      value={data.gender} onChange={v => set({ gender: v })} />
                  </div>

                  <div>
                    <FieldLabel>{t(lang, "occupation")}</FieldLabel>
                    <TextInput value={data.occupation} onChange={v => set({ occupation: v })}
                      placeholder={t(lang, "occupationPlaceholder")} />
                  </div>
                </div>
                <div className="pt-5">
                  <NextBtn onClick={() => next()} label={t(lang, "continueBtn")} />
                </div>
              </motion.div>
            )}

            {/* ──── LIFESTYLE ──── */}
            {step === S.LIFESTYLE && (
              <motion.div key="lifestyle" variants={anim} initial="enter" animate="center" exit="exit" transition={trans}
                className="flex-1 flex flex-col px-4 pt-5 pb-8">
                <div className="flex-1 space-y-6">
                  <StepTitle eyebrow={t(lang, "lifestyleEyebrow")} title={t(lang, "lifestyleTitle")} />
                  <InsightBubble>💡 Compatible roommates = 3× longer stays. We match on these.</InsightBubble>

                  <div>
                    <div className="flex items-center gap-2 mb-2.5">
                      <Utensils className="w-4 h-4 text-[#1F47BA]" />
                      <FieldLabel>{t(lang, "foodPref")}</FieldLabel>
                    </div>
                    <PillGroup
                      options={[
                        { id: "veg", label: t(lang, "foodVeg") },
                        { id: "non_veg", label: t(lang, "foodNonVeg") },
                        { id: "jain", label: t(lang, "foodJain") },
                        { id: "no_pref", label: t(lang, "foodNoPref") },
                      ]}
                      value={data.diet} onChange={v => set({ diet: v })} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2.5">
                      <Laptop className="w-4 h-4 text-[#1F47BA]" />
                      <FieldLabel>{t(lang, "wfh")}</FieldLabel>
                    </div>
                    <PillGroup
                      options={[
                        { id: "office", label: t(lang, "wfhOffice") },
                        { id: "hybrid", label: t(lang, "wfhHybrid") },
                        { id: "mostly_home", label: t(lang, "wfhMostly") },
                        { id: "remote", label: t(lang, "wfhRemote") },
                      ]}
                      value={data.wfhDays} onChange={v => set({ wfhDays: v })} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2.5">
                      <Moon className="w-4 h-4 text-[#1F47BA]" />
                      <FieldLabel>{t(lang, "homeBy")}</FieldLabel>
                    </div>
                    <PillGroup
                      options={[
                        { id: "before_7", label: t(lang, "homeBefore7") },
                        { id: "7_to_10", label: t(lang, "home7to10") },
                        { id: "after_10", label: t(lang, "homeAfter10") },
                        { id: "varies", label: t(lang, "homeVaries") },
                      ]}
                      value={data.returnTime} onChange={v => set({ returnTime: v })} />
                  </div>
                  <GlassCard className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Car className="w-4 h-4 text-[#1F47BA]" />
                      <div>
                        <p className="text-sm font-bold text-[#111B21]">{t(lang, "needParking")}</p>
                        <p className="text-xs mt-0.5 text-[#667781]">{t(lang, "needParkingSub")}</p>
                      </div>
                    </div>
                    <Toggle value={data.needsParking ?? false} onChange={v => set({ needsParking: v })} />
                  </GlassCard>

                  <div>
                    <FieldLabel>{t(lang, "amenitiesLabel")}</FieldLabel>
                    <div className="flex flex-wrap gap-1.5">
                      {amenityKeys.map(key => {
                        const label = t(lang, key);
                        const on = chips.includes(key);
                        return (
                          <motion.button key={key} type="button" whileTap={{ scale: 0.93 }}
                            onClick={() => setChips(prev => on ? prev.filter(x => x !== key) : [...prev, key])}
                            className="px-3 py-1.5 rounded-full text-[11.5px] font-semibold transition-all"
                            style={{
                              background: on ? "linear-gradient(135deg, #25D366, #128C7E)" : "#FFFFFF",
                              border: `1.5px solid ${on ? "transparent" : "rgba(15,23,42,0.08)"}`,
                              color: on ? "#FFFFFF" : "#54656F",
                              boxShadow: on ? "0 4px 12px rgba(37,211,102,0.3)" : "0 1px 0.5px rgba(11,20,26,0.06)",
                            }}>
                            {on && <Check className="inline w-3 h-3 mr-1" />}{label}
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div className="pt-5">
                  <NextBtn onClick={() => next()} label={t(lang, "oneLastThing")} />
                </div>
              </motion.div>
            )}

            {/* ──── CONTACT ──── */}
            {step === S.CONTACT && (
              <motion.div key="contact" variants={anim} initial="enter" animate="center" exit="exit" transition={trans}
                className="flex-1 flex flex-col px-4 pt-5 pb-8">
                <div className="flex-1">
                  <StepTitle eyebrow={t(lang, "contactEyebrow")} title={t(lang, "contactTitle")} />
                  <InsightBubble>💡 We call within ~10 min. 92% of leads find a home in their first 3 visits.</InsightBubble>

                  <div className="space-y-3.5 mt-4">
                    <div>
                      <label className="block text-[12px] font-semibold mb-1.5 text-[#54656F]">{t(lang, "yourName")}</label>
                      <TextInput value={nameVal} onChange={setNameVal} placeholder={t(lang, "namePlaceholder")} />
                      {nameErr && <p className="text-xs mt-1.5 text-destructive">{nameErr}</p>}
                    </div>
                    <div>
                      <label className="block text-[12px] font-semibold mb-1.5 text-[#54656F]">{t(lang, "whatsappNumber")}</label>
                      <TextInput value={phoneVal} onChange={setPhoneVal} placeholder={t(lang, "phonePlaceholder")} type="tel" />
                      {phoneErr && <p className="text-xs mt-1.5 text-destructive">{phoneErr}</p>}
                    </div>
                    <div>
                      <label className="block text-[12px] font-semibold mb-1.5 text-[#54656F]">
                        {t(lang, "emailLabel")} <span className="font-normal text-[#8696a0]">{t(lang, "emailOptional")}</span>
                      </label>
                      <TextInput value={emailVal} onChange={setEmailVal} placeholder={t(lang, "emailPlaceholder")} type="email" />
                    </div>
                  </div>
                  <p className="text-[11px] mt-4 text-center text-[#667781]">🔒 {t(lang, "infoPrivacy")}</p>
                </div>
                <div className="pt-5">
                  <button type="button" onClick={handleSubmit} disabled={submitting}
                    className="w-full h-13 py-3.5 flex items-center justify-center gap-2.5 rounded-full text-[15px] font-bold btn-gold disabled:opacity-60">
                    {submitting
                      ? <><span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />{t(lang, "saving")}</>
                      : <><Sparkles className="w-5 h-5" />{t(lang, "findMyStay")}</>
                    }
                  </button>
                </div>
              </motion.div>
            )}

            {/* ──── SUCCESS ──── */}
            {step === S.SUCCESS && (
              <motion.div key="success" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
                className="flex-1 flex flex-col px-4 pt-4 pb-32">

                <div className="flex justify-center mb-3">
                  <span className="px-3 py-1 rounded-full text-[11px] font-medium text-[#54656F] bg-[#E1F5FE]/90 shadow-sm">Today</span>
                </div>

                {/* Hero greeting */}
                <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 }}
                  className="bubble-in max-w-[88%] mb-2 ml-1 px-3.5 py-2.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#1F47BA] mb-1">Aayushi · Gharpayy</p>
                  <p className="text-[15px] font-semibold text-[#111B21] leading-snug">
                    Hey {nameVal?.split(" ")[0] || "there"} 👋
                  </p>
                  <p className="text-[14px] text-[#111B21] leading-snug mt-1">
                    Profile saved{fillTime > 0 ? ` · ${fillTime}s, that's fast 🔥` : ""}. Hit the green button below to send your requirements straight to my WhatsApp 👇
                  </p>
                  <p className="text-[10px] text-[#667781] text-right mt-1">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ✓✓</p>
                </motion.div>

                {/* Outgoing summary */}
                <motion.div initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}
                  className="self-end bubble-out max-w-[88%] mb-2 mr-1 px-3.5 py-2.5">
                  <p className="text-[11px] font-bold text-[#128C7E] mb-1.5">📋 My requirements</p>
                  <div className="text-[13px] text-[#111B21] space-y-0.5 leading-snug">
                    {data.preferredLocation && <p>📍 {data.preferredLocation}</p>}
                    <p>💰 ₹{budgetMin.toLocaleString()} – ₹{budgetMax.toLocaleString()}/mo</p>
                    {data.roomType && <p>🛏️ {data.roomType}</p>}
                    {data.gender && <p>👥 {{male:"Boys",female:"Girls",other:"Coed"}[data.gender] || data.gender}</p>}
                    {chips.length > 0 && <p>✨ +{chips.length} amenities</p>}
                  </div>
                  <p className="text-[10px] text-[#667781] text-right mt-1">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ✓✓</p>
                </motion.div>

                {/* Gharpayy WhatsApp number CARD — the hero */}
                <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.25, type: "spring", stiffness: 240, damping: 22 }}
                  className="rounded-2xl p-4 mb-3 ml-1 max-w-[92%] relative overflow-hidden"
                  style={{
                    background: "linear-gradient(135deg, #075E54 0%, #128C7E 50%, #25D366 100%)",
                    boxShadow: "0 12px 30px rgba(7,94,84,0.32), 0 4px 8px rgba(0,0,0,0.12)",
                  }}>
                  <div className="absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 rounded-full bg-white/10 blur-2xl" />
                  <div className="relative flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-white/15 backdrop-blur flex items-center justify-center flex-shrink-0">
                      <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/></svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-100">Gharpayy WhatsApp</p>
                      <p className="text-[20px] font-black text-white leading-tight tracking-tight tabular-nums">{GHARPAYY_WHATSAPP_DISPLAY}</p>
                      <p className="text-[11px] text-emerald-100/90 mt-0.5">Mon–Sun · 9 AM – 9 PM IST</p>
                    </div>
                  </div>
                </motion.div>

                {/* Phone-mockup preview of the WhatsApp message */}
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                  className="self-center my-3">
                  <div className="phone-frame w-[280px]">
                    <div className="phone-screen wa-chat-bg pb-3">
                      <div className="wa-header px-3 py-2 flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#FFD451] to-[#E5A800] flex items-center justify-center text-[#0A1A3D] font-black text-[10px]">G</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-semibold text-white leading-tight">Gharpayy</p>
                          <p className="text-[9px] text-emerald-200 leading-tight">{GHARPAYY_WHATSAPP_DISPLAY}</p>
                        </div>
                        <Phone className="w-3.5 h-3.5 text-white/80" />
                      </div>
                      <div className="px-2.5 py-3 max-h-[200px] overflow-hidden">
                        <div className="self-end ml-auto bubble-out max-w-[88%] px-2.5 py-2 text-[10px] leading-snug whitespace-pre-line">
                          {waMessage.split("\n").slice(0, 9).join("\n")}
                          <div className="text-[8px] text-[#667781] text-right mt-1">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ✓✓</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-[10px] text-center text-[#667781] mt-2 font-medium">↑ Preview of the message</p>
                </motion.div>

                {/* Timeline */}
                <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}
                  className="bubble-in max-w-[92%] mb-2 ml-1 px-3.5 py-3">
                  <p className="text-[11px] font-bold text-[#128C7E] mb-3">⏱️ What happens next</p>
                  <div className="space-y-3">
                    {[
                      { icon: Headphones, eta: "~10 min", title: "Personal call from Aayushi", desc: "Confirm your needs & shortlist 3–5 verified options.", active: true },
                      { icon: HomeIcon, eta: "today", title: "Curated PG/flat shortlist", desc: "Photos, exact rent, deposit, distance — all on WhatsApp.", active: false },
                      { icon: CalendarCheck, eta: "1–2 days", title: "Free property visits", desc: "We schedule on your slot. No pushy sales.", active: false },
                      { icon: Key, eta: "3–5 days", title: "Move in peacefully", desc: "Zero brokerage. Honest paperwork. We stay in touch after.", active: false },
                    ].map((step, i) => {
                      const Icon = step.icon;
                      return (
                        <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.6 + i * 0.08 }} className="flex gap-3 relative">
                          {i < 3 && <div className="absolute left-[15px] top-8 bottom-[-12px] w-px bg-[#E9EDEF]" />}
                          <div className="relative flex-shrink-0">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step.active ? "bg-[#25D366]" : "bg-[#E9EDEF]"}`}>
                              <Icon className={`w-4 h-4 ${step.active ? "text-white" : "text-[#667781]"}`} />
                            </div>
                            {step.active && <span className="absolute -inset-1 rounded-full border-2 border-[#25D366] animate-ping opacity-50" />}
                          </div>
                          <div className="flex-1 min-w-0 pb-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="text-[13px] font-semibold text-[#111B21] leading-tight">{step.title}</p>
                              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${step.active ? "bg-[#25D366] text-white" : "bg-[#E9EDEF] text-[#667781]"}`}>
                                {step.eta}
                              </span>
                            </div>
                            <p className="text-[11.5px] text-[#667781] mt-0.5 leading-snug">{step.desc}</p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>

                {/* Coupon */}
                <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.85 }}
                  className="bubble-in max-w-[88%] mb-3 ml-1 px-3.5 py-3">
                  <p className="text-[11px] text-[#667781] mb-1">🎁 Welcome gift</p>
                  <div className="rounded-lg p-3 text-center" style={{ background: "linear-gradient(135deg, #FFF6D9, #FFE8A3)", border: "1.5px dashed #E5A800" }}>
                    <p className="text-[10px] uppercase tracking-widest text-[#8B6F00] font-bold mb-1">Coupon</p>
                    <p className="text-2xl font-black tracking-wider shimmer-text">SUPERSTAY1000</p>
                    <p className="text-[11px] font-semibold text-[#8B6F00] mt-1">₹1,000 off your first month</p>
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
                  className="flex justify-center gap-3 mb-2 text-[11px] text-[#667781]">
                  <span className="flex items-center gap-1"><Shield className="w-3 h-3 text-[#128C7E]" /> Zero brokerage</span>
                  <span>·</span>
                  <span className="flex items-center gap-1"><Check className="w-3 h-3 text-[#128C7E]" /> Verified PGs</span>
                </motion.div>

                {/* Sticky compose-bar style CTAs */}
                <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.45, type: "spring", stiffness: 220, damping: 22 }}
                  className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md px-3 pt-6 pb-4 z-40"
                  style={{ background: "linear-gradient(180deg, transparent, rgba(236,229,221,0.95) 30%, #ECE5DD 60%)" }}>

                  <a href={gharpayyWaUrl} target="_blank" rel="noopener noreferrer"
                    className="w-full h-13 flex items-center justify-center gap-2.5 rounded-full text-[15px] font-bold no-underline px-5 py-3.5 btn-gold mb-2">
                    <Send className="w-5 h-5" />
                    Send to Gharpayy WhatsApp
                  </a>

                  <button type="button" onClick={() => setShowCustomNum(s => !s)}
                    className="w-full h-11 flex items-center justify-center gap-2 rounded-full text-[13px] font-semibold btn-outline-wa mb-1">
                    <MessageCircle className="w-4 h-4" />
                    {showCustomNum ? "Hide" : "Send to any WhatsApp number"}
                  </button>

                  {showCustomNum && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                      className="mt-2 flex gap-2">
                      <input type="tel" value={customWaNum} onChange={e => setCustomWaNum(e.target.value)}
                        placeholder="WhatsApp number (with country code)"
                        className="flex-1 rounded-full px-4 h-11 text-[13px] outline-none bg-white border border-black/10 placeholder:text-[#8696a0] focus:border-[#25D366] focus:shadow-[0_0_0_3px_rgba(37,211,102,0.15)]" />
                      <a href={customWaUrl || "#"}
                        target={customWaUrl ? "_blank" : undefined}
                        rel="noopener noreferrer"
                        onClick={e => { if (!customWaUrl) e.preventDefault(); }}
                        className={`h-11 px-4 rounded-full flex items-center justify-center btn-brand text-[13px] ${!customWaUrl ? "opacity-50 pointer-events-none" : ""}`}>
                        <Send className="w-4 h-4" />
                      </a>
                    </motion.div>
                  )}

                  <p className="text-[10px] text-center mt-2 text-[#667781]">
                    Opens WhatsApp · We reply in ~10 min
                  </p>
                </motion.div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
