import Hyperlink from '@/components/Hyperlink';
import React from 'react';
import { Image, View } from 'react-native';

const WelcomeImage = () => {
  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Image
        source={require('@/assets/images/favicon.png')}
        style={{
          width: 100,
          height: 100,
        }}
      />
      <Hyperlink url="https://timedancers.org" style={{ fontWeight: '800', fontSize: 12, color: '#1a5632' }}>
        Timedancers Meditation
      </Hyperlink>
    </View>
  );
};

export default WelcomeImage;
