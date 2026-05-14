import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, Check, ChevronDown, Sparkles, Phone, Shield, Star, Zap,
  Utensils, Laptop, Moon, Car, AlertCircle, Clock,
  TrendingDown, Home as HomeIcon, Plane, Globe,
  MessageCircle, Headphones, Key, CalendarCheck,
} from "lucide-react";

// 👉 Replace with Gharpayy's official WhatsApp number (digits only, with country code, no '+')
const GHARPAYY_WHATSAPP = "919876543210";
import { type Lang, langLabels, t, getAmenityKeys } from "@/lib/i18n";
import {
  ChatHeader, BackBar, NextBtn, GlassCard, FieldLabel, Sub, StepTitle,
  Toggle, PillGroup, TextInput, BudgetSlider, Confetti, anim, trans,
} from "@/components/form-ui";

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

const S = { WELCOME: 0, SCENARIO_1: 1, SCENARIO_2: 2, LOCATION: 3, LIFESTYLE: 4, CONTACT: 5, SUCCESS: 6 };
const TOTAL = 5;

const scenarioColors: Record<string, string> = {
  arrived: "oklch(0.65 0.15 230)",
  escape: "oklch(0.60 0.20 25)",
  moving: "oklch(0.55 0.22 295)",
  upgrade: "oklch(0.80 0.16 85)",
  budget: "oklch(0.55 0.15 155)",
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

function buildWhatsAppMessage(data: LeadData, lang: Lang, chips: string[], budgetMin: number, budgetMax: number, fillTime: number): string {
  const lines: string[] = [];
  lines.push(`🏠 *${t(lang, "brand")} - ${t(lang, "heroTitle1")} ${t(lang, "heroTitle2")}*`);
  lines.push("");
  if (data.name) lines.push(`👤 *Name:* ${data.name}`);
  if (data.scenario) {
    const scenarioKeys: Record<string, "scenarioArrived" | "scenarioEscape" | "scenarioMoving" | "scenarioUpgrade" | "scenarioBudget"> = {
      arrived: "scenarioArrived", escape: "scenarioEscape", moving: "scenarioMoving",
      upgrade: "scenarioUpgrade", budget: "scenarioBudget",
    };
    const key = scenarioKeys[data.scenario];
    lines.push(`📋 *Scenario:* ${key ? t(lang, key) : data.scenario}`);
  }
  if (data.preferredLocation) lines.push(`📍 *Location:* ${data.preferredLocation}`);
  lines.push(`💰 *Budget:* ₹${budgetMin.toLocaleString()} – ₹${budgetMax.toLocaleString()}`);
  if (data.roomType) lines.push(`🛏️ *Room:* ${data.roomType}`);
  if (data.gender) lines.push(`👤 *Gender:* ${data.gender}`);
  if (data.occupation) lines.push(`💼 *Occupation:* ${data.occupation}`);
  if (data.diet) lines.push(`🍽️ *Diet:* ${data.diet}`);
  if (data.wfhDays) lines.push(`💻 *WFH:* ${data.wfhDays}`);
  if (data.needsParking) lines.push(`🚗 *Parking:* Yes`);
  if (chips.length > 0) lines.push(`✅ *Amenities:* ${chips.join(", ")}`);
  lines.push("");
  lines.push(`⏱️ Filled in ${fillTime}s`);
  lines.push(`🎟️ Coupon: SUPERSTAY1000`);
  lines.push("");
  lines.push(`🔗 ${typeof window !== "undefined" ? window.location.href : ""}`);
  return lines.join("\n");
}

export default function GharpayyForm() {
  const [lang, setLang] = useState<Lang>("en");
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [step, setStep] = useState(S.WELCOME);
  const [data, setData] = useState<LeadData>({ scenario: null });
  const [budgetMin, setBudgetMin] = useState(8000);
  const [budgetMax, setBudgetMax] = useState(25000);
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

  const set = useCallback((patch: Partial<LeadData>) => setData(d => ({ ...d, ...patch })), []);
  const startTimer = useCallback(() => { if (!startTime) setStartTime(Date.now()); }, [startTime]);
  const next = useCallback((n = 1) => { startTimer(); setStep(s => s + n); }, [startTimer]);
  const back = useCallback(() => setStep(s => Math.max(0, s - 1)), []);

  const progress = step > 0 && step < S.SUCCESS ? (step / TOTAL) * 100 : 0;
  const scenario = data.scenario;
  const sc = getScenarioConfig(lang).find(s => s.id === scenario);

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
    // Simulate save
    await new Promise(r => setTimeout(r, 800));
    set({ name: nameVal, phone: phoneVal, email: emailVal || undefined, budgetMin, budgetMax, whatMatters: chips });
    setShowConfetti(true);
    setStep(S.SUCCESS);
    setTimeout(() => setShowConfetti(false), 4500);
    setSubmitting(false);
  };

  const amenityKeys = getAmenityKeys();

  const whatsappUrl = `https://wa.me/${GHARPAYY_WHATSAPP}?text=${encodeURIComponent(
    buildWhatsAppMessage({ ...data, name: nameVal, phone: phoneVal, email: emailVal }, lang, chips, budgetMin, budgetMax, fillTime)
  )}`;

  return (
    <div className="min-h-[100dvh] w-full flex justify-center" style={{ background: "#075E54" }}>
      {showConfetti && <Confetti />}
      <div className="w-full max-w-md relative min-h-[100dvh] flex flex-col overflow-hidden wa-chat-bg">
        {step === S.WELCOME && <ChatHeader subtitle="typing…" />}
        {step > 0 && step < S.SUCCESS && (
          <BackBar step={step} onBack={back} progress={progress} total={TOTAL} lang={lang} />
        )}
        {step === S.SUCCESS && <ChatHeader subtitle="online" />}

        <div className="flex-1 flex flex-col overflow-y-auto">
          <AnimatePresence mode="wait">

            {/* ──── WELCOME ──── */}
            {step === S.WELCOME && (
              <motion.div key="welcome" variants={anim} initial="enter" animate="center" exit="exit" transition={trans}
                className="flex-1 flex flex-col px-6 pt-8 pb-10">

                {/* Language selector */}
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 relative">
                  <button type="button" onClick={() => setShowLangMenu(!showLangMenu)}
                    className="inline-flex items-center gap-2 rounded-full px-4 py-2 glass-surface-gold">
                    <Globe className="w-3.5 h-3.5 text-primary" />
                    <span className="text-xs font-bold text-primary">{langLabels[lang]}</span>
                    <ChevronDown className="w-3 h-3 text-primary" />
                  </button>
                  {showLangMenu && (
                    <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                      className="absolute top-full mt-2 left-0 z-50 rounded-xl p-1 glass-surface min-w-[160px]"
                      style={{ backdropFilter: "blur(20px)" }}>
                      {(Object.keys(langLabels) as Lang[]).map(l => (
                        <button key={l} type="button"
                          onClick={() => { setLang(l); setShowLangMenu(false); }}
                          className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${lang === l ? "text-primary bg-primary/10" : "text-foreground hover:bg-primary/5"}`}>
                          {langLabels[l]}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </motion.div>

                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
                  className="flex items-center gap-3 mb-8 flex-wrap">
                  <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 glass-surface-gold">
                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                    <span className="text-xs font-bold tracking-widest uppercase text-primary">{t(lang, "brand")}</span>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full px-4 py-2"
                    style={{ background: "rgba(99,220,140,0.08)", border: "1px solid rgba(99,220,140,0.2)" }}>
                    <Zap className="w-3 h-3" style={{ color: "oklch(0.70 0.18 155)" }} />
                    <span className="text-xs font-bold" style={{ color: "oklch(0.72 0.16 155)" }}>{t(lang, "tagline")}</span>
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} className="mb-4">
                  <h1 className="text-[2.6rem] font-black leading-[1.05] text-foreground tracking-tight">
                    {t(lang, "heroTitle1")}<br />
                    <span className="gold-gradient-text">{t(lang, "heroTitle2")}</span>
                  </h1>
                  <p className="text-xs mt-2 font-medium tracking-wide text-muted-foreground">{t(lang, "heroSub")}</p>
                </motion.div>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.18 }}>
                  <p className="text-base mb-8 text-muted-foreground" style={{ lineHeight: 1.65 }}>
                    {t(lang, "heroDesc1")}{" "}
                    <span className="font-semibold text-foreground">{t(lang, "heroDesc2")}</span>
                  </p>
                </motion.div>

                <div className="space-y-3 mb-8">
                  {getScenarioConfig(lang).map((s, i) => {
                    const Icon = s.icon;
                    return (
                      <motion.button key={s.id} type="button"
                        initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.22 + i * 0.06 }}
                        onClick={() => { set({ scenario: s.id }); next(); }}
                        className="w-full flex items-center gap-4 rounded-2xl p-4 text-left transition-all glass-surface hover:translate-x-1">
                        <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ background: `${s.color}30` }}>
                          <Icon className="w-5 h-5" style={{ color: s.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-foreground text-sm">{s.headline}</p>
                          <p className="text-xs mt-0.5 text-muted-foreground">{s.sub}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 flex-shrink-0 text-muted-foreground" />
                      </motion.button>
                    );
                  })}
                </div>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
                  className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5"><Shield className="w-3 h-3" />{t(lang, "zeroBrokerage")}</span>
                  <span className="flex items-center gap-1.5"><Phone className="w-3 h-3" />{t(lang, "personalCall")}</span>
                  <span className="flex items-center gap-1.5"><HomeIcon className="w-3 h-3" />{t(lang, "stayPeacefully")}</span>
                </motion.div>
              </motion.div>
            )}

            {/* ──── SCENARIO STEP 1 ──── */}
            {step === S.SCENARIO_1 && (
              <motion.div key="sc1" variants={anim} initial="enter" animate="center" exit="exit" transition={trans}
                className="flex-1 flex flex-col px-6 pt-8 pb-8">

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
                    <div className="space-y-2.5">
                      {(["escapeNoise","escapeCleanliness","escapeFood","escapeOwner","escapeWifi","escapeCurfew","escapeExpensive","escapeMultiple"] as const).map(key => {
                        const id = key.replace("escape", "").toLowerCase();
                        const active = data.mainPain === id;
                        return (
                          <button key={id} type="button"
                            onClick={() => { set({ mainPain: id }); next(); }}
                            className="w-full text-left px-4 py-3.5 rounded-2xl text-sm font-medium transition-all"
                            style={{
                              background: active ? "rgba(234,179,8,0.1)" : "rgba(255,255,255,0.03)",
                              border: `1px solid ${active ? "oklch(0.80 0.16 85)" : "rgba(255,255,255,0.07)"}`,
                              color: active ? "oklch(0.88 0.12 85)" : "oklch(0.75 0.02 80)",
                            }}>
                            {active && <Check className="inline w-3.5 h-3.5 mr-2" />}"{t(lang, key)}"
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {scenario === "moving" && (
                  <div className="flex-1 flex flex-col gap-6">
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
                      <div>
                        <p className="text-sm font-bold text-foreground">{t(lang, "movingTravelBooked")}</p>
                      </div>
                      <Toggle value={data.travelBooked ?? false} onChange={v => set({ travelBooked: v })} />
                    </GlassCard>
                    <NextBtn onClick={() => next()} label={t(lang, "continueBtn")} />
                  </div>
                )}

                {scenario === "upgrade" && (
                  <div className="flex-1 flex flex-col gap-6">
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
                  <div className="flex-1 flex flex-col gap-6">
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

            {/* ──── SCENARIO STEP 2 (skipped for arrived/escape — they auto-advance) ──── */}
            {step === S.SCENARIO_2 && (
              <motion.div key="sc2" variants={anim} initial="enter" animate="center" exit="exit" transition={trans}
                className="flex-1 flex flex-col px-6 pt-8 pb-8">
                <StepTitle eyebrow={scenarioEyebrow()} title={t(lang, "locationTitle")} />
                <NextBtn onClick={() => next()} label={t(lang, "continueBtn")} />
              </motion.div>
            )}

            {/* ──── LOCATION ──── */}
            {step === S.LOCATION && (
              <motion.div key="location" variants={anim} initial="enter" animate="center" exit="exit" transition={trans}
                className="flex-1 flex flex-col px-6 pt-8 pb-8">
                <div className="flex-1 space-y-6">
                  <StepTitle eyebrow={scenarioEyebrow()} title={t(lang, "locationTitle")} />
                  <Sub>{t(lang, "locationSub")}</Sub>
                  <div>
                    <FieldLabel>{t(lang, "locationPreferred")}</FieldLabel>
                    <TextInput value={data.preferredLocation} onChange={v => set({ preferredLocation: v })}
                      placeholder={t(lang, "locationPlaceholder")} />
                  </div>
                  <BudgetSlider min={budgetMin} max={budgetMax} onChange={(mn, mx) => { setBudgetMin(mn); setBudgetMax(mx); }} />
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
                        { id: "male", label: t(lang, "genderMale") },
                        { id: "female", label: t(lang, "genderFemale") },
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
                <div className="pt-6">
                  <NextBtn onClick={() => next()} label={t(lang, "continueBtn")} />
                </div>
              </motion.div>
            )}

            {/* ──── LIFESTYLE ──── */}
            {step === S.LIFESTYLE && (
              <motion.div key="lifestyle" variants={anim} initial="enter" animate="center" exit="exit" transition={trans}
                className="flex-1 flex flex-col px-6 pt-8 pb-8">
                <div className="flex-1 space-y-7">
                  <StepTitle eyebrow={t(lang, "lifestyleEyebrow")} title={t(lang, "lifestyleTitle")} />
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Utensils className="w-4 h-4 text-primary" />
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
                    <div className="flex items-center gap-2 mb-3">
                      <Laptop className="w-4 h-4 text-primary" />
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
                    <div className="flex items-center gap-2 mb-3">
                      <Moon className="w-4 h-4 text-primary" />
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
                      <Car className="w-4 h-4 text-primary" />
                      <div>
                        <p className="text-sm font-bold text-foreground">{t(lang, "needParking")}</p>
                        <p className="text-xs mt-0.5 text-muted-foreground">{t(lang, "needParkingSub")}</p>
                      </div>
                    </div>
                    <Toggle value={data.needsParking ?? false} onChange={v => set({ needsParking: v })} />
                  </GlassCard>
                </div>
                <div className="pt-7 space-y-3">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {amenityKeys.map(key => {
                      const label = t(lang, key);
                      const on = chips.includes(key);
                      return (
                        <button key={key} type="button"
                          onClick={() => setChips(prev => on ? prev.filter(x => x !== key) : [...prev, key])}
                          className="px-3.5 py-2 rounded-full text-xs font-semibold transition-all"
                          style={{
                            background: on ? "linear-gradient(135deg, oklch(0.80 0.16 85), oklch(0.72 0.16 85))" : "rgba(255,255,255,0.04)",
                            border: `1px solid ${on ? "transparent" : "rgba(255,255,255,0.08)"}`,
                            color: on ? "oklch(0.18 0.03 260)" : "oklch(0.55 0.03 260)",
                            boxShadow: on ? "0 4px 12px rgba(234,179,8,0.3)" : "none",
                          }}>
                          {on && <Check className="inline w-3 h-3 mr-1.5" />}{label}
                        </button>
                      );
                    })}
                  </div>
                  <NextBtn onClick={() => next()} label={t(lang, "oneLastThing")} />
                </div>
              </motion.div>
            )}

            {/* ──── CONTACT ──── */}
            {step === S.CONTACT && (
              <motion.div key="contact" variants={anim} initial="enter" animate="center" exit="exit" transition={trans}
                className="flex-1 flex flex-col px-6 pt-8 pb-8">
                <div className="flex-1">
                  <StepTitle eyebrow={t(lang, "contactEyebrow")} title={t(lang, "contactTitle")} />
                  <p className="text-base mb-8 text-muted-foreground" style={{ lineHeight: 1.6 }}>
                    {t(lang, "contactDesc")}
                  </p>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-foreground/80">{t(lang, "yourName")}</label>
                      <TextInput value={nameVal} onChange={setNameVal} placeholder={t(lang, "namePlaceholder")} />
                      {nameErr && <p className="text-xs mt-1.5 text-destructive">{nameErr}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-foreground/80">{t(lang, "whatsappNumber")}</label>
                      <TextInput value={phoneVal} onChange={setPhoneVal} placeholder={t(lang, "phonePlaceholder")} type="tel" />
                      {phoneErr && <p className="text-xs mt-1.5 text-destructive">{phoneErr}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-foreground/80">
                        {t(lang, "emailLabel")} <span className="font-normal text-muted-foreground">{t(lang, "emailOptional")}</span>
                      </label>
                      <TextInput value={emailVal} onChange={setEmailVal} placeholder={t(lang, "emailPlaceholder")} type="email" />
                    </div>
                  </div>
                  <p className="text-xs mt-5 text-center text-muted-foreground">{t(lang, "infoPrivacy")}</p>
                </div>
                <div className="pt-6">
                  <button type="button" onClick={handleSubmit} disabled={submitting}
                    className="w-full h-14 flex items-center justify-center gap-2.5 rounded-2xl text-base font-extrabold btn-gold disabled:opacity-60 transition-all">
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
              <motion.div key="success"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex-1 flex flex-col px-4 pt-4 pb-28">

                {/* Date pill */}
                <div className="flex justify-center mb-3">
                  <span className="px-3 py-1 rounded-full text-[11px] font-medium text-[#54656F]"
                    style={{ background: "rgba(225,245,254,0.92)", boxShadow: "0 1px 0.5px rgba(11,20,26,0.08)" }}>
                    Today
                  </span>
                </div>

                {/* Incoming: hero */}
                <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 }}
                  className="bubble-in max-w-[88%] mb-2 ml-1 px-3.5 py-2.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#25D366] mb-1">Gharpayy · Aayushi</p>
                  <p className="text-[15px] font-semibold text-[#111B21] leading-snug">
                    Hey {nameVal?.split(" ")[0] || "there"} 👋
                  </p>
                  <p className="text-[14px] text-[#111B21] leading-snug mt-1">
                    Got your details{fillTime > 0 ? ` (filled in ${fillTime}s — fast!)` : ""}. I'm personally on this. Here's exactly what happens next 👇
                  </p>
                  <p className="text-[10px] text-[#667781] text-right mt-1">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ✓✓</p>
                </motion.div>

                {/* Outgoing: lead summary */}
                <motion.div initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}
                  className="self-end bubble-out max-w-[88%] mb-2 mr-1 px-3.5 py-2.5">
                  <p className="text-[11px] font-bold text-[#128C7E] mb-1.5">📋 My requirements</p>
                  <div className="text-[13px] text-[#111B21] space-y-0.5 leading-snug">
                    {data.preferredLocation && <p>📍 {data.preferredLocation}</p>}
                    <p>💰 ₹{budgetMin.toLocaleString()} – ₹{budgetMax.toLocaleString()}/mo</p>
                    {data.roomType && <p>🛏️ {data.roomType}</p>}
                    {data.diet && <p>🍽️ {data.diet.replace("_", " ")}</p>}
                    {chips.length > 0 && <p>✨ +{chips.length} amenities</p>}
                  </div>
                  <p className="text-[10px] text-[#667781] text-right mt-1">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ✓✓</p>
                </motion.div>

                {/* Incoming: ETA pill */}
                <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}
                  className="bubble-in max-w-[88%] mb-2 ml-1 px-3.5 py-2.5">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-full bg-[#DCF8C6] flex items-center justify-center">
                      <Phone className="w-3.5 h-3.5 text-[#128C7E]" />
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-[#111B21] leading-tight">Personal call in ~10 min</p>
                      <p className="text-[11px] text-[#667781] leading-tight">Mon–Sun · 9 AM – 9 PM IST</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-[#667781]">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#25D366]"></span>
                    </span>
                    Aayushi is reviewing your profile…
                  </div>
                  <p className="text-[10px] text-[#667781] text-right mt-1">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ✓✓</p>
                </motion.div>

                {/* Incoming: timeline */}
                <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }}
                  className="bubble-in max-w-[92%] mb-2 ml-1 px-3.5 py-3">
                  <p className="text-[11px] font-bold text-[#128C7E] mb-3">⏱️ What happens next</p>
                  <div className="space-y-3.5">
                    {[
                      { icon: Headphones, eta: "in 10 min", title: "Personal call from Aayushi", desc: "We'll confirm your needs & shortlist 3–5 verified options.", active: true },
                      { icon: HomeIcon, eta: "today", title: "Curated PG/flat shortlist", desc: "Photos, exact rent, deposit, distance — sent on WhatsApp.", active: false },
                      { icon: CalendarCheck, eta: "1–2 days", title: "Free property visits", desc: "We schedule visits on your slot. No broker, no pushy sales.", active: false },
                      { icon: Key, eta: "3–5 days", title: "Move in peacefully", desc: "Zero brokerage. Honest paperwork. We stay with you after.", active: false },
                    ].map((step, i) => {
                      const Icon = step.icon;
                      return (
                        <motion.div key={i}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.45 + i * 0.08 }}
                          className="flex gap-3 relative">
                          {i < 3 && <div className="absolute left-[15px] top-8 bottom-[-14px] w-px bg-[#E9EDEF]" />}
                          <div className="relative flex-shrink-0">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step.active ? "bg-[#25D366]" : "bg-[#E9EDEF]"}`}>
                              <Icon className={`w-4 h-4 ${step.active ? "text-white" : "text-[#667781]"}`} />
                            </div>
                            {step.active && (
                              <span className="absolute -inset-1 rounded-full border-2 border-[#25D366] animate-ping opacity-50" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0 pb-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="text-[13px] font-semibold text-[#111B21] leading-tight">{step.title}</p>
                              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${step.active ? "bg-[#25D366] text-white" : "bg-[#E9EDEF] text-[#667781]"}`}>
                                {step.eta}
                              </span>
                            </div>
                            <p className="text-[12px] text-[#667781] mt-0.5 leading-snug">{step.desc}</p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                  <p className="text-[10px] text-[#667781] text-right mt-2">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ✓✓</p>
                </motion.div>

                {/* Incoming: coupon */}
                <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }}
                  className="bubble-in max-w-[88%] mb-2 ml-1 px-3.5 py-3">
                  <p className="text-[11px] text-[#667781] mb-1">🎁 A little welcome gift</p>
                  <div className="rounded-lg p-3 text-center" style={{ background: "linear-gradient(135deg, #DCF8C6, #B7E8A1)", border: "1px dashed #25D366" }}>
                    <p className="text-[10px] uppercase tracking-widest text-[#128C7E] font-bold mb-1">Coupon</p>
                    <p className="text-xl font-black tracking-wider shimmer-text">SUPERSTAY1000</p>
                    <p className="text-[11px] font-semibold text-[#128C7E] mt-1">₹1,000 off your first month</p>
                  </div>
                  <p className="text-[10px] text-[#667781] text-right mt-1">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ✓✓</p>
                </motion.div>

                {/* Trust badges */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.85 }}
                  className="flex justify-center gap-4 my-3 text-[11px] text-[#667781]">
                  <span className="flex items-center gap-1"><Shield className="w-3 h-3 text-[#128C7E]" /> Zero brokerage</span>
                  <span className="flex items-center gap-1"><Check className="w-3 h-3 text-[#128C7E]" /> Verified PGs</span>
                </motion.div>

                {/* Sticky compose-bar style CTA */}
                <motion.div initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5, type: "spring", stiffness: 220, damping: 22 }}
                  className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md px-3 py-3 z-40"
                  style={{ background: "linear-gradient(180deg, transparent, #ECE5DD 35%)" }}>
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
                    className="w-full h-13 flex items-center justify-center gap-2.5 rounded-full text-[15px] font-bold no-underline px-5 py-3.5"
                    style={{
                      background: "linear-gradient(135deg, #25D366, #128C7E)",
                      color: "#fff",
                      boxShadow: "0 8px 24px rgba(37,211,102,0.38)",
                    }}>
                    <MessageCircle className="w-5 h-5 fill-white" />
                    Send my requirements to Gharpayy
                    <ArrowRight className="w-4 h-4" />
                  </a>
                  <p className="text-[10px] text-center mt-1.5 text-[#667781]">Opens WhatsApp · We reply within 10 minutes</p>
                </motion.div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
