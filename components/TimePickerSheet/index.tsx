import React, { useMemo, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, Platform, StyleSheet, ColorSchemeName } from 'react-native';
import DateTimePicker, { AndroidNativeProps, IOSNativeProps } from '@react-native-community/datetimepicker';
import * as Haptics from 'expo-haptics';

const GREEN = '#1a5632';
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
        <View style={[styles.sheet, Platform.OS === 'ios' && (colorScheme === 'dark' ? styles.sheetDark : undefined)]}>
          <View style={[styles.toolbar, Platform.OS === 'ios' && (colorScheme === 'dark' ? styles.toolbarDark : undefined)]}>
            <TouchableOpacity onPress={onCancel} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Text style={[styles.btn, { color: '#6b6f6c' }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={confirm} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Text style={[styles.btn, { color: GREEN }]}>Done</Text>
            </TouchableOpacity>
          </View>

          <View style={{ paddingHorizontal: 8, paddingBottom: 12 }}>
            <DateTimePicker
              {...commonProps}
              value={date}
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              // Keep styling minimal for maximum compatibility across versions
              themeVariant={colorScheme === 'dark' ? 'dark' : 'light'}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: BG, justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    overflow: 'hidden',
  },
  sheetDark: {
    backgroundColor: '#1b1b1b',
  },
  toolbar: {
    paddingHorizontal: 16,
    height: 48,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e6e6e6',
  },
  toolbarDark: {
    borderBottomColor: '#333',
  },
  btn: { fontSize: 16, fontWeight: '700' },
});
