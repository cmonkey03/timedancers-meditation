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

describe('computeScheduleItems additional cases', () => {
  const fixed = 1_800_000_000_000; // fixed epoch
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(fixed);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('enables sound in chime_haptic mode', () => {
    const start = Date.now();
    const st = makeState({ startAtMs: start });
    const items = computeScheduleItems(st, 'chime_haptic');
    expect(items.length).toBe(3);
    expect(items.every(i => i.withSound === true)).toBe(true);
  });

  it('skips already-passed boundaries when a large elapsed time has occurred', () => {
    const start = Date.now();
    const st = makeState({ startAtMs: start, pausedTotalMs: 0 });
    // Elapsed = 125s -> boundaries at 60s, 120s are passed; remaining at 180s
    vi.setSystemTime(start + 125_000);
    const items = computeScheduleItems(st, 'chime');
    expect(items.length).toBe(1);
    expect(items[0].title).toBe('Meditation complete');
    expect(items[0].whenEpochMs).toBe(start + 180_000);
  });

  it('returns empty when elapsed >= total duration', () => {
    const start = Date.now();
    const st = makeState({ startAtMs: start });
    // total = 180s; move beyond end
    vi.setSystemTime(start + 181_000);
    const items = computeScheduleItems(st, 'chime');
    expect(items).toEqual([]);
  });

  it('accounts for pausedTotalMs when determining remaining boundaries', () => {
    const start = Date.now();
    // Elapsed wall = 90s, paused = 20s -> effective elapsed = 70s
    const st = makeState({ startAtMs: start, pausedTotalMs: 20_000 });
    vi.setSystemTime(start + 90_000);
    const items = computeScheduleItems(st, 'chime');
    // Remaining boundaries at 120s and 180s
    expect(items.map(i => i.whenEpochMs)).toEqual([start + 120_000, start + 180_000]);
  });
});
