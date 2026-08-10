import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { useThemeColors } from '@/hooks/use-theme';

const WelcomeTitle = () => {
  const C = useThemeColors();
  const eventText = ['timedance', 'awakening'];
  const eventColor = ['#2d5a3d', '#1a5632'];
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
          color: C.text,
          opacity: 0.8,
          marginBottom: 8,
        }}>Your</Text>
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
          color: C.text,
          opacity: 0.8,
          marginBottom: 5
        }}>is here</Text>
      </View>
    </View>
  );
};

export default WelcomeTitle;
