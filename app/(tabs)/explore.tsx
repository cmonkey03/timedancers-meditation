import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { useThemeColors } from '@/hooks/use-theme';

const links = [
  { label: 'Timedancers.org', url: 'https://timedancers.org' },
  { label: 'Research: Intimate Violence', url: 'https://timedancers.org/research/intimate-violence' },
  { label: 'Newsletter', url: 'https://newsletter.timedancers.org' },
];

export default function Explore() {
  const C = useThemeColors();
  return (
    <View style={[s.wrap, { backgroundColor: C.background }]}>
      <Text style={[s.title, { color: C.text }]}>Explore</Text>
      {links.map((l) => (
        <TouchableOpacity key={l.url} style={[s.link, { borderBottomColor: C.border }]} onPress={() => WebBrowser.openBrowserAsync(l.url)}>
          <Text style={[s.linkText, { color: C.text }]}>{l.label}</Text>
        </TouchableOpacity>
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
