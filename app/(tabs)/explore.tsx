import { View, Text, StyleSheet, Pressable } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { useThemeColors } from '@/hooks/use-theme';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

const links = [
  { label: 'Timedancers.org', url: 'https://timedancers.org' },
  { label: 'Research: Intimate Violence', url: 'https://timedancers.org/research/intimate-violence' },
  { label: 'Newsletter', url: 'https://newsletter.timedancers.org' },
];

const LinkButton = ({ link }: { link: { label: string; url: string } }) => {
  const C = useThemeColors();
  const scale = useSharedValue(1);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  return (
    <Pressable
      onPress={() => WebBrowser.openBrowserAsync(link.url)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View style={[s.link, { borderBottomColor: C.border }, animatedStyle]}>
        <Text style={[s.linkText, { color: C.text }]}>{link.label}</Text>
      </Animated.View>
    </Pressable>
  );
};

export default function Explore() {
  const C = useThemeColors();
  return (
    <View style={[s.wrap, { backgroundColor: C.background }]}>
      <Text style={[s.title, { color: C.text }]}>Explore</Text>
      {links.map((l) => (
        <LinkButton key={l.url} link={l} />
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1, padding: 24 },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
  link: { paddingVertical: 14, borderBottomWidth: 1 },
  linkText: { fontSize: 16, fontWeight: '600' },
});
