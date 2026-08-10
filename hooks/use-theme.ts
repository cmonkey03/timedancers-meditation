import { useColorScheme } from 'react-native';
import { useThemeOverride } from '@/hooks/theme-override';

export type AppColors = {
  // Core colors
  primary: string;
  secondary: string;
  surface: string;
  background: string;
  
  // Text colors
  text: string;
  textInverse: string;
  mutedText: string;
  
  // UI elements
  border: string;
  divider: string;
  
  // Button colors
  buttonPrimary: string;
  buttonPrimaryText: string;
  buttonGhost: string;
  
  // Status colors
  success: string;
  warning: string;
  error: string;
  
  // Shadow
  shadow: string;
  
  // Opacity helpers
  text30: string;
  text40: string;
  text60: string;
};

export const Colors: Record<'light' | 'dark', AppColors> = {
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
