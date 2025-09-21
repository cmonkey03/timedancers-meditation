import React from 'react';
import { View, Text } from 'react-native';
import Wheel from '@/components/Wheel';

interface Props {
  large: boolean;
  text1: string;
  text2: string;
  text3: string;
  label1?: string;
  label2?: string;
  label3?: string;
}

const WheelTower = ({ large, text1, text2, text3, label1, label2, label3 }: Props) => (
  <View
    style={{
      flexDirection: 'column',
      alignItems: 'center',
    }}
  >
    <Wheel color="white" backgroundColor={['purple', 'indigo']} text={text3} />
    {label3 ? (
      <Text style={{ marginTop: 6, color: '#1a5632', fontWeight: '600' }}>{label3}</Text>
    ) : null}
    <View style={{ height: large ? 48 : 24 }} />
    <Wheel color="white" backgroundColor={['blue', 'green']} text={text2} />
    {label2 ? (
      <Text style={{ marginTop: 6, color: '#1a5632', fontWeight: '600' }}>{label2}</Text>
    ) : null}
    <View style={{ height: large ? 48 : 24 }} />
    <Wheel color="black" backgroundColor={['yellow', 'red']} text={text1} />
    {label1 ? (
      <Text style={{ marginTop: 6, color: '#1a5632', fontWeight: '600' }}>{label1}</Text>
    ) : null}
  </View>
);

export default WheelTower;
