import { useThemeOverride } from '@/hooks/theme-override';
import type { AppColors, ThemeColors } from '@/types';
import { useColorScheme } from 'react-native';

export const Colors: ThemeColors = {
  light: {
    // Core colors
    primary: '#1a5632',
    secondary: '#2d5a3d',
    surface: '#e4ede7',
    background: '#ffffff',
    
    // Text colors
    text: '#1a5632',
    textInverse: '#ffffff',
    mutedText: '#8aa99a',
    
    // UI elements
    border: '#cbd5d1',
    divider: '#e5e7eb',
    
    // Button colors
    buttonPrimary: '#2d5a3d',
    buttonPrimaryText: '#ffffff',
    buttonGhost: 'transparent',
    
    // Status colors
    success: '#4ade80',
    warning: '#fbbf24',
    error: '#ef4444',
    
    // Shadow
    shadow: '#000000',
    
    // Opacity helpers
    text30: '#1a56324D',
    text40: '#1a563266',
    text60: '#1a563299',
  },
  dark: {
    // Core colors
    primary: '#e4ede7',
    secondary: '#2d5a3d',
    surface: '#27433a',
    background: '#0e1412',
    
    // Text colors
    text: '#e4ede7',
    textInverse: '#0e1412',
    mutedText: '#7ea497',
    
    // UI elements
    border: '#3a5a4d',
    divider: '#2d3748',
    
    // Button colors
    buttonPrimary: '#2d5a3d',
    buttonPrimaryText: '#ffffff',
    buttonGhost: 'transparent',
    
    // Status colors
    success: '#4ade80',
    warning: '#fbbf24',
    error: '#ef4444',
    
    // Shadow
    shadow: '#000000',
    
    // Opacity helpers
    text30: '#e4ede74D',
    text40: '#e4ede766',
    text60: '#e4ede799',
  },
};

export function useThemeColors(): AppColors {
  const scheme = useColorScheme();
  const { override } = useThemeOverride();
  const finalScheme = (override ?? (scheme ?? 'light')) as 'light' | 'dark';
  return Colors[finalScheme];
}
