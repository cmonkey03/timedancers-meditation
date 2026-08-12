import Onboarding from '@/components/Onboarding';
import { useI18n } from '@/contexts/I18nContext';
import { useThemeColors } from '@/hooks/ui/use-theme';
import { settingsService } from '@/services/settings';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Text, View } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();
  const [key, setKey] = useState(0);
  const [skipOnboarding] = useState(() => process.env.NODE_ENV === 'test');
  const [isLoading, setIsLoading] = useState(true);
  const C = useThemeColors();
  const { t } = useI18n();

  const finishOnboarding = useCallback(async () => {
    router.push('/session');
  }, [router]);

  // Check if onboarding has been completed
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (skipOnboarding) {
        setIsLoading(false);
        return;
      }

      const completed = await settingsService.hasCompletedOnboarding();
      setIsLoading(false);

      if (completed) {
        router.push('/session');
      }
    };

    checkOnboardingStatus();
  }, [skipOnboarding, router]);

  // Auto-navigate to session in test mode
  useEffect(() => {
    if (skipOnboarding) {
      const timeout = setTimeout(() => {
        console.log('Auto-navigating to session screen');
        router.push('/session');
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
        <Text style={{ color: C.text, fontSize: 16 }}>{t('common.loading')}</Text>
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
        <Text style={{ color: C.text, fontSize: 16 }}>{t('common.loading')}</Text>
      </View>
    );
  }

  // Show onboarding if not completed
  return <Onboarding key={key} finishOnboarding={finishOnboarding} />;
}
