// Timer logic for meditation sessions with phase-based timing
// Uses wall clock time to prevent drift and handle app sleep/pause scenarios

export type PhaseKey = "power" | "heart" | "wisdom";
export type Phase = { key: PhaseKey; seconds: number };

export const DEFAULT_PHASES: Phase[] = [
  { key: "power",  seconds: 5 * 60 },
  { key: "heart", seconds: 3 * 60 },
  { key: "wisdom", seconds: 7 * 60 },
];

export type TimerState = {
  phases: Phase[];
  startAt: number | null;    // epoch ms, when session started
  pauseAt: number | null;    // epoch ms, when last paused
  pausedTotal: number;       // total paused ms
  running: boolean;
};

export function newState(phases = DEFAULT_PHASES): TimerState {
  return { phases, startAt: null, pauseAt: null, pausedTotal: 0, running: false };
}

export function start(st: TimerState): TimerState {
  const now = Date.now();
  return { ...st, startAt: now, pauseAt: null, pausedTotal: 0, running: true };
}

export function pause(st: TimerState): TimerState {
  if (!st.running) return st;
  return { ...st, running: false, pauseAt: Date.now() };
}

export function resume(st: TimerState): TimerState {
  if (st.running || st.startAt == null || st.pauseAt == null) return st;
  const now = Date.now();
  const pausedDelta = now - st.pauseAt;
  return { ...st, running: true, pauseAt: null, pausedTotal: st.pausedTotal + pausedDelta };
}

export function reset(st: TimerState): TimerState {
  return newState(st.phases);
}

export function totalDurationMs(phases: Phase[]): number {
  return phases.reduce((acc, p) => acc + p.seconds * 1000, 0);
}

// Compute current index, remaining in current phase, and millis left total.
// Uses wall clock: if app sleeps or JS stalls, we still land on correct time.
export function computeNow(st: TimerState): {
  done: boolean;
  currentIndex: number;
  currentKey: PhaseKey | null;
  phaseRemainingMs: number;
  totalRemainingMs: number;
} {
  if (!st.startAt) {
    const first = st.phases[0];
    return {
      done: false,
      currentIndex: 0,
      currentKey: first?.key ?? null,
      phaseRemainingMs: (first?.seconds ?? 0) * 1000,
      totalRemainingMs: totalDurationMs(st.phases),
    };
  }
  const now = Date.now();
  const effectiveNow = st.running ? now : (st.pauseAt ?? now);
  const elapsed = Math.max(0, effectiveNow - st.startAt - st.pausedTotal);
  const total = totalDurationMs(st.phases);

  if (elapsed >= total) {
    return { done: true, currentIndex: st.phases.length - 1, currentKey: null, phaseRemainingMs: 0, totalRemainingMs: 0 };
  }

  // find current phase by cumulative sums
  let cum = 0;
  for (let i = 0; i < st.phases.length; i++) {
    const p = st.phases[i];
    const end = cum + p.seconds * 1000;
    if (elapsed < end) {
      return {
        done: false,
        currentIndex: i,
        currentKey: p.key,
        phaseRemainingMs: end - elapsed,
        totalRemainingMs: total - elapsed,
      };
    }
    cum = end;
  }
  // fallback
  return { done: true, currentIndex: st.phases.length - 1, currentKey: null, phaseRemainingMs: 0, totalRemainingMs: 0 };
}

// Helper function to create phases from a total duration in minutes
// Divides the time equally across the three phases
export function createPhasesFromMinutes(totalMinutes: number): Phase[] {
  const totalSeconds = Math.max(0, Math.round(totalMinutes * 60));
  const base = Math.floor(totalSeconds / 3);
  const remainder = totalSeconds - base * 3; // 0..2

  // Distribute remainder seconds to first N phases for exact total
  const phases: Phase[] = [
    { key: "power", seconds: base },
    { key: "heart", seconds: base },
    { key: "wisdom", seconds: base },
  ];
  for (let i = 0; i < remainder; i++) {
    phases[i].seconds += 1;
  }
  return phases;
}

// Helper function to get remaining seconds for display
export function getRemainingSeconds(remainingMs: number): number {
  return Math.ceil(remainingMs / 1000);
}
