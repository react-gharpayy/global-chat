
# Reveal cleanup + 10x zone capture + exact budget + auto-copy

Tightens the final screen, captures area + radius + exact budget so the expert never has to ask twice, auto-copies the brief, and prunes emoji noise. Every answer is designed to save the expert (and the user) one back-and-forth call.

Guiding rule for every button on the page: **one tap = one decision saved later**. No dead ends, no "back to start", no double-confirm modals, no required typing where a chip will do.

---

## 1. Reveal screen — remove distraction, add auto-copy

The final screen should feel like a receipt, not a marketplace.

- In `src/components/gharpayy-form.tsx` reveal section: remove `<MatchPreview />`. Keep `MovePlanCard`, the WhatsApp send card, "what happens next" timeline, full brief accordion. (Leave `match-preview.tsx` in repo, unused.)
- Add a `useEffect` that runs once when `cur === "reveal"`:
  - `await navigator.clipboard.writeText(waMessage)` → `setCopied(true)` and show a green inline chip above the WhatsApp card: **"Brief auto-copied — paste anywhere ✓"**
  - On failure (Safari permission, etc.) show: **"Tap copy to grab your brief"**
- Existing "Copy my brief" button stays, relabels to **"Copy again"** once auto-copy succeeded. Tooltip: "Already on your clipboard."
- Privacy line moves ABOVE the phone input on the `contact` step (currently below).

## 2. The "every answer saves 20 minutes" rule — exact-budget after tier

Today the user picks a tier (BASIC / CLASSIC / PRIVE / LUXE MAX). The expert still has to call to find the actual ceiling. Fix that in one extra tap.

Add a new step `budget_exact` immediately after `budget`:

- **Question**: "Cool — what's your real monthly ceiling inside {TIER}?"
- **Subtitle**: "Honest number means we only show stays that fit. Saves the back-and-forth."
- **Options** (chips, single-select, populated from the tier the user picked):
  - BASIC → ₹7k · ₹8k · ₹9k · ₹10k · ₹11k · "Flexible inside this tier"
  - CLASSIC → ₹12k · ₹13k · ₹14k · ₹15k · ₹16k · ₹17k · "Flexible inside this tier"
  - PRIVE → ₹17k · ₹19k · ₹21k · ₹23k · ₹25k · ₹26k · "Flexible inside this tier"
  - LUXE MAX → ₹25k · ₹30k · ₹35k · ₹40k · ₹45k · "Flexible inside this tier"
- **Plus**: a "+ Set my own number" chip → reveals an inline numeric input (no separate screen). Stored as `budget_exact_custom`.
- **Inclusive toggle row** below: two pill toggles — "Food included" / "Food extra is fine" — stored as `food_pref`. Default unselected; not blocking.
- Single tap advances to `room`. Skip-able only via "Flexible inside this tier".

Insight bubble after pick: "Locked at ₹{n}/mo · 12 stays in {zone} match this." (uses existing `proof-seed`).

## 3. Expand the zone step — 4-stage mini-flow

Today the zone step shows 5 belts with truncated subtitles and that's it. Restructure so location is captured properly in one place.

### 3a. Stage 1 — Zone (5 belts, cleaner subtitles)
East · ORR · North · Central · South — keep emoji off, subtitle is just the belt name.

### 3b. Stage 2 — Areas / landmarks (multi-select chips, max 5, +Other)
Each zone exposes a wide list so nothing important is missed:

- **East**: Whitefield, Brookfield, Marathalli, Mahadevapura, ITPL, EPIP, Kundalahalli, Varthur, Hoodi, KR Puram, Phoenix Marketcity, Graphite Lane, AECS Layout
- **ORR**: Bellandur, Sarjapur Road, Kadubeesanahalli, Devarabeesanahalli, RMZ Ecoworld, Embassy Tech Village, Prestige Tech Park, Cessna Business Park, HSR Layout, Outer Ring Road
- **North**: Nagawara, Manyata Tech Park, Hebbal, Yeshwanthpur, Hennur, Thanisandra, Jakkur, Yelahanka, Sahakar Nagar, Airport corridor
- **Central**: Koramangala, Indiranagar, Vasanth Nagar, MG Road, Domlur, Ulsoor, Richmond Road, Cunningham Road, Lavelle Road, Frazer Town, Shivajinagar
- **South**: Electronic City Phase 1, Electronic City Phase 2, BTM Layout, JP Nagar, Jayanagar, Bommanahalli, Hosur Road, Bannerghatta Road, Kanakapura Road, Silk Board

Plus a `+ Add another area` chip → inline text input (no new screen). Stored as `area_other`.

