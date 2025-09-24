import { describe, it, expect } from 'vitest';
import displayTime from '@/utils/display-time';

describe('utils/display-time', () => {
  it('formats zero seconds correctly', () => {
    expect(displayTime(0)).toBe('00:00');
  });

  it('formats seconds under 10 with leading zero', () => {
    expect(displayTime(5)).toBe('00:05');
    expect(displayTime(9)).toBe('00:09');
  });

  it('formats seconds 10 and above without leading zero', () => {
    expect(displayTime(10)).toBe('00:10');
    expect(displayTime(59)).toBe('00:59');
  });

  it('formats minutes under 10 with leading zero', () => {
    expect(displayTime(60)).toBe('01:00');
    expect(displayTime(120)).toBe('02:00');
    expect(displayTime(540)).toBe('09:00');
  });

  it('formats minutes 10 and above without leading zero', () => {
    expect(displayTime(600)).toBe('10:00');
    expect(displayTime(1200)).toBe('20:00');
    expect(displayTime(3600)).toBe('60:00');
  });

  it('formats mixed minutes and seconds correctly', () => {
    expect(displayTime(65)).toBe('01:05');
    expect(displayTime(125)).toBe('02:05');
    expect(displayTime(305)).toBe('05:05');
    expect(displayTime(665)).toBe('11:05');
  });

  it('handles typical meditation durations', () => {
    expect(displayTime(300)).toBe('05:00'); // 5 minutes
    expect(displayTime(600)).toBe('10:00'); // 10 minutes
    expect(displayTime(900)).toBe('15:00'); // 15 minutes
    expect(displayTime(1200)).toBe('20:00'); // 20 minutes
    expect(displayTime(1800)).toBe('30:00'); // 30 minutes
  });

  it('handles edge cases with large numbers', () => {
    expect(displayTime(3661)).toBe('61:01'); // 1 hour, 1 minute, 1 second
    expect(displayTime(7200)).toBe('120:00'); // 2 hours
  });

  it('handles countdown scenarios', () => {
    expect(displayTime(299)).toBe('04:59'); // 4:59 remaining
    expect(displayTime(61)).toBe('01:01'); // 1:01 remaining
    expect(displayTime(1)).toBe('00:01'); // 1 second remaining
  });
});
