import React from 'react';
import { View } from 'react-native';

interface Props {
  children: React.ReactNode;
}

const ImageWrapper = ({ children }: Props) => (
  <View
    style={{
      paddingBottom: 28,
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    {children}
  </View>
);

export default ImageWrapper;
