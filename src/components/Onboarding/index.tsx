import Ring from '@/components/Session/Ring';
import { useI18n } from '@/contexts/I18nContext';
import { useCustomFonts } from '@/hooks/ui/use-fonts';
import { useThemeColors } from '@/hooks/ui/use-theme';
import { setOnboardingCompleted } from '@/utils/settings';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import OnboardingSwiper from 'react-native-onboarding-swiper';
import AnimatedBounceArrow from './AnimatedBounceArrow';
import AnimatedRing from './AnimatedRing';
import AnimatedWelcomeText from './AnimatedWelcomeText';
import ImageWrapper from './ImageWrapper';
import SubtitleWrapper from './SubtitleWrapper';
import SwipeIndicator from './SwipeIndicator';
import TitleWrapper from './TitleWrapper';
import WelcomeImage from './WelcomeImage';

type Props = {
  finishOnboarding: () => void;
};

const Onboarding = ({ finishOnboarding }: Props) => {
  const C = useThemeColors();
  const { t } = useI18n();
  const { fontsLoaded, fonts } = useCustomFonts();
  const SkipButton = (props: any) => (
    <Pressable
      {...props}
      testID="onboarding-skip"
      accessibilityLabel={t('onboarding.buttons.skip')}
      accessibilityRole="button"
      accessibilityHint={t('onboarding.accessibility.skipTutorial')}
      style={[
        {
          paddingHorizontal: 20,
          paddingVertical: 12,
          borderRadius: 20,
          backgroundColor: 'transparent',
          borderWidth: 0,
          marginHorizontal: 8,
          marginVertical: 4,
        },
        props?.style
      ]}
    >
      <Text style={{ 
        fontWeight: '600', 
        color: C.text, 
        fontSize: 15,
        opacity: 0.6,
        letterSpacing: 0.3,
      }}>{t('onboarding.buttons.skip')}</Text>
    </Pressable>
  );

  const NextButton = (props: any) => (
    <Pressable
      {...props}
      testID="onboarding-next"
      accessibilityLabel={t('onboarding.buttons.next')}
      accessibilityRole="button"
      accessibilityHint={t('onboarding.accessibility.nextScreen')}
      style={[
        {
          paddingHorizontal: 20,
          paddingVertical: 12,
          borderRadius: 20,
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: `${C.text}30`, // 19% opacity for subtle border
          marginHorizontal: 8,
          marginVertical: 4,
        },
        props?.style
      ]}
    >
      <Text style={{ 
        fontWeight: '600', 
        color: C.text, 
        fontSize: 15,
        letterSpacing: 0.3,
      }}>{t('onboarding.buttons.next')}</Text>
    </Pressable>
  );

  const DoneButton = (props: any) => (
    <Pressable
      {...props}
      testID="onboarding-done"
      accessibilityLabel={t('onboarding.buttons.begin')}
      accessibilityRole="button"
      accessibilityHint={t('onboarding.accessibility.completeOnboarding')}
      style={[
        {
          paddingHorizontal: 24,
          paddingVertical: 12,
          borderRadius: 20,
          backgroundColor: C.buttonPrimary,
          borderWidth: 0,
          shadowColor: C.buttonPrimary,
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.3,
          shadowRadius: 6,
          elevation: 4,
          marginHorizontal: 8,
          marginVertical: 4,
        },
        props?.style
      ]}
    >
      <Text style={{ 
        fontWeight: '600', 
        color: C.buttonPrimaryText, 
        fontSize: 15,
        letterSpacing: 0.3,
      }}>{t('onboarding.buttons.begin')}</Text>
    </Pressable>
  );


  return (
    <View testID="onboarding" style={{
      flex: 1
    }} accessibilityLabel={t('onboarding.accessibility.onboardingTutorial')} accessibilityRole="none">
      <OnboardingSwiper
        onDone={async () => {
          await setOnboardingCompleted();
          finishOnboarding();
        }}
        onSkip={async () => {
          await setOnboardingCompleted();
          finishOnboarding();
        }}
        showSkip
        showNext
        SkipButtonComponent={SkipButton}
        NextButtonComponent={NextButton}
        DoneButtonComponent={DoneButton}
        containerStyles={{
          paddingBottom: 140, 
          justifyContent: 'center',
        }}
        imageContainerStyles={{
          paddingBottom: 8,
          marginBottom: 8,
        }}        
        pages={[
        {
          backgroundColor: C.background,
          image: (
            <ImageWrapper>
              <WelcomeImage />
              <AnimatedWelcomeText />
            </ImageWrapper>
          ),
          subtitle: <SwipeIndicator />,
          title: '',
        },
        {
          backgroundColor: C.background,
          image: (
            <ImageWrapper>
              <View style={{ alignItems: 'center', gap: 14 }}>
                <Ring 
                  size={120}
                  label={t('onboarding.ringLabels.wisdom')}
                  remaining={300}
                  total={300}
                  state="idle"
                  colors={['purple', 'indigo']}
                  displayText={t('onboarding.ringLabels.wisdom')}
                />
                <Ring 
                  size={120}
                  label={t('onboarding.ringLabels.heart')}
                  remaining={300}
                  total={300}
                  state="idle"
                  colors={['blue', 'green']}
                  displayText={t('onboarding.ringLabels.heart')}
                />
                <Ring 
                  size={120}
                  label={t('onboarding.ringLabels.power')}
                  remaining={300}
                  total={300}
                  state="idle"
                  colors={['yellow', 'red']}
                  displayText={t('onboarding.ringLabels.power')}
                />
              </View>
            </ImageWrapper>
          ),
          title: <TitleWrapper color={C.text} text={t('onboarding.pages.1.title')} />,
          subtitle: <SubtitleWrapper color={C.text} text={t('onboarding.instructions.0')} />,
        },
        {
          backgroundColor: C.background,
          image: (
            <ImageWrapper>
              <Text style={{
                color: `${C.text}66`,
                fontSize: 13,
                fontFamily: fontsLoaded ? fonts.inter.medium : undefined,
                fontWeight: fontsLoaded ? undefined : '500',
                letterSpacing: 1.5,
                textTransform: 'uppercase',
                marginBottom: 40,
              }}>{t('onboarding.preview')}</Text>
              <AnimatedRing 
                size={180}
                label={t('onboarding.ringLabels.power')}
                startTime={180}
                total={180}
                colors={['yellow', 'red']}
              />
            </ImageWrapper>
          ),
          title: <TitleWrapper text={t('onboarding.pages.2.title')} color={C.text} />,
          subtitle: <SubtitleWrapper text={t('onboarding.instructions.1')} color={C.text} />,
        },
        {
          backgroundColor: C.background,
          image: (
            <ImageWrapper>
              <Text style={{
                color: `${C.text}66`,
                fontSize: 13,
                fontFamily: fontsLoaded ? fonts.inter.medium : undefined,
                fontWeight: fontsLoaded ? undefined : '500',
                letterSpacing: 1.5,
                textTransform: 'uppercase',
                marginBottom: 40,
              }}>{t('onboarding.preview')}</Text>
              <AnimatedRing 
                size={180}
                label={t('onboarding.ringLabels.heart')}
                startTime={180}
                total={180}
                colors={['blue', 'green']}
              />
            </ImageWrapper>
          ),
          title: <TitleWrapper text={t('onboarding.pages.3.title')} color={C.text} />,
          subtitle: <SubtitleWrapper text={t('onboarding.instructions.2')} color={C.text} />,
        },
        {
          backgroundColor: C.background,
          image: (
            <ImageWrapper>
              <Text style={{
                color: `${C.text}66`,
                fontSize: 13,
                fontFamily: fontsLoaded ? fonts.inter.medium : undefined,
                fontWeight: fontsLoaded ? undefined : '500',
                letterSpacing: 1.5,
                textTransform: 'uppercase',
                marginBottom: 40,
              }}>{t('onboarding.preview')}</Text>
              <AnimatedRing 
                size={180}
                label={t('onboarding.ringLabels.wisdom')}
                startTime={180}
                total={180}
                colors={['purple', 'indigo']}
              />
            </ImageWrapper>
          ),
          title: <TitleWrapper text={t('onboarding.pages.4.title')} color={C.text} />,
          subtitle: <SubtitleWrapper text={t('onboarding.instructions.3')} color={C.text} />,
        },
        {
          backgroundColor: C.background,
          image: (
            <ImageWrapper>
              <View style={{ alignItems: 'center', gap: 12 }}>
                <View
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 40,
                    backgroundColor: `${C.primary}20`,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Ionicons name="aperture" size={44} color={C.primary} />
                </View>
                <AnimatedBounceArrow color={C.text} />
              </View>
            </ImageWrapper>
          ),
          title: <TitleWrapper text={t('onboarding.pages.5.title')} color={C.text} />,
          subtitle: (
            <SubtitleWrapper
              text={t('onboarding.pages.5.subtitle')}
              color={C.text}
            />
          ),
        },
        ]}
      />
    </View>
  );
};

export default Onboarding;
