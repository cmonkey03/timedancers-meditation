import { useThemeOverride } from '@/hooks/theme-override';
import type { AppColors, ThemeColors } from '@/types';
import { useColorScheme } from 'react-native';

export const Colors: ThemeColors = {
  light: {
    // Core colors
    primary: '#1a1a1a',
    secondary: '#2c2b2a',
    surface: '#ffffff',
    background: '#f9f8f6',
    
    // Text colors
    text: '#1a1a1a',
    textInverse: '#f9f8f6',
    mutedText: '#8a8883',
    
    // UI elements
    border: '#d0ceca',
    divider: '#e5e3de',
    
    // Button colors
    buttonPrimary: '#1a1a1a',
    buttonPrimaryText: '#f9f8f6',
    buttonGhost: 'transparent',
    
    // Slider colors (using wheel ring palette)
    sliderActive: '#2a2a2a',
    
    // Status colors
    success: '#4ade80',
    warning: '#fbbf24',
    error: '#ef4444',
    
    // Shadow
    shadow: '#000000',
    
    // Timewheel rings
    ringInactive: '#d0ceca',
    ringActive: '#1a1a1a',
    // Smoky center cloud — charcoal core fading out into the parchment screen
    wheelCloud: ['rgba(26,26,26,0.45)', 'rgba(26,26,26,0.12)', 'rgba(26,26,26,0)'],
    // Per-stage tone of the ink rings (stage 1, 2, 3) — Arrival-inspired ink variation
    wheelRings: ['#2a2a2a', '#3d3528', '#28353d'],
    wheelText: '#f9f8f6',
    
    // Opacity helpers
    text30: '#1a1a1a4D',
    text40: '#1a1a1a66',
    text60: '#1a1a1a99',
    sliderActive30: '#2a2a2a4D',
    sliderActive40: '#2a2a2a66',
    sliderActive60: '#2a2a2a99',
  },
  dark: {
    // Core colors
    primary: '#eae3d2',
    secondary: '#383532',
    surface: '#1c1b1a',
    background: '#121212',
    
    // Text colors
    text: '#eae3d2',
    textInverse: '#121212',
    mutedText: '#8b8577',
    
    // UI elements
    border: '#383532',
    divider: '#2a2826',
    
    // Button colors
    buttonPrimary: '#eae3d2',
    buttonPrimaryText: '#121212',
    buttonGhost: 'transparent',
    
    // Slider colors (using wheel ring palette)
    sliderActive: '#e8e0d0',
    
    // Status colors
    success: '#4ade80',
    warning: '#fbbf24',
    error: '#ef4444',
    
    // Shadow
    shadow: '#000000',
    
    // Timewheel rings
    ringInactive: '#383532',
    ringActive: '#eae3d2',
    // Smoky center cloud — white core fading out into the obsidian screen
    wheelCloud: ['rgba(255,255,255,0.5)', 'rgba(255,255,255,0.14)', 'rgba(255,255,255,0)'],
    // Per-stage tone of the ink rings (stage 1, 2, 3) — Arrival-inspired ink variation
    wheelRings: ['#e8e0d0', '#f5e6c8', '#d8e8e6'],
    wheelText: '#1a1a1a',
    
    // Opacity helpers
    text30: '#eae3d24D',
    text40: '#eae3d266',
    text60: '#eae3d299',
    sliderActive30: '#e8e0d04D',
    sliderActive40: '#e8e0d066',
    sliderActive60: '#e8e0d099',
  },
};

export function useThemeColors(): AppColors {
  const scheme = useColorScheme();
  const { override } = useThemeOverride();
  const finalScheme = (override ?? (scheme ?? 'light')) as 'light' | 'dark';
  return Colors[finalScheme];
}
