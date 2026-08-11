import { settingsService } from '@/services/settings';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

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
        const saved = await settingsService.getThemeOverride();
        if (saved) setOverride(saved);
      } catch {}
    })();
  }, []);
  // persist on change
  useEffect(() => {
    settingsService.setThemeOverride(override);
  }, [override]);
  return <ThemeOverrideContext.Provider value={value}>{children}</ThemeOverrideContext.Provider>;
}

export function useThemeOverride() {
  const ctx = useContext(ThemeOverrideContext);
  if (!ctx) throw new Error('useThemeOverride must be used within ThemeOverrideProvider');
  return ctx;
}
