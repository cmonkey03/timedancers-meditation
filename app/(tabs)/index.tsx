import OnboardingPage from '@/components/OnboardingPage';
import { TabActions, useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';

export default function HomeScreen() {
  const navigation = useNavigation();

  const finishOnboarding = useCallback(async () => {
    navigation.dispatch(TabActions.jumpTo('meditate'));
  }, [navigation]);

  return <OnboardingPage finishOnboarding={finishOnboarding} />;
}
