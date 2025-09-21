import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as Timer from '@/utils/timer';

// Helper to advance mocked time
const setNow = (ms: number) => {
  vi.spyOn(Date, 'now').mockReturnValue(ms);
};

describe('utils/timer', () => {
  beforeEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('totalDurationMs sums phases', () => {
    const phases: Timer.Phase[] = [
      { key: 'power' as any, seconds: 10 },
      { key: 'heart' as any, seconds: 20 },
      { key: 'wisdom' as any, seconds: 30 },
    ];
    expect(Timer.totalDurationMs(phases)).toBe(60_000);
  });

  it('createPhasesFromMinutes distributes remainder seconds exactly', () => {
    const phases = Timer.createPhasesFromMinutes(1); // 60s => 20/20/20
    const sum = phases.reduce((a, p) => a + p.seconds, 0);
    expect(sum).toBe(60);
    expect(phases.length).toBe(3);
  });

  it('start/pause/resume tracks elapsed without drift', () => {
    const phases = [
      { key: 'power' as any, seconds: 5 },
      { key: 'heart' as any, seconds: 5 },
      { key: 'wisdom' as any, seconds: 5 },
    ];
    let st = Timer.newState(phases);

    setNow(1_000);
    st = Timer.start(st);

    // 3s elapsed
    setNow(4_000);
    let now = Timer.computeNow(st);
    expect(now.currentIndex).toBe(0);
    expect(Math.ceil(now.phaseRemainingMs / 1000)).toBe(2); // ~2s left in first phase

    // Pause at t=4s
    st = Timer.pause(st);

    // 5 seconds pass while paused
    setNow(9_000);
    // Resume at t=9s, paused delta = 5s
    st = Timer.resume(st);

    // After resume, with no time elapsed yet, we should still be where we paused (~2s left in phase 0)
    now = Timer.computeNow(st);
    expect(now.currentIndex).toBe(0);
    expect(Math.ceil(now.phaseRemainingMs / 1000)).toBe(2);

    // After 3 real seconds (t=12s), we should be into phase 1
    setNow(12_000);
    now = Timer.computeNow(st);
    expect(now.currentIndex).toBe(1);
  });

  it('computeNow returns done after total duration', () => {
    const phases = [
      { key: 'power' as any, seconds: 1 },
      { key: 'heart' as any, seconds: 1 },
      { key: 'wisdom' as any, seconds: 1 },
    ];
    let st = Timer.newState(phases);
    setNow(1_000);
    st = Timer.start(st);

    // total duration = 3s; move to 4s
    setNow(4_500);
    const now = Timer.computeNow(st);
    expect(now.done).toBe(true);
    expect(now.phaseRemainingMs).toBe(0);
    expect(now.totalRemainingMs).toBe(0);
  });
});
