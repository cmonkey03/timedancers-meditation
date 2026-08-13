import { useI18n } from '@/contexts/I18nContext';
import { useCustomFonts } from '@/hooks/ui/use-fonts';
import { useThemeColors } from '@/hooks/ui/use-theme';
import { Ionicons } from '@expo/vector-icons';
import { useEffect } from 'react';
import { Text } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withRepeat,
    withTiming,
} from 'react-native-reanimated';

const SwipeIndicator = () => {
  const C = useThemeColors();
  const { t } = useI18n();
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
      <Ionicons name="chevron-forward" size={28} color={C.text60} />
      <Text
        style={{
          color: C.text60,
          fontSize: 13,
          fontFamily: fontsLoaded ? fonts.inter.medium : undefined,
          marginTop: 4,
          letterSpacing: 0.5,
        }}
      >
        {t('onboarding.swipeToBegin')}
      </Text>
    </Animated.View>
  );
};

export default SwipeIndicator;
