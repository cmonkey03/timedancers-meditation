import { useI18n } from '@/contexts/I18nContext';
import { useCustomFonts } from '@/hooks/ui/use-fonts';
import { useThemeColors } from '@/hooks/ui/use-theme';
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

interface Props {
  counting: boolean;
  onPress(action: string): void;
  started: boolean;
}

function Pill({
  text,
  onPress,
  testID,
  variant = 'primary',
}: {
  text: string;
  onPress(): void;
  testID?: string;
  variant?: 'primary' | 'secondary';
}) {
  const C = useThemeColors();
  const { fontsLoaded, fonts } = useCustomFonts();
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.96, { damping: 15, stiffness: 300 });
    opacity.value = withTiming(0.85, { duration: 100 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    opacity.value = withTiming(1, { duration: 100 });
  };

  const primary = variant === 'primary';

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={text}
      accessible={true}
    >
      <Animated.View
        style={[
          primary ? styles.pillPrimary : styles.pillSecondary,
          primary
            ? { backgroundColor: C.buttonPrimary, shadowColor: C.shadow }
            : { borderColor: C.ringInactive },
          animatedStyle,
        ]}
      >
        <Text
          style={[
            primary ? styles.pillTextPrimary : styles.pillTextSecondary,
            primary ? { color: C.buttonPrimaryText } : { color: C.text },
            fontsLoaded && { fontFamily: fonts.inter.semiBold },
          ]}
        >
          {text}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

const Control = ({ counting, onPress, started }: Props) => {
  const { t } = useI18n();

  const buttonText = useMemo(() => {
    if (counting) return t('session.buttons.pause');
    if (started) return t('session.buttons.resume');
    return t('session.buttons.start');
  }, [counting, started, t]);

  return (
    <View style={styles.container}>
      {/* Primary pill is always mounted in a fixed slot so Start/Pause/Resume
          never move — only the Cancel pill appears/disappears below it. */}
      <Pill
        onPress={() => onPress(counting ? 'pause' : 'counting')}
        text={buttonText}
        testID={started ? (counting ? 'pause-button' : 'resume-button') : 'start-button'}
      />
      {/* Reserved slot for Cancel (empty while idle) so the primary stays put */}
      <View style={styles.cancelSlot}>
        {started && (
          <Animated.View entering={FadeIn} exiting={FadeOut}>
            <Pill
              onPress={() => onPress('cancel')}
              text={t('session.buttons.cancel')}
              variant="secondary"
              testID="cancel-button"
            />
          </Animated.View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingVertical: 16,
    // Reserve height for the tallest state (primary + cancel) so the wheel above
    // stays perfectly still when the session starts.
    height: 152,
  },
  pillPrimary: {
    minWidth: 168,
    minHeight: 56,
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  pillTextPrimary: {
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 1,
  },
  pillSecondary: {
    minWidth: 120,
    paddingHorizontal: 32,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillTextSecondary: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
    opacity: 0.8,
  },
  cancelSlot: {
    marginTop: 14,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Control;
