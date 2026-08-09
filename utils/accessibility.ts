// Accessibility utilities for the meditation app

/**
 * Ensures text meets WCAG AA contrast requirements (4.5:1 for normal text, 3:1 for large text)
 * @param foregroundColor - Hex color code for text
 * @param backgroundColor - Hex color code for background
 * @param isLargeText - Whether the text is larger than 18pt or 14pt bold
 * @returns true if contrast meets WCAG requirements
 */
export function meetsWCAGContrast(
  foregroundColor: string,
  backgroundColor: string,
  isLargeText: boolean = false
): boolean {
  const contrastRatio = calculateContrastRatio(foregroundColor, backgroundColor);
  const minimumRatio = isLargeText ? 3.0 : 4.5;
  return contrastRatio >= minimumRatio;
}

/**
 * Calculate the contrast ratio between two colors according to WCAG
 * @param color1 - First hex color
 * @param color2 - Second hex color
 * @returns Contrast ratio between 1 and 21
 */
function calculateContrastRatio(color1: string, color2: string): number {
  const lum1 = getRelativeLuminance(color1);
  const lum2 = getRelativeLuminance(color2);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Calculate relative luminance of a color according to WCAG formula
 * @param hexColor - Hex color code (with or without #)
 * @returns Relative luminance between 0 and 1
 */
function getRelativeLuminance(hexColor: string): number {
  const rgb = hexToRgb(hexColor);
  if (!rgb) return 0;

  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((channel) => {
    const sRGB = channel / 255;
    return sRGB <= 0.03928
      ? sRGB / 12.92
      : Math.pow((sRGB + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Convert hex color to RGB
 * @param hex - Hex color code (with or without #)
 * @returns RGB values or null if invalid
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const hexValue = hex.replace('#', '');
  if (hexValue.length !== 6) return null;

  const r = parseInt(hexValue.substring(0, 2), 16);
  const g = parseInt(hexValue.substring(2, 4), 16);
  const b = parseInt(hexValue.substring(4, 6), 16);

  if (isNaN(r) || isNaN(g) || isNaN(b)) return null;

  return { r, g, b };
}

/**
 * Generate accessibility label for time duration
 * @param minutes - Number of minutes
 * @returns Human-readable time description
 */
export function getTimeAccessibilityLabel(minutes: number): string {
  if (minutes === 1) return '1 minute';
  if (minutes < 60) return `${minutes} minutes`;
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return hours === 1 ? '1 hour' : `${hours} hours`;
  }
  
  return `${hours} hour${hours > 1 ? 's' : ''} and ${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''}`;
}

/**
 * Generate accessibility label for meditation phase
 * @param phase - Phase key (power, heart, wisdom)
 * @param remaining - Remaining time in seconds
 * @returns Descriptive accessibility label
 */
export function getPhaseAccessibilityLabel(
  phase: string,
  remaining: number
): string {
  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const timeLabel = `${minutes} minute${minutes !== 1 ? 's' : ''} and ${seconds} second${seconds !== 1 ? 's' : ''}`;
  
  const phaseNames: Record<string, string> = {
    power: 'Power',
    heart: 'Heart', 
    wisdom: 'Wisdom'
  };
  
  return `${phaseNames[phase] || phase} phase. ${timeLabel} remaining`;
}