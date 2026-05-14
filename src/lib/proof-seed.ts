// Deterministic, plausible numbers per (date + zone) — won't flicker, looks real.
function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return Math.abs(h);
}
const today = () => new Date().toISOString().slice(0, 10);

export function matchedToday(zone?: string) {
  const n = hash(today() + (zone || "all")) % 11; // 4-14
  return 4 + n;
}
export function visitsBookedToday() {
  const n = hash(today() + "visits") % 6; // 3-8
  return 3 + n;
}
export function seatsLeft(propertyId: string) {
  return 1 + (hash(today() + propertyId) % 4); // 1-4
}
export function tierPopularity(zone?: string, tier?: string) {
  const n = 45 + (hash(today() + (zone || "") + (tier || "")) % 30); // 45-74
  return n;
}
const FAKE_NAMES = ["Riya", "Aman", "Sneha", "Karthik", "Priya", "Rohit", "Anushka", "Vikram", "Nikita", "Arjun"];
export function lastReplyTicker() {
  const idx = (Math.floor(Date.now() / 9000)) % FAKE_NAMES.length;
  const sec = 12 + (idx * 7) % 50;
  return `Aayushi just replied to ${FAKE_NAMES[idx]} · ${sec}s ago`;
}
