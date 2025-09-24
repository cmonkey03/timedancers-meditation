import { useThemeColors } from '@/hooks/use-theme';
import { useCustomFonts } from '@/hooks/use-fonts';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';

const AnimatedWelcomeText = () => {
  const C = useThemeColors();
  const { fontsLoaded, fonts } = useCustomFonts();
  
  // Animation values for mystical appearance
  const titleOpacity = useSharedValue(0);
  const titleScale = useSharedValue(0.8);
  const subtitleOpacity = useSharedValue(0);
  const subtitleScale = useSharedValue(0.8);
  
  const fullTitle = "Decolonize your destiny";
  const fullSubtitle = "Unlock the power of timedancing through meditating on three sacred centers";

  useEffect(() => {
    if (!fontsLoaded) return;
    
    // Mystical emergence from mist - title appears slowly
    titleOpacity.value = withDelay(
      1200, // Start after tree has grown
      withTiming(1, {
        duration: 2000, // Slow, mystical fade-in
        easing: Easing.out(Easing.cubic),
      })
    );
    
    titleScale.value = withDelay(
      1200,
      withTiming(1, {
        duration: 2000,
        easing: Easing.out(Easing.back(1.1)), // Subtle magical expansion
      })
    );
    
    // Subtitle emerges from mist after title
    subtitleOpacity.value = withDelay(
      2800, // Start after title is mostly visible
      withTiming(1, {
        duration: 1800,
        easing: Easing.out(Easing.cubic),
      })
    );
    
    subtitleScale.value = withDelay(
      2800,
      withTiming(1, {
        duration: 1800,
        easing: Easing.out(Easing.cubic),
      })
    );
  }, [fontsLoaded, titleOpacity, titleScale, subtitleOpacity, subtitleScale]);

  const animatedTitleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ scale: titleScale.value }],
  }));

  const animatedSubtitleStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
    transform: [{ scale: subtitleScale.value }],
  }));

  // Don't render until fonts are loaded
  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={{ 
      alignItems: 'center', 
      paddingHorizontal: 32, 
      marginTop: 24,
    }}>
      <Animated.Text style={[
        {
          fontSize: 28,
          fontFamily: fonts.cinzel.semiBold,
          color: C.text,
          textAlign: 'center',
          marginBottom: 16,
          letterSpacing: 1,
        },
        animatedTitleStyle,
      ]}>
        {fullTitle}
      </Animated.Text>
      
      <Animated.Text style={[
        {
          fontSize: 16,
          fontFamily: fonts.inter.regular,
          color: C.text,
          opacity: 0.75,
          textAlign: 'center',
          letterSpacing: 0.3,
          lineHeight: 24,
        },
        animatedSubtitleStyle,
      ]}>
        {fullSubtitle}
      </Animated.Text>
    </View>
  );
};

export default AnimatedWelcomeText;
