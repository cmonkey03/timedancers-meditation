import Wheel from '@/components/MeditationPage/Wheel';
import { useThemeColors } from '@/hooks/use-theme';
import React from 'react';
import { Text, useColorScheme, View } from 'react-native';

interface Props {
  large: boolean;
  text1: string;
  text2: string;
  text3: string;
  label1?: string;
  label2?: string;
  label3?: string;
  past1?: boolean;
  past2?: boolean;
  past3?: boolean;
}

const WheelTower = ({ large, text1, text2, text3, label1, label2, label3, past1, past2, past3 }: Props) => {
  const C = useThemeColors();
  const scheme = useColorScheme();
  const dark = scheme === 'dark';
  // Choose gradients by scheme (brand-aware)
  // Light: vivid; Dark: subdued, higher contrast against dark bg
  const topGrad = dark ? ['#4c3b9a', '#1f2a44'] : ['purple', 'indigo']; // Wisdom
  const midGrad = dark ? ['#1a5632', '#0b3d2e'] : ['blue', 'green'];      // Heart (leans green)
  const botGrad = dark ? ['#b48219', '#6e2a1a'] : ['yellow', 'red'];       // Power (amber → rust)
  return (
    <View
      style={{
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Wheel color={dark ? C.text : 'white'} backgroundColor={topGrad} text={text3} />
      {label3 ? (
        <Text style={{ marginTop: 6, color: past3 ? C.mutedText : C.text, fontWeight: '600' }}>{label3}</Text>
      ) : null}
      <View style={{ height: large ? 48 : 24 }} />
      <Wheel color={dark ? C.text : 'white'} backgroundColor={midGrad} text={text2} />
      {label2 ? (
        <Text style={{ marginTop: 6, color: past2 ? C.mutedText : C.text, fontWeight: '600' }}>{label2}</Text>
      ) : null}
      <View style={{ height: large ? 48 : 24 }} />
      <Wheel color={dark ? C.text : 'black'} backgroundColor={botGrad} text={text1} />
      {label1 ? (
        <Text style={{ marginTop: 6, color: past1 ? C.mutedText : C.text, fontWeight: '600' }}>{label1}</Text>
      ) : null}
    </View>
  );
};

export default WheelTower;
