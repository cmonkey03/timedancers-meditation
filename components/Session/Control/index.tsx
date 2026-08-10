import Button from '@/components/Button';
import { uiText } from '@/data/ui-text';
import { useThemeColors } from '@/hooks/use-theme';
import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';

interface Props {
  counting: boolean;
  handleInput: (text: string) => void;
  input: string;
  onPress(action: string): void;
  started: boolean;
}

const Control = ({ counting, handleInput, input, onPress, started }: Props) => {
  const C = useThemeColors();

  const buttonText = useMemo(() => {
    if (counting) return uiText.session.buttons.pause;
    if (!started) return uiText.session.buttons.start;
    if (!counting && started) return uiText.session.buttons.resume;
    return '';
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
            testID={counting ? "pause-button" : "resume-button"}
          />
          <View style={styles.spacer} />
          <Button 
            onPress={() => onPress('cancel')} 
            text={uiText.session.buttons.cancel} 
            variant="ghost" 
            testID="cancel-button"
          />
        </View>
        <View 
          style={[styles.statusContainer, { backgroundColor: C.text30 }]}
          accessibilityLabel={counting ? uiText.session.status.inProgress : uiText.session.status.paused}
          accessibilityRole="summary"
          accessible={true}
        >
          <View style={[styles.statusDot, { 
            backgroundColor: counting ? C.success : C.warning 
          }]} />
          <Text style={[styles.statusText, { color: C.text }]}>
            {counting ? uiText.session.status.inProgress : uiText.session.status.paused}
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
            text={uiText.session.buttons.start}
            variant="primary"
            testID="start-button"
          />
        </View>
        <View style={styles.spacer} />
        <DurationPicker
          value={input}
          onValueChange={handleInput}
        />
      </View>
      <View 
        style={[styles.instructionContainer, { backgroundColor: `${C.text}08` }]}
        accessibilityLabel={uiText.session.accessibility.selectSessionTime}
        accessibilityRole="text"
        accessible={true}
      >
        <Text style={[styles.instructionText, { color: C.text }]}>
          {uiText.session.instructions.selectTime}
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

export default Control;