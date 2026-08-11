import React, { useEffect, useState } from 'react';
import { Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';

interface Props {
  text: string;
  delay?: number;
  speed?: number;
  style?: any;
  onComplete?: () => void;
}

const AnimatedText = ({ text, delay = 0, speed = 50, style, onComplete }: Props) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const opacity = useSharedValue(0);

  useEffect(() => {
    // Start typing after delay
    const startTyping = () => {
      // Fade in the text container
      opacity.value = withTiming(1, {
        duration: 300,
        easing: Easing.out(Easing.quad),
      });

      setIsTyping(true);
      let currentIndex = 0;
      const typeInterval = setInterval(() => {
        if (currentIndex < text.length) {
          setDisplayedText(text.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(typeInterval);
          // Ensure full text is displayed
          setDisplayedText(text);
          setIsTyping(false);
          if (onComplete) {
            onComplete();
          }
        }
      }, speed);

      return () => clearInterval(typeInterval);
    };

    const timeout = setTimeout(startTyping, delay);
    return () => clearTimeout(timeout);
  }, [text, delay, speed, onComplete, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.Text style={[style, animatedStyle]}>
      {displayedText}
      {isTyping && (
        <Text style={{ opacity: 0.3 }}>|</Text>
      )}
    </Animated.Text>
  );
};

export default AnimatedText;
