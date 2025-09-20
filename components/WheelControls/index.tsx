import { Text, TextInput, View } from 'react-native';
import { useEffect, useState } from 'react';
import Button from '@/components/Button';

interface Props {
  counting: boolean;
  handleInput: (text: string) => void;
  input: string;
  onPress(action: string): void;
  started: boolean;
}

const WheelControls = ({ counting, handleInput, input, onPress, started }: Props): JSX.Element => {
  const [buttonText, setButtonText] = useState('');

  useEffect(() => {
    if (counting) setButtonText('Pause');
    if (!started) setButtonText('Start');
    if (!counting && started) setButtonText('Resume');
  }, [counting, started]);

  return (
    <>
      <View style={{ flexDirection: 'row' }}>
        {!started && (
          <>
            <View>
              {!started && (
                <TextInput
                  keyboardType="numeric"
                  placeholder="Minutes"
                  placeholderTextColor="#1a5632"
                  onChangeText={handleInput}
                  value={input}
                  maxLength={3}
                  textAlign={'center'}
                  style={{
                    fontSize: 16,
                    color: '#1a5632',
                    fontWeight: 'bold',
                    borderWidth: 1,
                    maxWidth: 56,
                    padding: 10,
                  }}
                />
              )}
            </View>
            <View style={{ width: 32 }} />
          </>
        )}
        <Button
          backgroundColor="#e4ede7"
          onPress={() => (counting ? onPress('pause') : onPress('counting'))}
          text={buttonText}
        />
      </View>
      <View style={{ height: 32 }} />
      <View>
        {started ? (
          <Button backgroundColor="#e4ede7" onPress={() => onPress('cancel')} text="Cancel" />
        ) : (
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 20,
              textAlign: 'center',
              color: '#1a5632',
            }}
          >
            Enter time in minutes
          </Text>
        )}
      </View>
    </>
  );
};

export default WheelControls;
