import { useI18n } from '@/contexts/I18nContext';
import { useThemeColors } from '@/hooks/ui/use-theme';
import { Pressable, Text } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

interface TestAlertButtonProps {
  onPress: () => void;
  disabled: boolean;
}

export default function TestAlertButton({ onPress, disabled }: TestAlertButtonProps) {
  const C = useThemeColors();
  const { t } = useI18n();
  const scale = useSharedValue(1);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  
  const handlePressIn = () => {
    if (disabled) return;
    scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      testID="test-alert-button"
      accessibilityLabel={t('settings.alerts.accessibility.testAlert')}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
    >
      <Animated.View
        style={[
          {
            paddingHorizontal: 16,
            paddingVertical: 10,
            borderRadius: 20,
            borderWidth: 2,
            borderColor: disabled ? C.text30 : C.text60,
            backgroundColor: disabled ? C.text30 : 'transparent',
            shadowColor: C.shadow,
          },
          animatedStyle,
        ]}
      >
        <Text style={{ 
          color: disabled ? C.text40 : C.text, 
          fontWeight: '600',
          fontSize: 14,
        }}>
          {t('settings.alerts.testAlert')}
        </Text>
      </Animated.View>
    </Pressable>
  );
}