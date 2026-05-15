## North star

Every tap saves the expert (and the user) a 20-minute call. The form should feel like a senior Gharpayy expert sitting next to you — anticipating, confirming, and never asking twice. No Continue buttons. No "which one was the question?" confusion. Full keyboard + back/forward + theme. Student-friendly. Zone-deep.

All work is frontend-only inside `src/components/gharpayy-form.tsx`, `src/components/form-ui.tsx`, `src/components/header-ticker.tsx`, and `src/styles.css`. No backend, no new deps.

---

## 1. Kill every Continue button → smart auto-advance

A small `useAutoAdvance(value, fn, ms)` hook drives this. The only explicit submit that survives is **Send to expert** on the contact step (trust anchor).

- **Single-choice steps**: already auto-advance on tap (keep — tighten delay to 220ms).
- **Multi-select** (`zone_areas`, `matters`, `dealbreakers`): show a live **"Auto-continuing in 3… 2… 1"** chip at the bottom that resets on every toggle (2.5s window). Tap the chip = continue immediately. Optional steps show a tiny inline `Skip` link beside the countdown.
- **Text steps** (`workplace`, `zone_special`, `matters_other`, `area_other`): debounced auto-advance 900ms after last keystroke when length ≥ 2 (or always for optional). Inline pill **"Saved · moving on…"** replaces the button. Enter still advances instantly.
- **Name**: same 900ms debounce, length ≥ 1.
- **Budget exact**: 700ms after chip pick; custom-number uses the text debounce; food toggle adds 1.2s grace then advances.
- **Contact**: auto-validates as user types; the **Send to expert** button enables the moment 10 digits are present and pulses gently. No separate "Skip", no "Verify".
- All buttons get `min-h-[56px]` tap target. Remove every chevron — full row is the action.

---

## 2. Question vs options — unmistakable hierarchy

Right now the question bubble and the option chips look similar. Refactor every step renderer to use a shared `<QuestionCard>` block:

- **Question bubble**: 16px / weight 700 in `var(--font-display)`, with a small teal pill eyebrow **"QUESTION"** above. 
- **12px breathing gap** + a 1px hairline divider between question and answers.
- **Answer surface**: lighter background (`#F7F8FA` light / `#1F2A30` dark), inner top-left label **"Tap to choose"** (single) / **"Tap any that apply"** (multi) / **"Type your answer"** (text), all in 10px uppercase muted.
- **Choice options**: prepend a tiny `A` `B` `C` `D` index badge to each title — instantly reads as a multiple-choice answer set.
- **Echoed user replies** in `HistoryStep`: keep the green out-bubble; prefix with `→` and dim the older Q above each historical answer at 60% opacity for clean Q→A pairing on scroll-back.

---

## 3. Add a Student scenario (and student-aware downstream)

In the `story` step, insert between `intern` and `relocate`:

```
{ v: "student", t: "Student starting at a college / university", d: "Hostel-tired or first-time mover. Campus-zone stays ready." }
```

- `STORY_INSIGHT.student`: "We have student clusters at Christ, IIM-B, RV, PES, MSRIT, Jain, Mount Carmel — same-college floors when available."
- `L_STORY.student = "Student"` (for WhatsApp brief).
- Routing: `student` → `in_blr` (same as `newjob`).
- `workplace` step: change label to "Office or college name?" (already there) and add chips: `Christ University`, `IIM Bangalore`, `RV College`, `PES University`, `MSRIT`, `Jain University`, `Mount Carmel`, `St. Joseph's`.
- New gentle insight on workplace if `story === "student"`: "We'll match you with same-college residents wherever possible."

---

## 4. "Belt"/"side" → "zone" (global) + much deeper area lists

Copy pass. In `gharpayy-form.tsx`:

- `ZONE_OPTS` titles: drop "belt", use "zone".
  - East — Whitefield zone
  - ORR — Bellandur zone
  - North — Manyata zone
  - Central — Koramangala zone
  - South — Electronic City zone
- `ZONE_INSIGHT`, `L_ZONE`, the `zone` step `q`/`qs`, header ticker copy in `header-ticker.tsx`, and welcome bubble: replace every "belt" / "side of you" with "zone".

Expand `ZONE_AREAS` so nothing important is missed (additions only — keep existing):

- **east**: + Kadugodi, Channasandra, Hope Farm, Sadaramangala, Doddanekundi, Garudachar Palya, Borewell Road, Forum Shantiniketan, Kundalahalli Gate, Hagadur, Immadihalli, Pattandur Agrahara.
- **orr**: + Kasavanahalli, Bagmane Tech Park, Iblur, Panathur, Carmelaram, Haralur Road, Sompura Gate, Wipro Sarjapur, Ecospace, Salarpuria Sattva, Bellandur Lake, Kaikondrahalli, Sakra Hospital.
- **north**: + RT Nagar, Banaswadi, Kalyan Nagar, HRBR Layout, Horamavu, Kammanahalli, Bhartiya City, Yelahanka New Town, Vidyaranyapura, Aerospace Park, Kogilu, Devanahalli road, Jakkur Aerodrome.
- **central**: + Jeevan Bhima Nagar, HAL, New Thippasandra, CV Raman Nagar, Benson Town, Cox Town, Murphy Town, Halasuru, Brigade Road, Church Street, Commercial Street, St Marks Road, Residency Road, Langford Town.
- **south**: + Begur, Hulimavu, Arekere, Gottigere, Chandapura, Neeladri Nagar, Singasandra, Kudlu Gate, Hongasandra, Banashankari, Uttarahalli, Konanakunte, Kanakapura main road, NICE road junction.

