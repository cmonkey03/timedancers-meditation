import AnimatedWelcomeText from '@/components/Onboarding/AnimatedWelcomeText';
import { onboardingData } from '@/data/onboarding';
import { render } from '@testing-library/react-native';
import { Text, View } from 'react-native';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

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
    
    expect(getByText(onboardingData.welcome.title)).toBeTruthy();
    expect(getByText(onboardingData.welcome.subtitle)).toBeTruthy();
  });

  it('does not render when fonts are not loaded', () => {
    mockUseCustomFonts.mockReturnValue({
      fontsLoaded: false,
      fonts: {},
    });

    const { queryByText } = render(<AnimatedWelcomeText />);
    
    expect(queryByText(onboardingData.welcome.title)).toBeNull();
    expect(queryByText(onboardingData.welcome.subtitle)).toBeNull();
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
    expect(queryByText(onboardingData.welcome.title)).toBeTruthy();

    // Change to not loaded
    mockUseCustomFonts.mockReturnValue({
      fontsLoaded: false,
      fonts: {},
    });

    rerender(<AnimatedWelcomeText />);
    expect(queryByText(onboardingData.welcome.title)).toBeNull();
  });
});
