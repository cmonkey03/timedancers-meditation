import OnboardingPage from '@/components/OnboardingPage';
import { TabActions, useNavigation, useFocusEffect } from '@react-navigation/native';
import { useCallback, useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { useThemeColors } from '@/hooks/use-theme';

export default function HomeScreen() {
  const navigation = useNavigation();
  const [key, setKey] = useState(0);
  const [skipOnboarding, setSkipOnboarding] = useState(false);
  const C = useThemeColors();

  const finishOnboarding = useCallback(async () => {
    navigation.dispatch(TabActions.jumpTo('meditate'));
  }, [navigation]);

  // Check if we should skip onboarding (for E2E tests)
  useEffect(() => {
    // Skip onboarding if we detect E2E test environment
    const isE2E = __DEV__ && (
      (global as any).__E2E__ || 
      process.env.NODE_ENV === 'test' ||
      (global as any).detox
    );
    
    if (isE2E) {
      console.log('E2E mode detected, skipping onboarding');
      setSkipOnboarding(true);
      // Auto-navigate to meditate after a short delay
      setTimeout(() => {
        navigation.dispatch(TabActions.jumpTo('meditate'));
      }, 1000);
    }
  }, [navigation]);

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
