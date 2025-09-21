import MeditationOnboarding from '@/components/MeditationOnboarding';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';

export default function HomeScreen() {
  const router = useRouter();

  const finishOnboarding = useCallback(async () => {
    try {
      await AsyncStorage.setItem(
        'hasOnboarded',
        JSON.stringify({ hasOnboarded: true })
      );
    } catch {}
    router.replace('/(tabs)/meditate');
  }, [router]);

  return <MeditationOnboarding finishOnboarding={finishOnboarding} />;
}
