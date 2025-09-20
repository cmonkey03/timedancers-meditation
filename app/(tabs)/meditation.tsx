import DismissKeyboard from '@/components/DismissKeyboard';
import Meditation from '@/components/Meditation';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useKeepAwake } from 'expo-keep-awake';
import MeditationOnboarding from '@/components/MeditationOnboarding';

export default function MeditationTabScreen() {
  useKeepAwake();
  const [onboarded, setOnboarded] = useState(false);

  const finishOnboarding = async (): Promise<void> => {
    await AsyncStorage.setItem(
      'hasOnboarded',
      JSON.stringify({
        hasOnboarded: true,
      })
    );
    setOnboarded(true);
  };

  useEffect(() => {
    const checkStorage = async () => {
      try {
        const storage = await AsyncStorage.getItem('hasOnboarded');

        if (null !== storage) {
          const parsedStorage = JSON.parse(storage);

          if (parsedStorage.hasOnboarded) {
            setOnboarded(true);
          }
        }
      } catch (e) {
        // ignore
      }
    };

    checkStorage();
  }, []);

  return onboarded ? (
    <DismissKeyboard>
      <Meditation handler={setOnboarded} onboarded={onboarded} />
    </DismissKeyboard>
  ) : (
    <MeditationOnboarding finishOnboarding={finishOnboarding} />
  );
}
