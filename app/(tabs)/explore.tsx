import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as WebBrowser from 'expo-web-browser';

const links = [
  { label: 'Timedancers.org', url: 'https://timedancers.org' },
  { label: 'Research: Intimate Violence', url: 'https://timedancers.org/research/intimate-violence' },
  { label: 'Newsletter', url: 'https://newsletter.timedancers.org' },
];

export default function Explore() {
  return (
    <View style={s.wrap}>
      <Text style={s.title}>Explore</Text>
      {links.map((l) => (
        <TouchableOpacity key={l.url} style={s.link} onPress={() => WebBrowser.openBrowserAsync(l.url)}>
          <Text style={s.linkText}>{l.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1, padding: 24 },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 12, color: '#1a5632' },
  link: { paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#eee' },
  linkText: { fontSize: 16, color: '#1a5632', fontWeight: '600' },
});
