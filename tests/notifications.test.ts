import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import type { UsePhasedTimerState } from '@/hooks/use-phased-timer';
import { computeScheduleItems } from '@/utils/notification-schedule';

const makeState = (over: Partial<UsePhasedTimerState> = {}): UsePhasedTimerState => ({
  now: {
    done: false,
    currentIndex: 0,
    currentKey: 'power',
    phaseRemainingMs: 0,
    totalRemainingMs: 0,
  },
  running: true,
  started: true,
  phases: [
    { key: 'power', seconds: 60 },
    { key: 'heart', seconds: 60 },
    { key: 'wisdom', seconds: 60 },
  ],
  startAtMs: Date.now(),
  pausedTotalMs: 0,
  ...over,
});

describe('computeScheduleItems', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    const fixed = 1_700_000_000_000; // fixed epoch
    vi.setSystemTime(fixed);
  });

  it('returns empty when not started', () => {
    const st = makeState({ started: false, startAtMs: null });
    const items = computeScheduleItems(st, 'chime');
    expect(items).toEqual([]);
  });

  it('computes absolute times for remaining phases with sound for chime modes', () => {
    const start = Date.now();
    const st = makeState({ startAtMs: start, pausedTotalMs: 0 });
    // Elapsed 30s into first minute
    vi.setSystemTime(start + 30_000);
    const items = computeScheduleItems(st, 'chime');
    // Only completion notification remains
    expect(items.length).toBe(1);
    expect(items[0].title).toBe('Meditation complete');
    expect(items[0].withSound).toBe(true);
    // Session total 180s, elapsed 30s -> remaining 150s -> scheduled at now + 150s
    expect(items[0].whenEpochMs).toBe((start + 30_000) + 150_000);
  });

  it('disables sound for haptic-only and silent modes', () => {
    const start = Date.now();
    const st = makeState({ startAtMs: start });
    const itemsHaptic = computeScheduleItems(st, 'haptic');
    const itemsSilent = computeScheduleItems(st, 'silent');
    expect(itemsHaptic.every((i: { withSound: boolean }) => i.withSound === false)).toBe(true);
    expect(itemsSilent.every((i: { withSound: boolean }) => i.withSound === false)).toBe(true);
  });

  it('schedules completion accounting for pausedTotalMs (remaining time only)', () => {
    const start = Date.now();
    // Simulate 90s elapsed and 10s paused; effective elapsed = 80s
    const st = makeState({ startAtMs: start, pausedTotalMs: 10_000 });
    vi.setSystemTime(start + 90_000);
    const items = computeScheduleItems(st, 'chime');
    // Total 180s, effective elapsed 80s -> remaining 100s -> scheduled at now + 100s
    expect(items.length).toBe(1);
    expect(items[0].whenEpochMs).toBe((start + 90_000) + 100_000);
  });

  afterEach(() => {
    vi.useRealTimers();
  });
});
