import React from 'react';
import { Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface Props {
  color: string;
  backgroundColor: string[];
  text: string;
}

const Wheel = ({ color, backgroundColor, text }: Props) => (
  <LinearGradient
    style={{
      alignItems: 'center',
      borderRadius: 50,
      height: 100,
      justifyContent: 'center',
      width: 100,
    }}
    colors={backgroundColor}
  >
    <Text style={{ color, fontWeight: '600' }}>{text}</Text>
  </LinearGradient>
);

export default Wheel;
