import React from 'react';
import { Text } from 'react-native';
import { useCustomFonts } from '@/hooks/use-fonts';

interface Props {
  color?: string;
  text: string;
}

const TitleWrapper = ({ color, text }: Props) => {
  const { fontsLoaded, fonts } = useCustomFonts();
  
  if (!fontsLoaded) {
    return (
      <Text
        style={{
          color,
          fontSize: 24,
          fontWeight: '700',
          paddingLeft: 32,
          paddingRight: 32,
          textAlign: 'center',
          letterSpacing: 0.5,
          lineHeight: 32,
        }}
      >
        {text}
      </Text>
    );
  }

  return (
    <Text
      style={{
        color,
        fontSize: 24,
        fontFamily: fonts.cinzel.regular,
        paddingLeft: 32,
        paddingRight: 32,
        textAlign: 'center',
        letterSpacing: 0.8,
        lineHeight: 32,
      }}
    >
      {text}
    </Text>
  );
};

export default TitleWrapper;
