import { useThemeColors } from '@/hooks/use-theme';
import { useThemeOverride } from '@/hooks/theme-override';
import { Text, TouchableOpacity, View } from 'react-native';

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
      <Text style={{ fontWeight: '600', color: C.text, marginBottom: 10 }}>Theme Preview</Text>
      <View style={{ flexDirection: 'row', marginBottom: 6, flexWrap: 'wrap' }}>
        {options.map((opt) => {
          const selected =
            (opt.key === 'system' && override == null) ||
            (opt.key === 'light' && override === 'light') ||
            (opt.key === 'dark' && override === 'dark');
          return (
            <TouchableOpacity
              key={opt.key}
              onPress={() => setOverride(opt.key === 'system' ? null : (opt.key as 'light' | 'dark'))}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: selected ? C.primary : C.border,
                backgroundColor: selected ? C.background : 'transparent',
                marginRight: 8,
                marginBottom: 8,
              }}
              testID={`theme-${opt.key}`}
            >
              <Text style={{ color: C.text, fontWeight: selected ? '700' : '500' }}>{opt.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <Text style={{ color: C.mutedText, marginTop: 2 }}>Tip: Reset to defaults returns to System appearance.</Text>
    </View>
  );
}
