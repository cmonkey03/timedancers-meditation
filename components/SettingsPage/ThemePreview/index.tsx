import { useThemeColors } from '@/hooks/use-theme';
import { useThemeOverride } from '@/hooks/theme-override';
import { Text, View, Pressable } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

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
            borderColor: selected ? '#2d5a3d' : `${C.text}30`,
            backgroundColor: selected ? '#2d5a3d' : 'transparent',
            marginRight: 8,
            marginBottom: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
            elevation: 1,
          },
          animatedStyle,
        ]}
      >
        <Text style={{ 
          color: selected ? '#ffffff' : C.text, 
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
  const { override, setOverride } = useThemeOverride();

  const options = [
    { key: 'system' as const, label: 'System' },
    { key: 'light' as const, label: 'Light' },
    { key: 'dark' as const, label: 'Dark' },
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
      <Text style={{ fontWeight: '600', color: C.text, marginBottom: 10, fontSize: 16 }}>Theme</Text>
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
      <Text style={{ color: C.text, opacity: 0.75, fontSize: 14 }}>Choose your preferred appearance theme.</Text>
    </View>
  );
}
