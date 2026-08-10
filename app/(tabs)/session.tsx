import DismissKeyboard from '@/components/DismissKeyboard';
import Session from '@/components/SessionPage';
import { useKeepAwakeSafe } from '@/hooks/use-keep-awake-safe';
import { useThemeColors } from '@/hooks/use-theme';
import { View } from 'react-native';

export default function SessionScreen() {
  useKeepAwakeSafe();
  const C = useThemeColors();

  return (
    <View style={{ flex: 1, backgroundColor: C.background }} testID="screen-session">
      <DismissKeyboard>
        <Session />
      </DismissKeyboard>
    </View>
  );
}
