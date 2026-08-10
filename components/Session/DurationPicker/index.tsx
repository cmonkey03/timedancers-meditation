import { uiText } from '@/data/ui-text';
import { useThemeColors } from '@/hooks/use-theme';
import { Picker } from '@react-native-picker/picker';
import { Platform, StyleSheet, View } from 'react-native';

interface Props {
  value: string;
  onValueChange: (value: string) => void;
}

const DurationPicker = ({ value, onValueChange }: Props) => {
  const C = useThemeColors();

  // Generate options from 1 to 60 minutes
  const minuteOptions = Array.from({ length: 60 }, (_, i) => i + 1);

  return (
    <View style={styles.container}>
      <View style={[styles.pickerContainer, { backgroundColor: C.surface, borderColor: C.border }]}>
        <Picker
          selectedValue={value}
          onValueChange={onValueChange}
          style={[styles.picker, { color: C.text }]}
          itemStyle={Platform.OS === 'ios' ? [styles.iosItem, { color: C.text }] : undefined}
          accessibilityLabel={`${uiText.session.accessibility.selectDuration} ${value} minutes`}
          accessibilityHint={uiText.session.accessibility.swipeToSelect}
        >
          {minuteOptions.map((minute) => (
            <Picker.Item
              key={minute}
              label={minute.toString()}
              value={minute.toString()}
              color={C.text}
            />
          ))}
        </Picker>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  pickerContainer: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    width: 120,
    height: Platform.OS === 'ios' ? 140 : 50,
  },
  picker: {
    width: '100%',
    height: '100%',
  },
  iosItem: {
    fontSize: 20,
    fontWeight: '600',
    height: 140,
  },
});

export default DurationPicker;
