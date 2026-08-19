/**
 * Pure math for mapping timer state onto the wheel.
 */

export function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

/**
 * Overall session progress (0..1) — how much of the total session has elapsed.
 * Idle reports 0, a finished session reports 1. Drives the cloud's expansion.
 */
export function overallProgress(now: { done: boolean; totalRemainingMs: number }, phaseSeconds: number[]): number {
  if (now.done) return 1;
  const totalMs = phaseSeconds.reduce((sum, seconds) => sum + seconds, 0) * 1000;
  if (totalMs <= 0) return 0;
  return clamp01(1 - now.totalRemainingMs / totalMs);
}
