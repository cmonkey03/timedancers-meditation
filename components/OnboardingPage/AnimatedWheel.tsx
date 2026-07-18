import Wheel from '@/components/MeditationPage/Wheel';
import React, { useEffect, useState } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

interface AnimatedWheelProps {
  size: number;
  label: string;
  colors: [string, string];
  startTime: number;
  total: number;
}

const AnimatedWheel = ({ size, label, colors, startTime, total }: AnimatedWheelProps) => {
  const [remaining, setRemaining] = useState(startTime);
  const pulse = useSharedValue(0);

  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1, { duration: 1400, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
  }, [pulse]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 0) {
          return startTime;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + pulse.value * 0.06 }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Wheel
        size={size}
        label={label}
        remaining={remaining}
        total={total}
        state="active"
        colors={colors}
      />
    </Animated.View>
  );
};

export default AnimatedWheel;
