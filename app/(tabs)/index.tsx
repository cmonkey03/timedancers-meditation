import OnboardingPage from '@/components/OnboardingPage';
import { TabActions, useNavigation, useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';

export default function HomeScreen() {
  const navigation = useNavigation();
  const [key, setKey] = useState(0);

  const finishOnboarding = useCallback(async () => {
    navigation.dispatch(TabActions.jumpTo('meditate'));
  }, [navigation]);

  // Re-mount onboarding component when this screen loses focus (blur event)
  useFocusEffect(
    useCallback(() => {
      // Return cleanup function that runs when screen loses focus
      return () => {
        setKey(prev => prev + 1);
      };
    }, [])
  );

  return <OnboardingPage key={key} finishOnboarding={finishOnboarding} />;
}
