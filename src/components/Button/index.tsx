import { useCustomFonts } from '@/hooks/ui/use-fonts';
import { useThemeColors } from '@/hooks/ui/use-theme';
import { Pressable, StyleSheet, Text } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming
} from 'react-native-reanimated';

interface Props {
  onPress(): void;
  text: string;
  variant?: "primary" | "ghost";
  testID?: string;
}

const Button = ({ onPress, text, variant = "primary", testID }: Props) => {
  const C = useThemeColors();
  const { fontsLoaded, fonts } = useCustomFonts();
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
    opacity.value = withTiming(0.8, { duration: 100 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    opacity.value = withTiming(1, { duration: 100 });
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      testID={testID}
      accessibilityLabel={text}
      accessibilityRole="button"
      accessibilityState={{ disabled: false }}
      accessible={true}
    >
      <Animated.View
        style={[
          styles.btn,
          variant === "primary" ? { backgroundColor: C.buttonPrimary } : styles.btnGhost,
          variant === "primary" && { shadowColor: C.shadow },
          variant === "ghost" && { borderColor: C.text30 },
          animatedStyle,
        ]}
      >
        <Text style={[
          styles.btnText,
          variant === "primary" ? { color: C.buttonPrimaryText } : { color: C.text },
          fontsLoaded && { fontFamily: fonts.inter.semiBold },
        ]}>
          {text}
        </Text>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  btn: { 
    minWidth: 120, 
    minHeight: 44, // WCAG minimum touch target size
    paddingHorizontal: 20, 
    paddingVertical: 14, 
    borderRadius: 999, 
    alignItems: 'center', 
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  btnGhost: { 
    backgroundColor: 'transparent', 
    borderWidth: 2, 
    shadowOpacity: 0.04,
  },
  btnText: { 
    fontSize: 16, 
    fontWeight: '600', 
  },
});

export default Button;
