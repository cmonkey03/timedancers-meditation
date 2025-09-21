import { Text, TextInput, View, TouchableOpacity, Switch } from 'react-native';
import { useEffect, useState } from 'react';
import Button from '@/components/Button';

interface Props {
  counting: boolean;
  handleInput: (text: string) => void;
  input: string;
  onPress(action: string): void;
  started: boolean;
  alertMode: 'chime' | 'chime_haptic' | 'haptic' | 'silent';
  onChangeAlertMode: (m: 'chime' | 'chime_haptic' | 'haptic' | 'silent') => void;
  allowBackgroundAlerts: boolean;
  onChangeAllowBackgroundAlerts: (v: boolean) => void;
}

const WheelControls = ({ counting, handleInput, input, onPress, started, alertMode, onChangeAlertMode, allowBackgroundAlerts, onChangeAllowBackgroundAlerts }: Props) => {
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
      {/* Alert mode selector */}
      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 8, flexWrap: 'wrap' as any }}>
        {([
          { key: 'chime', label: 'Chime' },
          { key: 'chime_haptic', label: 'Chime+Haptic' },
          { key: 'haptic', label: 'Haptic' },
          { key: 'silent', label: 'Silent' },
        ] as const).map(opt => (
          <TouchableOpacity
            key={opt.key}
            onPress={() => onChangeAlertMode(opt.key)}
            style={{
              paddingVertical: 6,
              paddingHorizontal: 10,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: alertMode === opt.key ? '#1a5632' : '#cbd5d1',
              backgroundColor: alertMode === opt.key ? '#e4ede7' : '#fff',
              marginHorizontal: 4,
              marginVertical: 4,
            }}
          >
            <Text style={{ color: '#1a5632', fontWeight: alertMode === opt.key ? '700' : '500' }}>{opt.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={{ height: 16 }} />
      <View style={{ alignItems: 'center' }}>
        <Button backgroundColor="#e4ede7" onPress={() => onPress('test_alert')} text="Test Alert" />
      </View>
      <View style={{ height: 16 }} />
      {/* Background alerts toggle */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        <Text style={{ color: '#1a5632', fontWeight: '600' }}>Allow background alerts</Text>
        <Switch
          value={allowBackgroundAlerts}
          onValueChange={onChangeAllowBackgroundAlerts}
          trackColor={{ true: '#1a5632', false: '#cbd5d1' }}
          thumbColor={allowBackgroundAlerts ? '#e4ede7' : '#fff'}
        />
      </View>
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
