import DismissKeyboard from '@/components/DismissKeyboard';
import Meditation from '@/components/MeditationPage';
import { useKeepAwakeSafe } from '@/hooks/use-keep-awake-safe';
import { useThemeColors } from '@/hooks/use-theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

export default function MeditateScreen() {
  useKeepAwakeSafe();
  const C = useThemeColors();
  const [onboarded, setOnboarded] = useState(false);

  useEffect(() => {
    const checkStorage = async () => {
      try {
        const storage = await AsyncStorage.getItem('hasOnboarded');
        if (storage) {
          const parsed = JSON.parse(storage);
          if (parsed?.hasOnboarded) setOnboarded(true);
        }
      } catch (e) {
        console.log(e);
      }
    };
    checkStorage();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: C.background }} testID="screen-meditate">
      <DismissKeyboard>
        <Meditation handler={setOnboarded} onboarded={onboarded} />
      </DismissKeyboard>
    </View>
  );
}