The "+ Add another area" free text already exists — keep, and increase its prominence (own row under chips, not buried).

---

## 5. Back / Forward navigation (real, two-way)

- Maintain two stacks: `history` (back) and `future` (forward, cleared on any new pick).
- `back()`: pop `history` → push current onto `future` → setCur(prev). Already partially exists — extend.
- `forward()`: pop `future` → push current onto `history` → setCur(next). Disabled (greyed) when `future` is empty.
- Render a **▸ forward** chevron in `ChatHeader` next to the back chevron.
- Keyboard: `Alt+←` back, `Alt+→` forward, `Esc` to focus the question.
- Forward is blocked past `contact` while phone is invalid (safety).
- All persisted answers stay intact when going back, so re-tapping a previously chosen option is a no-op visual highlight.

---

## 6. Light / Dark theme toggle

- Sun/moon icon in `ChatHeader` top-right, next to menu.
- Persist in `localStorage("gharpayy.theme")`. Default = light. Respect `prefers-color-scheme` on first visit.
- Implementation: toggle `data-theme="dark"` on `<html>`. In `src/styles.css` add a `[data-theme="dark"]` block redefining tokens to a WhatsApp-dark palette:
  - `--brand-navy` → `#0B141A`
  - chat background → `#0B141A` with the same dotted overlay at lower opacity
  - in-bubble surface → `#202C33`
  - out-bubble surface → `#005C4B`
  - text primary `#E9EDEF`, muted `#8696A0`
  - gold accents stay for CTAs (legibility tested)
- Introduce 4 new tokens — `--surface`, `--surface-alt`, `--text`, `--text-muted` — and swap the hardcoded `#FFFFFF`, `#111B21`, `#667781` in form components for these tokens.
- Animate token swap with a 200ms fade on `<body>` so the switch feels deliberate.

---

## 7. The 15x extras (the difference between 10x and 15x)

Small, high-leverage adds that compound with everything above:

1. **Step badge on every question**: only color pill above the QUESTION eyebrow. Burns down as user progresses — proven completion booster.
2. **Smart defaults from earlier answers**: if `story === "intern"`, pre-highlight (not pre-pick) BASIC tier and "Within 2 weeks" move-in. If `story === "student"`, pre-highlight Christ/PES/etc nearest to chosen zone.
3. **Sticky "Your brief so far"** drawer handle at bottom-right (collapsed pill: "Your brief · 7 answers"). Tap to peek a live summary. Builds trust + lets users sanity-check before submit.
4. **Single-tap "Same as above"**: on `radius`, if user picked "Walking ~1km" before for another scenario in this session, show it as a one-tap suggestion chip.
5. **Inline doubt resolver**: under each question a tiny **"Why we ask"** link → expands a 1-line plain-language reason. ("So we don't show stays your commute will hate.") Builds the consultative feel.
6. **Voice-input mic** on every text input (`webkitSpeechRecognition` where available — graceful fallback to keyboard). Huge for mobile typers.
7. **Anti-rage bumper**: if a user taps Back 3 times in 5s, surface a small "Want to start over instead?" toast with a one-tap reset. Otherwise no confirms anywhere.
8. **Reveal screen** (no behavior change beyond auto-copy already shipped): add a one-line **"Aayushi will reply within 30 mins · or your brief stays auto-saved here"** under the WhatsApp button so users feel safe closing the tab.
9. **a11y pass**: every button gets `aria-label`, every question is an `h2`, focus ring restored, theme toggle announced.
10. **Analytics-ready data attributes**: `data-step`, `data-answer-key`, `data-zone` on key elements so when Cloud lands later we can wire drop-off without another refactor.

---

## 8. Files touched

- `src/components/gharpayy-form.tsx` — auto-advance hook & wiring, Student scenario, expanded areas, zone copy, back/forward stacks, theme toggle, QuestionCard refactor, step badge, smart defaults, brief drawer, why-we-ask, voice mic, anti-rage toast, a11y, data-attrs.
- `src/components/form-ui.tsx` — `ChatHeader` (forward chevron + theme toggle + sun/moon), shared `QuestionCard`, A/B/C/D index badge, "Tap to choose" inner label, larger tap targets.
- `src/components/header-ticker.tsx` — replace any "belt"/"side" wording.
- `src/styles.css` — `[data-theme="dark"]` block, new `--surface`/`--text` tokens, fade transition.

No new files, no deps, no backend changes.

---

## 9. Out of scope (still pending your call)

- Lovable Cloud + leads database (proposed earlier).
- Real analytics provider (data-attrs are seeded, no SDK).
- Re-enabling `MatchPreview` on reveal.

---

## 10. Order of implementation

1. Tokens + theme toggle + dark CSS block (foundation everything else lives on).
2. `useAutoAdvance` hook + remove `ContinueBtn` from every renderer except contact.
3. `QuestionCard` refactor + A/B/C/D indices + "Tap to choose" labels + step badge.
4. Back/forward stacks + keyboard shortcuts + header chevrons.
5. Student scenario (story option, insight, label, workplace chips).
6. Zone "belt"→"zone" copy + expanded `ZONE_AREAS`.
7. Brief drawer + why-we-ask + smart-default highlights + voice mic.
8. Anti-rage toast + a11y pass + data-attrs + reveal sub-line.