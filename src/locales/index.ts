/**
 * Locales configuration and utilities
 */

import { en } from './en';
import { es } from './es';

export type Locale = 'en' | 'es';
export type Language = 'en' | 'es';

export const locales = {
  en,
  es,
} as const;

export const localeNames: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
};

export const defaultLocale: Locale = 'en';

/**
 * Get locale strings
 */
export function getLocaleStrings(locale: Locale = defaultLocale) {
  return locales[locale] || locales[defaultLocale];
}

/**
 * Get available locales
 */
export function getAvailableLocales(): Locale[] {
  return Object.keys(locales) as Locale[];
}
