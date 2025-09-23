import React, { useMemo, useState } from 'react';
import { Modal, View, TouchableOpacity, Platform, StyleSheet, ColorSchemeName } from 'react-native';
import DateTimePicker, { AndroidNativeProps, IOSNativeProps } from '@react-native-community/datetimepicker';
import Button from '@/components/Button';
import { useThemeColors } from '@/hooks/use-theme';
import * as Haptics from 'expo-haptics';

const BG = 'rgba(0,0,0,0.3)';

export default function TimePickerSheet({
  visible,
  time, // "HH:MM" (24h)
  onConfirm,
  onCancel,
  colorScheme,
}: {
  visible: boolean;
  time: string;
  onConfirm: (hhmm: string) => void;
  onCancel: () => void;
  colorScheme?: ColorSchemeName;
}) {
  const C = useThemeColors();
  const initial = useMemo(() => {
    const parts = (time || '').split(':');
    const h = parseInt(parts[0] || '8', 10);
    const m = parseInt(parts[1] || '0', 10);
    const d = new Date();
    d.setHours(!Number.isNaN(h) ? h : 8, !Number.isNaN(m) ? m : 0, 0, 0);
    return d;
  }, [time]);

  const [date, setDate] = useState<Date>(initial);

  const confirm = async () => {
    const hh = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');
    try {
      await Haptics.selectionAsync();
    } catch {}
    onConfirm(`${hh}:${mm}`);
  };

  const commonProps: Partial<IOSNativeProps & AndroidNativeProps> = {
    mode: 'time',
    is24Hour: true,
    onChange: (_e: unknown, d?: Date) => {
      if (d instanceof Date) setDate(d);
    },
  };

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={onCancel} />
        <View style={[styles.sheet, { backgroundColor: C.surface }]}>
          <View style={[styles.toolbar, { borderBottomColor: C.border }]}>
            <Button
              onPress={onCancel}
              text="Cancel"
              variant="ghost"
            />
            <Button
              onPress={confirm}
              text="Done"
              variant="primary"
            />
          </View>

          <View style={styles.pickerContainer}>
            <DateTimePicker
              {...commonProps}
              value={date}
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              themeVariant={colorScheme === 'dark' ? 'dark' : 'light'}
              style={styles.timePicker}
              textColor={C.text}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { 
    flex: 1, 
    backgroundColor: BG, 
    justifyContent: 'flex-end' 
  },
  sheet: {
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    overflow: 'hidden',
  },
  toolbar: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 12,
  },
  pickerContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    alignItems: 'center',
  },
  timePicker: {
    width: '100%',
    height: Platform.OS === 'ios' ? 200 : 60,
    fontWeight: '700',
    fontSize: 16,
  },
});
