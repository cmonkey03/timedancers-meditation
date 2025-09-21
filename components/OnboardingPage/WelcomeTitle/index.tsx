import React from 'react';
import { View, Text } from 'react-native';

const WelcomeTitle = () => {
  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <View style={{ maxWidth: 650 }}>
        <Text
          style={{
            textAlign: 'center',
            fontSize: 18,
            fontWeight: 'bold',
            color: '#1a5632',
            marginBottom: 4,
            marginTop: 4,
          }}
        >
          A great
        </Text>
        <Text
          style={{
            textAlign: 'center',
            fontSize: 18,
            fontWeight: 'bold',
            color: '#1a5632',
            marginBottom: 4,
            marginTop: 4,
            textTransform: 'uppercase',
          }}
        >
          awakening
        </Text>
        <Text
          style={{
            textAlign: 'center',
            fontSize: 18,
            fontWeight: 'bold',
            color: '#1a5632',
            marginBottom: 4,
            marginTop: 4,
          }}
        >
          is here.
        </Text>
      </View>
    </View>
  );
};

export default WelcomeTitle;
