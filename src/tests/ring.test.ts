import { clamp01, overallProgress } from '@/utils/ring';
import { describe, expect, it } from 'vitest';

const phaseSeconds = [60, 60, 60];

describe('utils/ring', () => {
  describe('clamp01', () => {
    it('clamps values into [0, 1]', () => {
      expect(clamp01(-1)).toBe(0);
      expect(clamp01(0)).toBe(0);
      expect(clamp01(0.5)).toBe(0.5);
      expect(clamp01(1)).toBe(1);
      expect(clamp01(2)).toBe(1);
    });
  });

  describe('overallProgress', () => {
    it('reports 0 when the whole session remains', () => {
      expect(overallProgress({ done: false, totalRemainingMs: 180000 }, phaseSeconds)).toBe(0);
    });

    it('grows with elapsed time', () => {
      expect(overallProgress({ done: false, totalRemainingMs: 90000 }, phaseSeconds)).toBeCloseTo(0.5);
    });

    it('reports 1 when the session is complete', () => {
      expect(overallProgress({ done: true, totalRemainingMs: 0 }, phaseSeconds)).toBe(1);
    });

    it('handles a missing total safely', () => {
      expect(overallProgress({ done: false, totalRemainingMs: 1000 }, [])).toBe(0);
    });
  });
});
