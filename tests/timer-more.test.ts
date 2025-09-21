import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as Timer from '@/utils/timer';

const setNow = (ms: number) => {
  vi.spyOn(Date, 'now').mockReturnValue(ms);
};

describe('utils/timer more cases', () => {
  beforeEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('elapsed exactly equals total => done with zero remaining', () => {
    const phases: Timer.Phase[] = [
      { key: 'power' as any, seconds: 2 },
      { key: 'heart' as any, seconds: 2 },
    ];
    let st = Timer.newState(phases);

    setNow(1_000);
    st = Timer.start(st);

    // total = 4s; set time to exactly start + 4s
    setNow(5_000);
    const now = Timer.computeNow(st);
    expect(now.done).toBe(true);
    expect(now.phaseRemainingMs).toBe(0);
    expect(now.totalRemainingMs).toBe(0);
  });

  it('getRemainingSeconds rounds up partial seconds', () => {
    expect(Timer.getRemainingSeconds(0)).toBe(0);
    expect(Timer.getRemainingSeconds(1)).toBe(1);
    expect(Timer.getRemainingSeconds(999)).toBe(1);
    expect(Timer.getRemainingSeconds(1000)).toBe(1);
    expect(Timer.getRemainingSeconds(1001)).toBe(2);
    expect(Timer.getRemainingSeconds(1999)).toBe(2);
  });

  it('paused timer does not advance while paused', () => {
    const phases: Timer.Phase[] = [
      { key: 'power' as any, seconds: 5 },
      { key: 'heart' as any, seconds: 5 },
    ];
    let st = Timer.newState(phases);
    setNow(10_000);
    st = Timer.start(st);

    // 2s into phase 0
    setNow(12_000);
    st = Timer.pause(st);
    let now = Timer.computeNow(st);
    const remainingAtPause = now.phaseRemainingMs;

    // 10s pass while paused — computeNow should still report same remaining
    setNow(22_000);
    now = Timer.computeNow(st);
    expect(now.phaseRemainingMs).toBe(remainingAtPause);

    // resume
    st = Timer.resume(st);

    // 2s later, remaining should drop by ~2s
    setNow(24_000);
    now = Timer.computeNow(st);
    // Allow a 1s tolerance due to rounding
    expect(Math.round(now.phaseRemainingMs / 1000)).toBe(Math.round((remainingAtPause - 2000) / 1000));
  });
});
