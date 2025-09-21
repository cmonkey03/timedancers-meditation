import React from 'react';
import { Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeColors } from '@/hooks/use-theme';

interface Props {
  color?: string; // optional: falls back to theme text color
  backgroundColor: string[];
  text: string;
}

const Wheel = ({ color, backgroundColor, text }: Props) => {
  const C = useThemeColors();
  const textColor = color ?? C.text;
  return (
    <LinearGradient
      style={{
        alignItems: 'center',
        borderRadius: 50,
        height: 100,
        justifyContent: 'center',
        width: 100,
      }}
      colors={backgroundColor as any}
    >
      <Text style={{ color: textColor, fontWeight: '600' }}>{text}</Text>
    </LinearGradient>
  );
};

export default Wheel;
