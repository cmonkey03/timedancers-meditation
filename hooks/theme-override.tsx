import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Scheme = 'light' | 'dark';

type ThemeOverrideContextValue = {
  override: Scheme | null;
  setOverride: (s: Scheme | null) => void;
};

const ThemeOverrideContext = createContext<ThemeOverrideContextValue | undefined>(undefined);

export function ThemeOverrideProvider({ children }: { children: React.ReactNode }) {
  const [override, setOverride] = useState<Scheme | null>(null);
  const value = useMemo(() => ({ override, setOverride }), [override]);
  // restore on mount
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem('themeOverride');
        if (saved === 'light' || saved === 'dark') setOverride(saved);
      } catch {}
    })();
  }, []);
  // persist on change
  useEffect(() => {
    AsyncStorage.setItem('themeOverride', override ?? '').catch(() => {});
  }, [override]);
  return <ThemeOverrideContext.Provider value={value}>{children}</ThemeOverrideContext.Provider>;
}

export function useThemeOverride() {
  const ctx = useContext(ThemeOverrideContext);
  if (!ctx) throw new Error('useThemeOverride must be used within ThemeOverrideProvider');
  return ctx;
}
