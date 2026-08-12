/**
 * I18n Context Provider
 * Provides internationalization context to the entire app
 */
import { defaultLocale, getLocaleStrings, Locale, localeNames } from '@/locales';
import { settingsService } from '@/services/settings';
import { createContext, useContext, useEffect, useState } from 'react';

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => Promise<void>;
  t: (path: string) => string;
  strings: any;
  localeNames: Record<Locale, string>;
  availableLocales: Locale[];
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);
  const [strings, setStrings] = useState(getLocaleStrings(defaultLocale));

  // Load saved locale on mount
  useEffect(() => {
    (async () => {
      try {
        const savedLocale = await settingsService.getLocale();
        if (savedLocale && (savedLocale === 'en' || savedLocale === 'es')) {
          setLocaleState(savedLocale);
        }
      } catch (error) {
        console.error('Failed to load locale:', error);
      }
    })();
  }, []);

  // Update strings when locale changes
  useEffect(() => {
    setStrings(getLocaleStrings(locale));
  }, [locale]);

  const setLocale = async (newLocale: Locale) => {
    console.log('Changing locale to:', newLocale);
    setLocaleState(newLocale);
    try {
      await settingsService.setLocale(newLocale);
      console.log('Locale saved successfully');
    } catch (error) {
      console.error('Failed to save locale:', error);
    }
  };

  const t = (path: string): string => {
    const keys = path.split('.');
    let value: any = strings;
    
    for (const key of keys) {
      value = value?.[key];
    }
    
    return value || path;
  };

  const value: I18nContextValue = {
    locale,
    setLocale,
    t,
    strings,
    localeNames,
    availableLocales: ['en', 'es'] as Locale[],
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
}