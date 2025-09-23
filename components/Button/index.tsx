import React from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withTiming 
} from 'react-native-reanimated';
import { useThemeColors } from '@/hooks/use-theme';

interface Props {
  onPress(): void;
  text: string;
  variant?: "primary" | "ghost";
}

const Button = ({ onPress, text, variant = "primary" }: Props) => {
  const C = useThemeColors();
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
    >
      <Animated.View
        style={[
          styles.btn,
          variant === "primary" ? styles.btnPrimary : styles.btnGhost,
          variant === "ghost" && { borderColor: C.text },
          animatedStyle,
        ]}
      >
        <Text style={[
          styles.btnText,
          variant === "ghost" && { color: C.text },
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
    paddingHorizontal: 24, 
    paddingVertical: 16, 
    borderRadius: 24, 
    alignItems: 'center', 
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  btnPrimary: { 
    backgroundColor: '#2d5a3d' 
  },
  btnGhost: { 
    backgroundColor: 'transparent', 
    borderWidth: 2, 
    shadowOpacity: 0.05,
  },
  btnText: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: '#ffffff' 
  },
});

export default Button;
