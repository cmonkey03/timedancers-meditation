import React from 'react';
import { Text } from 'react-native';

interface Props {
  color?: string;
  text: string;
}

const TitleWrapper = ({ color, text }: Props) => (
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

export default TitleWrapper;
