import OnboardingPage from '@/components/OnboardingPage';
import { useRouter, useFocusEffect } from 'expo-router';
import { useCallback, useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { useThemeColors } from '@/hooks/use-theme';

export default function HomeScreen() {
  const router = useRouter();
  const [key, setKey] = useState(0);
  const [skipOnboarding] = useState(() => process.env.NODE_ENV === 'test');
  const C = useThemeColors();

  const finishOnboarding = useCallback(async () => {
    router.push('/meditate');
  }, [router]);

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

  // Show simple loading screen in E2E mode
  if (skipOnboarding) {
    return (
      <View style={{ 
        flex: 1, 
        backgroundColor: C.background, 
        justifyContent: 'center', 
        alignItems: 'center' 
      }} testID="e2e-loading">
        <Text style={{ color: C.text, fontSize: 16 }}>Loading...</Text>
      </View>
    );
  }

  return <OnboardingPage key={key} finishOnboarding={finishOnboarding} />;
}
