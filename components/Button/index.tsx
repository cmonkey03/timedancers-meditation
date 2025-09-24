import React from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withTiming 
} from 'react-native-reanimated';
import { useThemeColors } from '@/hooks/use-theme';
import { useCustomFonts } from '@/hooks/use-fonts';

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
    >
      <Animated.View
        style={[
          styles.btn,
          variant === "primary" ? styles.btnPrimary : styles.btnGhost,
          variant === "ghost" && { borderColor: `${C.text}4D` },
          animatedStyle,
        ]}
      >
        <Text style={[
          styles.btnText,
          variant === "ghost" && { color: C.text },
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
    paddingHorizontal: 20, 
    paddingVertical: 14, 
    borderRadius: 22, 
    alignItems: 'center', 
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  btnPrimary: { 
    backgroundColor: '#2d5a3d' 
  },
  btnGhost: { 
    backgroundColor: 'transparent', 
    borderWidth: 2, 
    shadowOpacity: 0.04,
  },
  btnText: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: '#ffffff' 
  },
});

export default Button;
