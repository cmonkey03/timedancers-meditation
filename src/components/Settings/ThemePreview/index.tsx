import { useI18n } from '@/contexts/I18nContext';
import { useThemeOverride } from '@/hooks/theme-override';
import { useThemeColors } from '@/hooks/ui/use-theme';
import { Pressable, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

const ThemePillButton = ({ opt, selected, onPress }: { 
  opt: { key: 'system' | 'light' | 'dark'; label: string }; 
  selected: boolean; 
  onPress: () => void; 
}) => {
  const C = useThemeColors();
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
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      testID={`theme-${opt.key}`}
    >
      <Animated.View
        style={[
          {
            paddingHorizontal: 18,
            paddingVertical: 12,
            borderRadius: 22,
            borderWidth: 2,
            borderColor: selected ? C.buttonPrimary : C.text30,
            backgroundColor: selected ? C.buttonPrimary : C.buttonGhost,
            marginRight: 8,
            marginBottom: 8,
            shadowColor: C.shadow,
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
            elevation: 1,
          },
          animatedStyle,
        ]}
      >
        <Text style={{ 
          color: selected ? C.buttonPrimaryText : C.text, 
          fontWeight: selected ? '600' : '500',
          fontSize: 14,
        }}>
          {opt.label}
        </Text>
      </Animated.View>
    </Pressable>
  );
};

export default function ThemePreview() {
  const C = useThemeColors();
  const { t } = useI18n();
  const { override, setOverride } = useThemeOverride();

  const options = [
    { key: 'system' as const, label: t('settings.theme.system') },
    { key: 'light' as const, label: t('settings.theme.light') },
    { key: 'dark' as const, label: t('settings.theme.dark') },
  ];

  return (
    <View
      style={{
        backgroundColor: C.surface,
        borderRadius: 12,
        padding: 12,
        marginBottom: 16,
      }}
    >
      <Text style={{ fontWeight: '600', color: C.text, marginBottom: 10, fontSize: 16 }}>{t('settings.sections.theme')}</Text>
      <View style={{ flexDirection: 'row', marginBottom: 8, flexWrap: 'wrap' }}>
        {options.map((opt) => {
          const selected =
            (opt.key === 'system' && override == null) ||
            (opt.key === 'light' && override === 'light') ||
            (opt.key === 'dark' && override === 'dark');
          return (
            <ThemePillButton
              key={opt.key}
              opt={opt}
              selected={selected}
              onPress={() => setOverride(opt.key === 'system' ? null : (opt.key as 'light' | 'dark'))}
            />
          );
        })}
      </View>
      <Text style={{ color: C.text, opacity: 0.75, fontSize: 14 }}>{t('settings.theme.description')}</Text>
    </View>
  );
}
