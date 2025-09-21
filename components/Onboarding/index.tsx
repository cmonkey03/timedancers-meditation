import Wheel from '@/components/Wheel';
import WheelTower from '@/components/WheelTower';
import { useThemeColors } from '@/hooks/use-theme';
import React from 'react';
import { Pressable, Text } from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';
import ImageWrapper from './ImageWrapper';
import SubtitleWrapper from './SubtitleWrapper';
import TitleWrapper from './TitleWrapper';
import WelcomeImage from './WelcomeImage';
import WelcomeTitle from './WelcomeTitle';

type Props = {
  finishOnboarding: () => void;
};

const MeditationOnboarding = ({ finishOnboarding }: Props) => {
  const C = useThemeColors();
  const NextButton = (props: any) => (
    <Pressable {...props} style={[{ paddingHorizontal: 16, paddingVertical: 8 }, props?.style]}>
      <Text style={{ fontWeight: '600', color: C.text }}>Next</Text>
    </Pressable>
  );

  const instructions = [
    `Sit upright in a chair with your appendages at rest or, if possible, on the ground seated cross-legged on a pillow or folded blanket.`,
    `When you start the timer, spend equal time focusing on each wheel to the exclusion of everything else. The first chime tells you to begin to focus on the Wheel of Power, which is located two fingers below the naval (your belly button).`,
    `The second chime begins your time with the Wheel of Heart, which is located in the center of your chest. Practice allowing yet not attaching to any thoughts, feelings or sensations that arise.`,
    `The third chime is the beginning of your meditation on the Wheel of Widsom, located in the center of your forhead just above the eyebrows. On the last chime, your climb of the Wheel Tower has ended. Finish by bowing your head if you are seated in a chair, or touching your forehead to the ground if you are on the floor.`,
  ];

  return (
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
      imageContainerStyles={{ paddingBottom: 0 }}
      pages={[
        {
          backgroundColor: C.background,
          image: <WelcomeImage />,
          subtitle: 'Hello',
          title: <WelcomeTitle />,
        },
        {
          backgroundColor: C.background,
          image: (
            <ImageWrapper>
              <WheelTower large={false} text1="Power" text2="Heart" text3="Wisdom" />
            </ImageWrapper>
          ),
          title: <TitleWrapper color={C.text} text="We begin by turning the three wheels" />,
          subtitle: <SubtitleWrapper color={C.text} text={instructions[0] || ''} />,
        },
        {
          backgroundColor: C.background,
          image: (
            <ImageWrapper>
              <Wheel backgroundColor={['yellow', 'red']} text={''} />
            </ImageWrapper>
          ),
          title: <TitleWrapper text="Wheel of Power" color={C.text} />,
          subtitle: <SubtitleWrapper text={instructions[1] || ''} color={C.text} />,
        },
        {
          backgroundColor: C.background,
          image: (
            <ImageWrapper>
              <Wheel backgroundColor={['blue', 'green']} text={''} />
            </ImageWrapper>
          ),
          title: <TitleWrapper text="Wheel of Heart" color={C.text} />,
          subtitle: <SubtitleWrapper text={instructions[2] || ''} color={C.text} />,
        },
        {
          backgroundColor: C.background,
          image: (
            <ImageWrapper>
              <Wheel backgroundColor={['purple', 'indigo']} text={''} />
            </ImageWrapper>
          ),
          title: <TitleWrapper text="Wheel of Wisdom" color={C.text} />,
          subtitle: <SubtitleWrapper text={instructions[3] || ''} color={C.text} />,
        },
      ]}
    />
  );
};

export default MeditationOnboarding;
