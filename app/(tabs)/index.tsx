import OnboardingPage from '@/components/OnboardingPage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TabActions, useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';

export default function HomeScreen() {
  const navigation = useNavigation();

  const finishOnboarding = useCallback(async () => {
    try {
      await AsyncStorage.setItem(
        'hasOnboarded',
        JSON.stringify({ hasOnboarded: true })
      );
    } catch {}
    navigation.dispatch(TabActions.jumpTo('meditate'));
  }, [navigation]);

  return <OnboardingPage finishOnboarding={finishOnboarding} />;
}
