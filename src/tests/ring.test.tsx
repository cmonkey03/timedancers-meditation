import Ring from '@/components/Session/Ring';
import { locales } from '@/locales';
import { render } from '@testing-library/react-native';
import { View } from 'react-native';
import { describe, expect, it, vi } from 'vitest';

// Mock the i18n context to return English strings
vi.mock('@/contexts/I18nContext', async () => {
  const { locales } = await import('@/locales');
  const t = (path: string) =>
    path.split('.').reduce((acc: any, key: string) => (acc ? acc[key] : undefined), locales.en) || path;
  return { useI18n: () => ({ t }) };
});

// Mock expo-linear-gradient
vi.mock('expo-linear-gradient', () => ({
  LinearGradient: View,
}));

// Mock react-native-svg
vi.mock('react-native-svg', () => ({
  Svg: View,
  Circle: View,
  Defs: View,
  LinearGradient: View,
  Stop: View,
  G: View,
}));

// Mock react-native-reanimated
vi.mock('react-native-reanimated', () => ({
  default: {
    View,
    createAnimatedComponent: vi.fn(() => View),
  },
  useSharedValue: vi.fn(() => ({ value: 1 })),
  useAnimatedStyle: vi.fn(() => ({})),
  useAnimatedProps: vi.fn(() => ({})),
  useDerivedValue: vi.fn(() => ({ value: 1 })),
  withTiming: vi.fn((value) => value),
  withSpring: vi.fn((value) => value),
  withRepeat: vi.fn((value) => value),
  withSequence: vi.fn((value) => value),
  withDelay: vi.fn((value) => value),
  Easing: {
    inOut: vi.fn(),
    linear: vi.fn(),
  },
}));

// Mock the theme hook
vi.mock('@/hooks/use-theme', () => ({
  useThemeColors: vi.fn(() => ({
    text: '#000000',
    background: '#ffffff',
  })),
}));

// Mock the fonts hook
vi.mock('@/hooks/use-fonts', () => ({
  useCustomFonts: vi.fn(() => ({
    fontsLoaded: true,
    fonts: {
      inter: {
        semiBold: 'Inter_600SemiBold',
      },
    },
  })),
}));

// Component imported at top

describe('components/Ring', () => {
  const sessionProps = {
    size: 160,
    label: locales.en.onboarding.ringLabels.power,
    remaining: 60,
    total: 180,
    state: 'idle' as const,
    colors: ['#D28A2A', '#7A2E00'] as [string, string],
  };

  const simpleProps = {
    color: '#D28A2A',
    backgroundColor: ['#ffffff', '#f0f0f0'],
    text: 'Test Ring',
  };

  it('renders session ring without crashing', () => {
    const { getByText } = render(<Ring {...sessionProps} />);
    
    const label = getByText(locales.en.onboarding.ringLabels.power);
    expect(label).toBeTruthy();
  });

  it('renders simple ring without crashing', () => {
    const { getByText } = render(<Ring {...simpleProps} />);
    
    const text = getByText('Test Ring');
    expect(text).toBeTruthy();
  });

  it('renders different session ring states', () => {
    const states = ['idle', 'active', 'releasing', 'done'] as const;
    
    states.forEach(state => {
      const { getByText } = render(
        <Ring {...sessionProps} state={state} />
      );
      
      const label = getByText(locales.en.onboarding.ringLabels.power);
      expect(label).toBeTruthy();
    });
  });

  it('handles different sizes for session ring', () => {
    const sizes = [160, 220];
    
    sizes.forEach(size => {
      const { getByText } = render(
        <Ring {...sessionProps} size={size} />
      );
      
      const label = getByText(locales.en.onboarding.ringLabels.power);
      expect(label).toBeTruthy();
    });
  });

  it('handles different remaining/total values', () => {
    const testCases = [
      { remaining: 180, total: 180 }, // Full time
      { remaining: 90, total: 180 },  // Half time
      { remaining: 0, total: 180 },   // No time left
    ];
    
    testCases.forEach(({ remaining, total }) => {
      const { getByText } = render(
        <Ring {...sessionProps} remaining={remaining} total={total} />
      );
      
      const label = getByText(locales.en.onboarding.ringLabels.power);
      expect(label).toBeTruthy();
    });
  });

  it('handles different color combinations', () => {
    const colorCombinations: [string, string][] = [
      ['#D28A2A', '#7A2E00'], // Power colors
      ['#0F5A3E', '#0C3327'], // Heart colors
      ['#4B3FAE', '#1F1B4D'], // Wisdom colors
    ];
    
    colorCombinations.forEach(colors => {
      const { getByText } = render(
        <Ring {...sessionProps} colors={colors} />
      );
      
      const label = getByText(locales.en.onboarding.ringLabels.power);
      expect(label).toBeTruthy();
    });
  });

  it('renders different labels', () => {
    const labels = [locales.en.onboarding.ringLabels.power, locales.en.onboarding.ringLabels.heart, locales.en.onboarding.ringLabels.wisdom];
    
    labels.forEach(label => {
      const { getByText } = render(
        <Ring {...sessionProps} label={label} />
      );
      
      const labelElement = getByText(label);
      expect(labelElement).toBeTruthy();
    });
  });

  it('handles simple ring with different background colors', () => {
    const backgroundColors = [
      ['#ffffff', '#f0f0f0'],
      ['#000000', '#333333'],
      ['#ff0000', '#cc0000'],
    ];
    
    backgroundColors.forEach(backgroundColor => {
      const { getByText } = render(
        <Ring {...simpleProps} backgroundColor={backgroundColor} />
      );
      
      const text = getByText('Test Ring');
      expect(text).toBeTruthy();
    });
  });
});
