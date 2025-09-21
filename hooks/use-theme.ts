import { useColorScheme } from 'react-native';
import { useThemeOverride } from '@/hooks/theme-override';

export type AppColors = {
  primary: string;
  surface: string;
  text: string;
  border: string;
  mutedText: string;
  background: string;
};

export const Colors: Record<'light' | 'dark', AppColors> = {
  light: {
    primary: '#1a5632',
    surface: '#e4ede7',
    text: '#1a5632',
    border: '#cbd5d1',
    mutedText: '#8aa99a',
    background: '#ffffff',
  },
  dark: {
    primary: '#e4ede7',
    surface: '#27433a',
    text: '#e4ede7',
    border: '#3a5a4d',
    mutedText: '#7ea497',
    background: '#0e1412',
  },
};

export function useThemeColors(): AppColors {
  const scheme = useColorScheme();
  const { override } = useThemeOverride();
  const finalScheme = (override ?? (scheme ?? 'light')) as 'light' | 'dark';
  return Colors[finalScheme];
}
