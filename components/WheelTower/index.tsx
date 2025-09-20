import React from 'react';
import { View } from 'react-native';
import Wheel from '@/components/Wheel';

interface Props {
  large: boolean;
  text1: string;
  text2: string;
  text3: string;
}

const WheelTower = ({ large, text1, text2, text3 }: Props) => (
  <View
    style={{
      flexDirection: 'column',
      alignItems: 'center',
    }}
  >
    <Wheel color="white" backgroundColor={['purple', 'indigo']} text={text3} />
    <View style={{ height: large ? 48 : 24 }} />
    <Wheel color="white" backgroundColor={['blue', 'green']} text={text2} />
    <View style={{ height: large ? 48 : 24 }} />
    <Wheel color="black" backgroundColor={['yellow', 'red']} text={text1} />
  </View>
);

export default WheelTower;
