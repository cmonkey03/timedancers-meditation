import Wheel from '@/components/Session/Wheel';
import { render } from '@testing-library/react-native';
import { View } from 'react-native';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/contexts/I18nContext', () => ({
  useI18n: () => ({
    t: (path: string) =>
      path.includes('selectSessionTime') ? 'Select session time' : path,
  }),
}));

vi.mock('@/hooks/ui/use-theme', () => ({
  useThemeColors: () => ({
    text: '#eae3d2',
    mutedText: '#a8a29e',
    ringInactive: '#383532',
    ringActive: '#eae3d2',
    wheelCloud: ['rgba(255,255,255,0.5)', 'rgba(255,255,255,0.14)', 'rgba(255,255,255,0)'],
    wheelRings: ['#eae3d2', '#eeddc0', '#d8e4e3'],
    wheelText: '#1a1a1a',
    buttonPrimary: '#eae3d2',
    buttonPrimaryText: '#121212',
    shadow: '#000000',
  }),
}));

vi.mock('@/hooks/ui/use-fonts', () => ({
  useCustomFonts: () => ({
    fontsLoaded: true,
    fonts: { inter: { medium: 'Inter_500Medium', semiBold: 'Inter_600SemiBold' } },
  }),
}));

vi.mock('react-native-svg', () => ({
  Svg: View,
  Circle: View,
  Ellipse: View,
  Defs: View,
  G: View,
  Line: View,
  RadialGradient: View,
  Stop: View,
  Text: View,
}));

vi.mock('react-native-gesture-handler', () => {
  const gesture = {
    enabled: vi.fn(() => gesture),
    onStart: vi.fn(() => gesture),
    onUpdate: vi.fn(() => gesture),
    onEnd: vi.fn(() => gesture),
    onFinalize: vi.fn(() => gesture),
  };
  return {
    Gesture: { Pan: vi.fn(() => gesture) },
    GestureDetector: ({ children }: { children: React.ReactNode }) => <View>{children}</View>,
  };
});

vi.mock('react-native-reanimated', () => ({
  default: {
    View,
    createAnimatedComponent: vi.fn(() => View),
  },
  useSharedValue: vi.fn(() => ({ value: 0 })),
  useAnimatedStyle: vi.fn(() => ({})),
  useAnimatedProps: vi.fn(() => ({})),
  useFrameCallback: vi.fn(() => ({ setActive: vi.fn(), isActive: true, callbackId: 0 })),
  useDerivedValue: vi.fn(() => ({ value: 0 })),
  withTiming: vi.fn((value) => value),
  withSpring: vi.fn((value) => value),
  withRepeat: vi.fn((value) => value),
  withSequence: vi.fn((value) => value),
  withDelay: vi.fn((value) => value),
  cancelAnimation: vi.fn(),
  runOnJS: vi.fn((fn) => fn),
  Easing: {
    linear: vi.fn(),
    cubic: vi.fn(),
    quad: vi.fn(),
    out: vi.fn(() => vi.fn()),
  },
}));

const phases = [
  { seconds: 60 },
  { seconds: 60 },
  { seconds: 60 },
];

describe('components/Session/Wheel', () => {
  const onDialMinutes = vi.fn();

  it('shows the dialed minutes in idle state', () => {
    const idleTimer = {
      now: { currentIndex: 0, currentKey: 'power' as const, phaseRemainingMs: 300000, totalRemainingMs: 300000, done: false },
      phases,
      started: false,
    };
    const { getByText, getByTestId } = render(<Wheel timer={idleTimer} minutes={5} onDialMinutes={onDialMinutes} />);
    expect(getByText('05:00')).toBeTruthy();
    expect(getByTestId('wheel-dial')).toBeTruthy();
  });

  it('counts down the overall remaining time while running', () => {
    const runningTimer = {
      now: { currentIndex: 0, currentKey: 'power' as const, phaseRemainingMs: 60000, totalRemainingMs: 180000, done: false },
      phases,
      started: true,
    };
    const { getByText, queryByTestId } = render(<Wheel timer={runningTimer} minutes={5} onDialMinutes={onDialMinutes} />);
    expect(getByText('03:00')).toBeTruthy();
    expect(queryByTestId('wheel-dial')).toBeNull();
  });

  it('shows 00:00 when the session is complete', () => {
    const doneTimer = {
      now: { currentIndex: 2, currentKey: 'wisdom' as const, phaseRemainingMs: 0, totalRemainingMs: 0, done: true },
      phases,
      started: true,
    };
    const { getByText } = render(<Wheel timer={doneTimer} minutes={5} onDialMinutes={onDialMinutes} />);
    expect(getByText('00:00')).toBeTruthy();
  });
});
