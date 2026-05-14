export function tap() {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    try { navigator.vibrate(8); } catch { /* noop */ }
  }
}
export function success() {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    try { navigator.vibrate([12, 40, 18]); } catch { /* noop */ }
  }
}
