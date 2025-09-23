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
        <Text
          style={{
            textAlign: 'center',
            fontSize: 6,
            fontWeight: 'bold',
            color: '#1a5632',
            marginBottom: 1,
            marginTop: 1,
          }}
        >
          A great
        </Text>
        <Text
          style={{
            textAlign: 'center',
            fontSize: 6,
            fontWeight: 'bold',
            color: eventColor[index],
            marginBottom: 1,
            marginTop: 1,
            textTransform: 'uppercase',
          }}
        >
          {eventText[index]}
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
