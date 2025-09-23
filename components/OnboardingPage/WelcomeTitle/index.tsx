import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';

const WelcomeTitle = () => {
  const eventText = ['reckoning', 'awakening'];
  const eventColor = ['#a12b2a', '#1a5632'];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIndex(1);
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <View style={{ maxWidth: 650 }}>
        <Text style={{
          textAlign: 'center',
          fontSize: 32,
          fontWeight: '300',
          color: '#1a5632',
          marginBottom: 8,
        }}>A great</Text>
        <Text style={{
          textAlign: 'center',
          fontSize: 36,
          fontWeight: 'bold',
          color: eventColor[index],
          marginBottom: 8,
          textTransform: 'uppercase',
          letterSpacing: 2,
        }}>{eventText[index]}</Text>
        <Text style={{
          textAlign: 'center',
          fontSize: 32,
          fontWeight: '300',
          color: '#1a5632',
          marginBottom: 20
        }}>is here.</Text>
      </View>
    </View>
  );
};

export default WelcomeTitle;
