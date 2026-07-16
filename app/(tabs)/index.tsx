import OnboardingPage from '@/components/OnboardingPage';
import { useRouter, useFocusEffect } from 'expo-router';
import { useCallback, useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { useThemeColors } from '@/hooks/use-theme';

export default function HomeScreen() {
  const router = useRouter();
  const [key, setKey] = useState(0);
  const [skipOnboarding, setSkipOnboarding] = useState(false);
  const C = useThemeColors();

  const finishOnboarding = useCallback(async () => {
    router.push('/meditate');
  }, [router]);

  // Check if we should skip onboarding (for E2E tests)
  useEffect(() => {
    // Skip onboarding for development and testing
    // Check multiple indicators to ensure it works in all environments
    const shouldSkipOnboarding = __DEV__ || 
      process.env.NODE_ENV === 'development' ||
      process.env.NODE_ENV === 'test' ||
      // Always skip in any non-production environment
      process.env.NODE_ENV !== 'production';
    
    console.log('Onboarding Skip Check:', {
      __DEV__,
      nodeEnv: process.env.NODE_ENV,
      shouldSkipOnboarding
    });
    
    if (shouldSkipOnboarding) {
      console.log('Development/test mode detected, skipping onboarding');
      setSkipOnboarding(true);
      // Auto-navigate to meditate after a short delay
      setTimeout(() => {
        console.log('Auto-navigating to meditate screen');
        router.push('/meditate');
      }, 1000);
    }
  }, [router]);

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
