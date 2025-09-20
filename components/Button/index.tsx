import React from 'react';
import { Pressable, Text, View } from 'react-native';

interface Props {
    backgroundColor: string;
    onPress(): void;
    text: string;
}

const Button = ({ backgroundColor, onPress, text }: Props) => (
  <View>
    <Pressable onPress={onPress}>
      <View
        style={{
          backgroundColor,
          borderRadius: 10,
          padding: 12,
        }}
      >
        <Text
          style={{
            color: '#1a5632',
            fontWeight: 'bold',
            textAlign: 'center',
          }}
        >
          {text}
        </Text>
      </View>
    </Pressable>
  </View>
);

export default Button;
