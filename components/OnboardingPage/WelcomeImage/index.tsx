import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';

const WelcomeImage = () => {
  
  // Simple growing animation
  const treeScale = useSharedValue(0);
  const treeOpacity = useSharedValue(0);
  
  useEffect(() => {
    const startAnimation = () => {
      // Tree grows with a nice bounce effect
      treeScale.value = withDelay(
        300,
        withTiming(1, {
          duration: 1500,
          easing: Easing.out(Easing.back(1.1)),
        })
      );
      
      // Fade in smoothly
      treeOpacity.value = withDelay(
        300,
        withTiming(1, {
          duration: 1200,
          easing: Easing.out(Easing.quad),
        })
      );
      
    };
    
    startAnimation();
  }, [treeScale, treeOpacity]);
  
  const animatedTreeStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: treeScale.value }],
      opacity: treeOpacity.value,
    };
  });
  
  
  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 28,
      }}
    >
      {/* The growing tree */}
      <Animated.Image
        source={require('@/assets/images/favicon.png')}
        style={[
          {
            width: 120,
            height: 120,
            marginBottom: 5,
          },
          animatedTreeStyle,
        ]}
      />
    </View>
  );
};

export default WelcomeImage;
