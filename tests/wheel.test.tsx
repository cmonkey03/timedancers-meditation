import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react-native';
import { View } from 'react-native';
import Wheel from '@/components/MeditationPage/Wheel';

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

// Component imported at top

describe('components/Wheel', () => {
  const meditationProps = {
    size: 160,
    label: 'Power',
    remaining: 60,
    total: 180,
    state: 'idle' as const,
    colors: ['#D28A2A', '#7A2E00'] as [string, string],
  };

  const simpleProps = {
    color: '#D28A2A',
    backgroundColor: ['#ffffff', '#f0f0f0'],
    text: 'Test Wheel',
  };

  it('renders meditation wheel without crashing', () => {
    const { getByText } = render(<Wheel {...meditationProps} />);
    
    const label = getByText('Power');
    expect(label).toBeTruthy();
  });

  it('renders simple wheel without crashing', () => {
    const { getByText } = render(<Wheel {...simpleProps} />);
    
    const text = getByText('Test Wheel');
    expect(text).toBeTruthy();
  });

  it('renders different meditation wheel states', () => {
    const states = ['idle', 'active', 'releasing', 'done'] as const;
    
    states.forEach(state => {
      const { getByText } = render(
        <Wheel {...meditationProps} state={state} />
      );
      
      const label = getByText('Power');
      expect(label).toBeTruthy();
    });
  });

  it('handles different sizes for meditation wheel', () => {
    const sizes = [160, 220];
    
    sizes.forEach(size => {
      const { getByText } = render(
        <Wheel {...meditationProps} size={size} />
      );
      
      const label = getByText('Power');
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
        <Wheel {...meditationProps} remaining={remaining} total={total} />
      );
      
      const label = getByText('Power');
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
        <Wheel {...meditationProps} colors={colors} />
      );
      
      const label = getByText('Power');
      expect(label).toBeTruthy();
    });
  });

  it('renders different labels', () => {
    const labels = ['Power', 'Heart', 'Wisdom'];
    
    labels.forEach(label => {
      const { getByText } = render(
        <Wheel {...meditationProps} label={label} />
      );
      
      const labelElement = getByText(label);
      expect(labelElement).toBeTruthy();
    });
  });

  it('handles simple wheel with different background colors', () => {
    const backgroundColors = [
      ['#ffffff', '#f0f0f0'],
      ['#000000', '#333333'],
      ['#ff0000', '#cc0000'],
    ];
    
    backgroundColors.forEach(backgroundColor => {
      const { getByText } = render(
        <Wheel {...simpleProps} backgroundColor={backgroundColor} />
      );
      
      const text = getByText('Test Wheel');
      expect(text).toBeTruthy();
    });
  });
});
