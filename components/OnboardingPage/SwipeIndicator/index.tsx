import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '@/hooks/use-theme';
import { useCustomFonts } from '@/hooks/use-fonts';
import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withDelay,
  Easing,
} from 'react-native-reanimated';

const SwipeIndicator = () => {
  const C = useThemeColors();
  const { fontsLoaded, fonts } = useCustomFonts();

  const opacity = useSharedValue(0);
  const translateY = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(
      3500,
      withTiming(1, { duration: 1000, easing: Easing.out(Easing.cubic) })
    );

    translateY.value = withDelay(
      3500,
      withRepeat(
        withTiming(6, {
          duration: 1200,
          easing: Easing.inOut(Easing.sin),
        }),
        -1,
        true
      )
    );
  }, [opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[{ alignItems: 'center', marginTop: 32 }, animatedStyle]}>
      <Ionicons name="chevron-forward" size={28} color={`${C.text}99`} />
      <Text
        style={{
          color: `${C.text}99`,
          fontSize: 13,
          fontFamily: fontsLoaded ? fonts.inter.medium : undefined,
          marginTop: 4,
          letterSpacing: 0.5,
        }}
      >
        Swipe to begin
      </Text>
    </Animated.View>
  );
};

export default SwipeIndicator;
