import {
  angleDeltaRad,
  clampMinutes,
  fingerAngleToMinutes,
  minuteToRadians,
  radiansToMinutes,
} from '@/utils/dial';
import { describe, expect, it } from 'vitest';

describe('utils/dial', () => {
  describe('angleDeltaRad', () => {
    it('returns zero for equal angles', () => {
      expect(angleDeltaRad(1, 1)).toBe(0);
    });

    it('normalizes deltas to the shortest signed arc', () => {
      expect(angleDeltaRad(Math.PI / 2, 0)).toBeCloseTo(Math.PI / 2);
      expect(angleDeltaRad(0, Math.PI / 2)).toBeCloseTo(-Math.PI / 2);
    });

    it('wraps across the +/- PI boundary', () => {
      // Sweeping forward through 0deg: 350deg -> 10deg should be +20deg
      const ten = (10 * Math.PI) / 180;
      const threeFifty = (350 * Math.PI) / 180;
      expect(angleDeltaRad(ten, threeFifty)).toBeCloseTo((20 * Math.PI) / 180);
      // Sweeping backward: 10deg -> 350deg should be -20deg
      expect(angleDeltaRad(threeFifty, ten)).toBeCloseTo(-(20 * Math.PI) / 180);
    });

    it('stays within [-PI, PI]', () => {
      for (let i = 0; i < 100; i++) {
        const a = (i * 37.3 * Math.PI) / 180;
        const b = (i * 11.1 * Math.PI) / 180;
        const delta = angleDeltaRad(a, b);
        expect(delta).toBeGreaterThanOrEqual(-Math.PI);
        expect(delta).toBeLessThanOrEqual(Math.PI);
      }
    });
  });

  describe('radiansToMinutes', () => {
    it('maps a full rotation to 60 minutes', () => {
      expect(radiansToMinutes(2 * Math.PI)).toBeCloseTo(60);
    });

    it('maps a half rotation to 30 minutes', () => {
      expect(radiansToMinutes(Math.PI)).toBeCloseTo(30);
    });

    it('maps a quarter rotation to 15 minutes', () => {
      expect(radiansToMinutes(Math.PI / 2)).toBeCloseTo(15);
    });

    it('maps counter-clockwise sweeps to negative minutes', () => {
      expect(radiansToMinutes(-Math.PI / 2)).toBeCloseTo(-15);
    });
  });

  describe('clampMinutes', () => {
    it('rounds fractional minutes', () => {
      expect(clampMinutes(5.4)).toBe(5);
      expect(clampMinutes(5.6)).toBe(6);
    });

    it('clamps to the supported range', () => {
      expect(clampMinutes(0)).toBe(1);
      expect(clampMinutes(-3)).toBe(1);
      expect(clampMinutes(61)).toBe(60);
      expect(clampMinutes(120)).toBe(60);
    });

    it('keeps in-range values', () => {
      expect(clampMinutes(1)).toBe(1);
      expect(clampMinutes(30)).toBe(30);
      expect(clampMinutes(60)).toBe(60);
    });
  });

  describe('minuteToRadians', () => {
    it('points 0 and 60 minutes to 12 o-clock', () => {
      expect(minuteToRadians(0)).toBeCloseTo(-Math.PI / 2);
      expect(minuteToRadians(60)).toBeCloseTo((3 * Math.PI) / 2);
    });

    it('points 15 minutes to 3 o-clock', () => {
      expect(minuteToRadians(15)).toBeCloseTo(0);
    });

    it('points 30 minutes to 6 o-clock', () => {
      expect(minuteToRadians(30)).toBeCloseTo(Math.PI / 2);
    });
  });

  describe('fingerAngleToMinutes', () => {
    it('round-trips with minuteToRadians', () => {
      for (const m of [1, 5, 17, 30, 45, 60]) {
        expect(fingerAngleToMinutes(minuteToRadians(m))).toBe(m);
      }
    });

    it('reads 12 o-clock as 60, not 0', () => {
      expect(fingerAngleToMinutes(-Math.PI / 2)).toBe(60);
    });

    it('increases clockwise and clamps to the supported range', () => {
      expect(fingerAngleToMinutes(0)).toBe(15); // 3 o-clock
      expect(fingerAngleToMinutes(Math.PI / 2)).toBe(30); // 6 o-clock
      expect(fingerAngleToMinutes(Math.PI)).toBe(45); // 9 o-clock
    });
  });
});
