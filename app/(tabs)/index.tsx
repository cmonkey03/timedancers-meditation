import OnboardingPage from '@/components/OnboardingPage';
import { useRouter, useFocusEffect } from 'expo-router';
import { useCallback, useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { useThemeColors } from '@/hooks/use-theme';
import { uiText } from '@/data/ui-text';
import { hasCompletedOnboarding } from '@/utils/settings';

export default function HomeScreen() {
  const router = useRouter();
  const [key, setKey] = useState(0);
  const [skipOnboarding] = useState(() => process.env.NODE_ENV === 'test');
  const [isLoading, setIsLoading] = useState(true);
  const C = useThemeColors();

  const finishOnboarding = useCallback(async () => {
    router.push('/meditate');
  }, [router]);

  // Check if onboarding has been completed
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (skipOnboarding) {
        setIsLoading(false);
        return;
      }

      const completed = await hasCompletedOnboarding();
      setIsLoading(false);

      if (completed) {
        router.push('/meditate');
      }
    };

    checkOnboardingStatus();
  }, [skipOnboarding, router]);

  // Auto-navigate to meditate in test mode
  useEffect(() => {
    if (skipOnboarding) {
      const timeout = setTimeout(() => {
        console.log('Auto-navigating to meditate screen');
        router.push('/meditate');
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [skipOnboarding, router]);

  // Re-mount onboarding component when this screen loses focus (blur event)
  useFocusEffect(
    useCallback(() => {
      // Return cleanup function that runs when screen loses focus
      return () => {
        // Delay the reset so it happens after navigation is complete
        setTimeout(() => {
          setKey(prev => prev + 1);
        }, 300); // 300ms delay to avoid flash during transition
      };
    }, [])
  );

  // Show loading screen while checking onboarding status
  if (isLoading) {
    return (
      <View style={{
        flex: 1,
        backgroundColor: C.background,
        justifyContent: 'center',
        alignItems: 'center'
      }} testID="loading">
        <Text style={{ color: C.text, fontSize: 16 }}>{uiText.common.loading}</Text>
      </View>
    );
  }

  // Show simple loading screen in E2E mode
  if (skipOnboarding) {
    return (
      <View style={{
        flex: 1,
        backgroundColor: C.background,
        justifyContent: 'center',
        alignItems: 'center'
      }} testID="e2e-loading">
        <Text style={{ color: C.text, fontSize: 16 }}>{uiText.common.loading}</Text>
      </View>
    );
  }

  // Show onboarding if not completed
  return <OnboardingPage key={key} finishOnboarding={finishOnboarding} />;
}