### 3c. Stage 3 — Radius (single choice, default "Anywhere in zone")
Walking (~1 km) · Short ride (1–3 km) · Up to 5 km · Up to 10 km · Anywhere in this zone

### 3d. Stage 4 — Special requirement (optional one-liner)
Placeholder: `e.g. near a metro stop, parking for car, vegetarian floor…`. Skippable. Stored as `special_req`.

After Stage 4 → existing `workplace` step.

### 3e. Data + brief
Extend `Data` with `areas?: string[]`, `area_other?: string`, `radius?: string`, `special_req?: string`, `budget_exact?: string`, `budget_exact_custom?: string`, `food_pref?: string`.
Update `buildMsg` and `summaryRows`:
- *Areas:* comma-list of `areas` + `area_other`
- *Radius:* label
- *Budget:* `BASIC ₹7k–11k · ceiling ₹{n}/mo · {food_pref}`
- *Special:* if present

## 4. "Worthy & hassle-free" pass on every button

Audit every interactive surface. Targets:

- **Choice options**: full row tappable (already is), but increase tap target to `min-h-[56px]` and remove the tiny chevron — entire card is the action.
- **Multi-select chips** (matters, dealbreakers, areas): show a live "X of Y · tap to confirm" pill at the bottom that doubles as the Continue button when `X > 0`. Removes the need to scroll for the separate Continue.
- **Skip buttons**: only on truly optional steps (matters_other, dealbreakers, worry, special_req, area_other). Remove "Skip" from required steps (workplace text input keeps Skip because real-world users may not have an exact employer).
- **Welcome intent buttons**: keep 4 options, but on tap show a 250ms "✓ Got it — {label}" inline confirmation before advancing. No modal.
- **Phone input**: auto-format to `+91 XXXXX XXXXX`, paste-cleaning (strips `+91`/spaces). Submit button enabled the moment 10 digits are present, no separate validation message.
- **Reveal CTAs ordering** (top-to-bottom): green "Send on WhatsApp" → "Copy again" → "Send to a different number" expand → "Start over" demoted to small text link at bottom.
- **No dead-ends**: every non-final screen has Back (already present in header). The final screen never auto-redirects.
- **No double prompts**: remove the "Are you sure?" implicit feel from Start over — it just resets without a confirm.

## 5. Decrease emoji density

Cut roughly in half.

- **Option emojis** (`ChoiceOpt.e`): keep only on welcome intent and `gender`. Set `e: ""` for `story`, `in_blr`, `curr_stay`, `notice`, `arrival`, `movein`, `zone`, `budget`, `budget_exact`, `room`, `worry`, `visit`, `visit_when`. In `ChoiceBlock`, render the emoji span only when `o.e` is non-empty.
- **proofFor()**: drop the leading `📊 / 🔥 / 🚪`. Wording stays.
- **buildMsg**: keep section emojis only for `Name`, `Phone`, `Zone`, `Budget`. Strip from the rest.
- **Reveal heading**: `Got it, {name} 🙌` → `Got it, {name}.`

## 6. Recheck — consumer-mindset audit

Walked every step. Coverage now: situation · in_blr · current stay · notice · arrival · move-in · zone+areas+radius+special · workplace · tier+exact budget+food · room · gender · name · must-haves (+other) · deal-breakers · worry · visit/pre-book · visit_when · phone.

We do NOT add: aadhaar, full address, salary, employer ID, parents' phone, alternative numbers. Anything we wouldn't share with a stranger on WhatsApp stays out.

## 7. Files touched

```text
src/components/
├── gharpayy-form.tsx     (zone mini-flow, budget_exact step, auto-copy effect, remove MatchPreview, button polish, emoji prune, buildMsg + summaryRows + Data updates, phone formatter, privacy line above input)
└── form-ui.tsx           (ChoiceBlock empty-emoji guard, larger tap targets)
```

No new files, no new dependencies, no schema/backend changes.

## 8. Order of implementation

1. Extend `Data` type + new step IDs (`budget_exact`, area/radius/special inside zone mini-flow).
2. Build the zone 4-stage mini-flow.
3. Add `budget_exact` step + food toggle.
4. Update `buildMsg` + `summaryRows` for all new fields.
5. Remove `<MatchPreview />` from reveal; add auto-copy `useEffect` + chip; relabel manual button.
6. Button polish pass: tap targets, multi-select Continue-pill, phone formatter, Skip cleanup, CTA ordering.
7. Move privacy line above phone input.
8. Emoji prune across STEPS, proofFor, buildMsg, reveal heading.
