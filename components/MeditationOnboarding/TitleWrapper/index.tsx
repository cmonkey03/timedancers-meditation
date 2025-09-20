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
      fontSize: 20,
      fontWeight: 'bold',
      paddingLeft: 28,
      paddingRight: 28,
      textAlign: 'center',
    }}
  >
    {text}
  </Text>
);

export default TitleWrapper;
