import { useI18n } from '@/contexts/I18nContext';
import { useThemeColors } from '@/hooks/ui/use-theme';
import type { AlertMode } from '@/types';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

interface ModeSelectorProps {
  mode: AlertMode;
  onModeChange: (mode: AlertMode) => void;
}

export default function ModeSelector({ mode, onModeChange }: ModeSelectorProps) {
  const C = useThemeColors();
  const { t } = useI18n();

  const MODES: { key: AlertMode; label: string }[] = [
    { key: 'chime', label: t('settings.alerts.modes.chime') },
    { key: 'chime_haptic', label: t('settings.alerts.modes.chimeHaptic') },
    { key: 'haptic', label: t('settings.alerts.modes.haptic') },
    { key: 'silent', label: t('settings.alerts.modes.silent') },
  ];

  const PillButton = ({ m }: { m: { key: AlertMode; label: string } }) => {
    const selected = m.key === mode;
    const scale = useSharedValue(1);
    
    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    const handlePressIn = () => {
      scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
    };

    const handlePressOut = () => {
      scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    };

    return (
      <Pressable
        key={m.key}
        onPress={() => onModeChange(m.key)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        testID={`alert-mode-${m.key}`}
        accessibilityLabel={m.label}
        accessibilityRole="radio"
        accessibilityState={{ selected }}
      >
        <Animated.View
          style={[
            styles.pill,
            {
              borderColor: selected ? C.sliderActive : C.sliderActive30,
              backgroundColor: selected ? C.sliderActive : C.buttonGhost,
              shadowColor: C.shadow,
            },
            animatedStyle,
          ]}
        >
          <Text style={{ 
            color: selected ? C.buttonPrimaryText : C.text, 
            fontWeight: selected ? '600' : '500',
            fontSize: 14,
          }}>
            {m.label}
          </Text>
        </Animated.View>
      </Pressable>
    );
  };

  const buttons = MODES.map((m) => <PillButton key={m.key} m={m} />);

  return (
    <View style={styles.row}>
      {buttons}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  pill: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 22,
    borderWidth: 2,
    marginRight: 8,
    marginBottom: 8,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
});