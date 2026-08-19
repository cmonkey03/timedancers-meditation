import { useI18n } from '@/contexts/I18nContext';
import { useThemeColors } from '@/hooks/ui/use-theme';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

export default function LanguageSelector() {
  const C = useThemeColors();
  const { locale, setLocale, localeNames, availableLocales } = useI18n();

  const LanguageButton = ({ loc }: { loc: 'en' | 'es' }) => {
    const selected = loc === locale;
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
        onPress={() => setLocale(loc)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        testID={`language-${loc}`}
        accessibilityLabel={localeNames[loc]}
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
            {localeNames[loc]}
          </Text>
        </Animated.View>
      </Pressable>
    );
  };

  const buttons = availableLocales.map((loc) => <LanguageButton key={loc} loc={loc} />);

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