import Wheel from '@/components/MeditationPage/Wheel';
import AnimatedWheel from './AnimatedWheel';
import { useThemeColors } from '@/hooks/use-theme';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ImageWrapper from './ImageWrapper';
import SubtitleWrapper from './SubtitleWrapper';
import TitleWrapper from './TitleWrapper';
import WelcomeImage from './WelcomeImage';
import WelcomeTitle from './WelcomeTitle';

type Props = {
  finishOnboarding: () => void;
};

const OnboardingPage = ({ finishOnboarding }: Props) => {
  const C = useThemeColors();
  const insets = useSafeAreaInsets();
  
  // Calculate actual content area by subtracting UI elements
  const tabBarHeight = 83; // Standard iOS tab bar height
  const onboardingControlsHeight = 80; // Skip/Next/Done buttons area

  
  // Calculate how much to shift content up to center it in available space
  const contentShift = (tabBarHeight + onboardingControlsHeight) / 1.3;
  const NextButton = (props: any) => (
    <Pressable
      {...props}
      testID="onboarding-next"
      accessibilityLabel="onboarding-next"
      style={[{ paddingHorizontal: 16, paddingVertical: 8 }, props?.style]}
    >
      <Text style={{ fontWeight: '600', color: C.text }}>Next</Text>
    </Pressable>
  );

  const DoneButton = (props: any) => (
    <Pressable
      {...props}
      testID="onboarding-done"
      accessibilityLabel="onboarding-done"
      style={[{ paddingHorizontal: 16, paddingVertical: 8 }, props?.style]}
    >
      <Text style={{ fontWeight: '600', color: C.text }}>Done</Text>
    </Pressable>
  );

  const instructions = [
    `Sit upright in a chair with your appendages at rest or, if possible, on the ground seated cross-legged on a pillow or folded blanket.`,
    `When you start the timer, spend equal time focusing on each wheel to the exclusion of everything else. The first chime tells you to begin to focus on the Wheel of Power, which is located two fingers below the naval (your belly button).`,
    `The second chime begins your time with the Wheel of Heart, which is located in the center of your chest. Practice allowing yet not attaching to any thoughts, feelings or sensations that arise.`,
    `The third chime is the beginning of your meditation on the Wheel of Widsom, located in the center of your forhead just above the eyebrows. On the last chime, your climb of the Wheel Tower has ended. Finish by bowing your head if you are seated in a chair, or touching your forehead to the ground if you are on the floor.`,
  ];

  return (
    <View testID="onboarding" style={{ 
      flex: 1, 
      marginTop: -contentShift,
      paddingTop: Math.max(insets.top, 20)
    }}>
      <Onboarding
        onDone={() => {
          finishOnboarding();
        }}
        onSkip={() => {
          finishOnboarding();
        }}
        showSkip
        showNext
        NextButtonComponent={NextButton}
        DoneButtonComponent={DoneButton}
        imageContainerStyles={{ paddingBottom: 0 }}
        pages={[
        {
          backgroundColor: C.background,
          image: <WelcomeImage />,
          subtitle: 'Begin your journey',
          title: <WelcomeTitle />,
        },
        {
          backgroundColor: C.background,
          image: (
            <ImageWrapper>
              <View style={{ alignItems: 'center', gap: 12 }}>
                <Wheel 
                  size={120}
                  label="Wisdom"
                  remaining={300}
                  total={300}
                  state="idle"
                  colors={['purple', 'indigo']}
                  displayText="Wisdom"
                />
                <Wheel 
                  size={120}
                  label="Heart"
                  remaining={300}
                  total={300}
                  state="idle"
                  colors={['blue', 'green']}
                  displayText="Heart"
                />
                <Wheel 
                  size={120}
                  label="Power"
                  remaining={300}
                  total={300}
                  state="idle"
                  colors={['yellow', 'red']}
                  displayText="Power"
                />
              </View>
            </ImageWrapper>
          ),
          title: <TitleWrapper color={C.text} text="We begin by turning the three wheels" />,
          subtitle: <SubtitleWrapper color={C.text} text={instructions[0] || ''} />,
        },
        {
          backgroundColor: C.background,
          image: (
            <ImageWrapper>
              <AnimatedWheel 
                size={180}
                label="Power"
                startTime={180}
                total={180}
                colors={['yellow', 'red']}
              />
            </ImageWrapper>
          ),
          title: <TitleWrapper text="Wheel of Power" color={C.text} />,
          subtitle: <SubtitleWrapper text={instructions[1] || ''} color={C.text} />,
        },
        {
          backgroundColor: C.background,
          image: (
            <ImageWrapper>
              <AnimatedWheel 
                size={180}
                label="Heart"
                startTime={180}
                total={180}
                colors={['blue', 'green']}
              />
            </ImageWrapper>
          ),
          title: <TitleWrapper text="Wheel of Heart" color={C.text} />,
          subtitle: <SubtitleWrapper text={instructions[2] || ''} color={C.text} />,
        },
        {
          backgroundColor: C.background,
          image: (
            <ImageWrapper>
              <AnimatedWheel 
                size={180}
                label="Wisdom"
                startTime={180}
                total={180}
                colors={['purple', 'indigo']}
              />
            </ImageWrapper>
          ),
          title: <TitleWrapper text="Wheel of Wisdom" color={C.text} />,
          subtitle: <SubtitleWrapper text={instructions[3] || ''} color={C.text} />,
        },
        ]}
      />
    </View>
  );
};

export default OnboardingPage;
