import DismissKeyboard from '@/components/DismissKeyboard';
import Meditation from '@/components/Meditation';
import { useKeepAwakeSafe } from '@/hooks/use-keep-awake-safe';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

export default function PracticeScreen() {
  useKeepAwakeSafe();
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

  // If not onboarded, render the Meditation component anyway so Practice works,
  // since Home tab is now the onboarding entry point.
  return (
    <DismissKeyboard>
      <Meditation handler={setOnboarded} onboarded={onboarded} />
    </DismissKeyboard>
  );
}
