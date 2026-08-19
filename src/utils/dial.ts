/**
 * Pure math for the circular gesture time dial.
 * All functions are worklet-safe so they can be called from reanimated
 * gesture callbacks and from regular JS (e.g. unit tests).
 */

export const DIAL_MIN_MINUTES = 1;
export const DIAL_MAX_MINUTES = 60;
export const DIAL_FULL_ROTATION_MINUTES = 60;

/**
 * Shortest signed angular distance (in radians) between two angles,
 * normalized to the range [-PI, PI].
 */
export function angleDeltaRad(a: number, b: number): number {
  'worklet';
  let delta = a - b;
  while (delta > Math.PI) delta -= 2 * Math.PI;
  while (delta < -Math.PI) delta += 2 * Math.PI;
  return delta;
}

/**
 * Convert a cumulative angular sweep (radians) into minutes.
 * A full clockwise rotation equals `fullRotationMinutes` (literal default for
 * worklet safety).
 */
export function radiansToMinutes(totalRadians: number, fullRotationMinutes = 60): number {
  'worklet';
  return (totalRadians / (2 * Math.PI)) * fullRotationMinutes;
}

/**
 * Clamp minutes into the supported dial range.
 * Note: defaults are literals (not the DIAL_* constants) so they survive
 * worklet serialization on the UI thread.
 */
export function clampMinutes(
  minutes: number,
  min = 1,
  max = 60
): number {
  'worklet';
  return Math.max(min, Math.min(max, Math.round(minutes)));
}

/**
 * Angle (radians) of a dial minute on the wheel.
 * 0/60 minutes point to 12 o'clock; angles increase clockwise, matching the
 * dial gesture mapping (finger angle -> minutes).
 */
export function minuteToRadians(minutes: number): number {
  return (minutes / DIAL_FULL_ROTATION_MINUTES) * 2 * Math.PI - Math.PI / 2;
}

/**
 * Convert a finger angle (radians relative to the wheel's center) into minutes.
 * 12 o'clock reads as 60, one full clockwise circle = 60 minutes.
 * Worklet-safe so it can be called from gesture callbacks.
 */
export function fingerAngleToMinutes(angleRadians: number): number {
  'worklet';
  const a = (angleRadians + 2.5 * Math.PI) % (2 * Math.PI);
  const m = Math.round((a / (2 * Math.PI)) * DIAL_FULL_ROTATION_MINUTES);
  return m === 0 ? DIAL_MAX_MINUTES : clampMinutes(m);
}
