import Button from '@/components/Button';
import TimerWheelPicker from '@/components/TimerWheelPicker';
import { useThemeColors } from '@/hooks/use-theme';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';

interface Props {
  counting: boolean;
  handleInput: (text: string) => void;
  input: string;
  onPress(action: string): void;
  started: boolean;
}

const WheelControls = ({ counting, handleInput, input, onPress, started }: Props) => {
  const C = useThemeColors();
  const [buttonText, setButtonText] = useState('');

  useEffect(() => {
    if (counting) setButtonText('Pause');
    if (!started) setButtonText('Start');
    if (!counting && started) setButtonText('Resume');
  }, [counting, started]);

  if (started) {
    // Timer is running - show pause/resume and cancel
    return (
      <Animated.View style={styles.container} entering={FadeInUp} exiting={FadeOutUp}>
        <View style={styles.horizontalSection}>
          <Button
            onPress={() => (counting ? onPress('pause') : onPress('counting'))}
            text={buttonText}
            variant="primary"
          />
          <View style={styles.spacer} />
          <Button 
            onPress={() => onPress('cancel')} 
            text="Cancel" 
            variant="ghost" 
          />
        </View>
        <View style={[styles.statusContainer, { backgroundColor: `${C.text}08` }]}>
          <View style={[styles.statusDot, { 
            backgroundColor: counting ? '#4ade80' : '#fbbf24' 
          }]} />
          <Text style={[styles.statusText, { color: C.text }]}>
            {counting ? 'Meditation in progress' : 'Meditation paused'}
          </Text>
        </View>
      </Animated.View>
    );
  }

  // Timer not started - show picker and start button
  return (
    <Animated.View style={styles.container} entering={FadeInUp} exiting={FadeOutUp}>
      <View style={styles.horizontalSection}>
        <View style={styles.buttonContainer}>
          <Button
            onPress={() => onPress('counting')}
            text="Start"
            variant="primary"
          />
        </View>
        <View style={styles.spacer} />
        <TimerWheelPicker
          value={input}
          onValueChange={handleInput}
        />
      </View>
      <View style={[styles.instructionContainer, { backgroundColor: `${C.text}08` }]}>
        <Text style={[styles.instructionText, { color: C.text }]}>
          Select meditation time
        </Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  horizontalSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spacer: {
    width: 16,
  },
  buttonContainer: {
    alignItems: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  instructionContainer: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 16,
  },
  instructionText: {
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
    opacity: 0.8,
  },
});

export default WheelControls;
