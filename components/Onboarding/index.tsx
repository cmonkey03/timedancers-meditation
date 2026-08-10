import Wheel from '@/components/Session/Wheel';
import { onboardingData } from '@/data/onboarding';
import { useCustomFonts } from '@/hooks/use-fonts';
import { useThemeColors } from '@/hooks/use-theme';
import { setOnboardingCompleted } from '@/utils/settings';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import OnboardingSwiper from 'react-native-onboarding-swiper';
import AnimatedBounceArrow from './AnimatedBounceArrow';
import AnimatedWelcomeText from './AnimatedWelcomeText';
import AnimatedWheel from './AnimatedWheel';
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
  const { fontsLoaded, fonts } = useCustomFonts();
  const SkipButton = (props: any) => (
    <Pressable
      {...props}
      testID="onboarding-skip"
      accessibilityLabel={onboardingData.buttons.skip}
      accessibilityRole="button"
      accessibilityHint={onboardingData.accessibility.skipTutorial}
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
      }}>{onboardingData.buttons.skip}</Text>
    </Pressable>
  );

  const NextButton = (props: any) => (
    <Pressable
      {...props}
      testID="onboarding-next"
      accessibilityLabel={onboardingData.buttons.next}
      accessibilityRole="button"
      accessibilityHint={onboardingData.accessibility.nextScreen}
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
      }}>{onboardingData.buttons.next}</Text>
    </Pressable>
  );

  const DoneButton = (props: any) => (
    <Pressable
      {...props}
      testID="onboarding-done"
      accessibilityLabel={onboardingData.buttons.begin}
      accessibilityRole="button"
      accessibilityHint={onboardingData.accessibility.completeOnboarding}
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
      }}>{onboardingData.buttons.begin}</Text>
    </Pressable>
  );


  return (
    <View testID="onboarding" style={{
      flex: 1
    }} accessibilityLabel={onboardingData.accessibility.onboardingTutorial} accessibilityRole="none">
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
                <Wheel 
                  size={120}
                  label={onboardingData.wheelLabels.wisdom}
                  remaining={300}
                  total={300}
                  state="idle"
                  colors={['purple', 'indigo']}
                  displayText={onboardingData.wheelLabels.wisdom}
                />
                <Wheel 
                  size={120}
                  label={onboardingData.wheelLabels.heart}
                  remaining={300}
                  total={300}
                  state="idle"
                  colors={['blue', 'green']}
                  displayText={onboardingData.wheelLabels.heart}
                />
                <Wheel 
                  size={120}
                  label={onboardingData.wheelLabels.power}
                  remaining={300}
                  total={300}
                  state="idle"
                  colors={['yellow', 'red']}
                  displayText={onboardingData.wheelLabels.power}
                />
              </View>
            </ImageWrapper>
          ),
          title: <TitleWrapper color={C.text} text={onboardingData.pages[1].title} />,
          subtitle: <SubtitleWrapper color={C.text} text={onboardingData.instructions[0] || ''} />,
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
              }}>{onboardingData.preview}</Text>
              <AnimatedWheel 
                size={180}
                label={onboardingData.wheelLabels.power}
                startTime={180}
                total={180}
                colors={['yellow', 'red']}
              />
            </ImageWrapper>
          ),
          title: <TitleWrapper text={onboardingData.pages[2].title} color={C.text} />,
          subtitle: <SubtitleWrapper text={onboardingData.instructions[1] || ''} color={C.text} />,
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
              }}>{onboardingData.preview}</Text>
              <AnimatedWheel 
                size={180}
                label={onboardingData.wheelLabels.heart}
                startTime={180}
                total={180}
                colors={['blue', 'green']}
              />
            </ImageWrapper>
          ),
          title: <TitleWrapper text={onboardingData.pages[3].title} color={C.text} />,
          subtitle: <SubtitleWrapper text={onboardingData.instructions[2] || ''} color={C.text} />,
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
              }}>{onboardingData.preview}</Text>
              <AnimatedWheel 
                size={180}
                label={onboardingData.wheelLabels.wisdom}
                startTime={180}
                total={180}
                colors={['purple', 'indigo']}
              />
            </ImageWrapper>
          ),
          title: <TitleWrapper text={onboardingData.pages[4].title} color={C.text} />,
          subtitle: <SubtitleWrapper text={onboardingData.instructions[3] || ''} color={C.text} />,
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
          title: <TitleWrapper text={onboardingData.pages[5].title} color={C.text} />,
          subtitle: (
            <SubtitleWrapper
              text={onboardingData.pages[5].subtitle}
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
