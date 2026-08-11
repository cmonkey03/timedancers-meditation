/**
 * Internationalization hook
 * Handles language detection, switching, and translation
 */
import { defaultLocale, getLocaleStrings, Locale, localeNames } from '@/locales';
import { settingsService } from '@/services/settings';
import { useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';

export function useI18n() {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);
  const [strings, setStrings] = useState(getLocaleStrings(defaultLocale));

  /**
   * Load saved locale from storage
   */
  const loadSavedLocale = useCallback(async () => {
    try {
      const savedLocale = await settingsService.getLocale();
      if (savedLocale && (savedLocale === 'en' || savedLocale === 'es')) {
        setLocaleState(savedLocale);
      } else {
        // Detect device language if no saved preference
        detectDeviceLanguage();
      }
    } catch (error) {
      console.error('Failed to load locale:', error);
      detectDeviceLanguage();
    }
  }, []);

  // Load saved locale on mount
  useEffect(() => {
    loadSavedLocale();
  }, [loadSavedLocale]);

  // Update strings when locale changes
  useEffect(() => {
    setStrings(getLocaleStrings(locale));
  }, [locale]);

  /**
   * Detect device language and set appropriate locale
   */
  const detectDeviceLanguage = useCallback(() => {
    try {
      const deviceLocale = Platform.select({
        ios: () => {
          // iOS: Use NSLocale
          // @ts-ignore - Native module
          const locale = NSLocale.currentLocale.localeIdentifier;
          return locale?.split('_')[0] || 'en';
        },
        android: () => {
          // Android: Use I18nManager
          // @ts-ignore - Native module
          const locale = I18nManager.localeIdentifier;
          return locale?.split('-')[0] || 'en';
        },
        web: () => {
          // Web: Use navigator.language
          return navigator.language.split('-')[0] || 'en';
        },
        default: () => 'en',
      })();

      // Map device language to our supported locales
      const supportedLocale = deviceLocale === 'es' ? 'es' : 'en';
      setLocaleState(supportedLocale);
    } catch (error) {
      console.error('Failed to detect device language:', error);
      setLocaleState(defaultLocale);
    }
  }, []);

  /**
   * Change the app locale
   */
  async function changeLocale(newLocale: Locale) {
    setLocaleState(newLocale);
    try {
      await settingsService.setLocale(newLocale);
    } catch (error) {
      console.error('Failed to save locale:', error);
    }
  }

  /**
   * Translation helper function
   */
  function t(path: string): string {
    const keys = path.split('.');
    let value: any = strings;
    
    for (const key of keys) {
      value = value?.[key];
    }
    
    return value || path;
  }

  return {
    locale,
    setLocale: changeLocale,
    t,
    strings,
    localeNames,
    availableLocales: ['en', 'es'] as Locale[],
  };
}
