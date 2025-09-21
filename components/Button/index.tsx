import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useThemeColors } from '@/hooks/use-theme';

interface Props {
  backgroundColor?: string;
  onPress(): void;
  text: string;
}

const Button = ({ backgroundColor, onPress, text }: Props) => {
  const C = useThemeColors();
  const bg = backgroundColor ?? C.surface;
  return (
    <View>
      <Pressable onPress={onPress}>
        <View
          style={{
            backgroundColor: bg,
            borderRadius: 10,
            padding: 12,
          }}
        >
          <Text
            style={{
              color: C.text,
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
};

export default Button;
