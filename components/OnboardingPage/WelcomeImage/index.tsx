import Hyperlink from '@/components/Hyperlink';
import React from 'react';
import { Image, View } from 'react-native';
import { useThemeColors } from '@/hooks/use-theme';

const WelcomeImage = () => {
  const C = useThemeColors();
  
  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
      }}
    >
      <Image
        source={require('@/assets/images/favicon.png')}
        style={{
          width: 120,
          height: 120,
          marginBottom: 20,
        }}
      />
      <Hyperlink 
        url="https://timedancers.org" 
        style={{ 
          fontWeight: '600', 
          fontSize: 16, 
          color: C.text,
          opacity: 0.8
        }}
      >
        Timedancers Meditation
      </Hyperlink>
    </View>
  );
};

export default WelcomeImage;
