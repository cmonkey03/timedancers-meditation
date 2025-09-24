import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render } from '@testing-library/react-native';
import { View, Text } from 'react-native';
import AnimatedWelcomeText from '@/components/OnboardingPage/AnimatedWelcomeText';

// Mock react-native-reanimated
vi.mock('react-native-reanimated', () => {
  return {
    default: {
      View,
      Text,
    },
    useSharedValue: vi.fn(() => ({ value: 0 })),
    useAnimatedStyle: vi.fn(() => ({})),
    withTiming: vi.fn((value) => value),
    withDelay: vi.fn((value) => value),
    Easing: {
      out: vi.fn(() => vi.fn()),
      cubic: vi.fn(),
      back: vi.fn(() => vi.fn()),
    },
  };
});

// Mock the theme hook
const mockUseThemeColors = vi.fn();
vi.mock('@/hooks/use-theme', () => ({
  useThemeColors: mockUseThemeColors,
}));

// Mock the fonts hook
const mockUseCustomFonts = vi.fn();
vi.mock('@/hooks/use-fonts', () => ({
  useCustomFonts: mockUseCustomFonts,
}));

describe('components/AnimatedWelcomeText', () => {
  const mockColors = {
    text: '#000000',
    background: '#ffffff',
  };

  const mockFonts = {
    fontsLoaded: true,
    fonts: {
      cinzel: {
        semiBold: 'Cinzel_600SemiBold',
      },
      inter: {
        regular: 'Inter_400Regular',
      },
    },
  };

  beforeEach(() => {
    mockUseThemeColors.mockReturnValue(mockColors);
    mockUseCustomFonts.mockReturnValue(mockFonts);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders when fonts are loaded', () => {
    const { getByText } = render(<AnimatedWelcomeText />);
    
    expect(getByText('Decolonize your destiny')).toBeTruthy();
    expect(getByText('Unlock the power of timedancing through meditating on three sacred centers')).toBeTruthy();
  });

  it('does not render when fonts are not loaded', () => {
    mockUseCustomFonts.mockReturnValue({
      fontsLoaded: false,
      fonts: {},
    });

    const { queryByText } = render(<AnimatedWelcomeText />);
    
    expect(queryByText('Decolonize your destiny')).toBeNull();
    expect(queryByText('Unlock the power of timedancing through meditating on three sacred centers')).toBeNull();
  });

  it('uses correct theme colors', () => {
    const customColors = {
      text: '#ff0000',
      background: '#00ff00',
    };
    mockUseThemeColors.mockReturnValue(customColors);

    render(<AnimatedWelcomeText />);
    
    expect(mockUseThemeColors).toHaveBeenCalled();
  });

  it('uses custom fonts when loaded', () => {
    render(<AnimatedWelcomeText />);
    
    expect(mockUseCustomFonts).toHaveBeenCalled();
  });

  it('handles font loading state changes', () => {
    const { queryByText, rerender } = render(<AnimatedWelcomeText />);
    
    // Initially loaded
    expect(queryByText('Decolonize your destiny')).toBeTruthy();

    // Change to not loaded
    mockUseCustomFonts.mockReturnValue({
      fontsLoaded: false,
      fonts: {},
    });

    rerender(<AnimatedWelcomeText />);
    expect(queryByText('Decolonize your destiny')).toBeNull();
  });
});
