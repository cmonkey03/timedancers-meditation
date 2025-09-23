import DismissKeyboard from '@/components/DismissKeyboard';
import Meditation from '@/components/MeditationPage';
import { useKeepAwakeSafe } from '@/hooks/use-keep-awake-safe';
import { useThemeColors } from '@/hooks/use-theme';
import { View } from 'react-native';

export default function MeditateScreen() {
  useKeepAwakeSafe();
  const C = useThemeColors();

  return (
    <View style={{ flex: 1, backgroundColor: C.background }} testID="screen-meditate">
      <DismissKeyboard>
        <Meditation />
      </DismissKeyboard>
    </View>
  );
}
