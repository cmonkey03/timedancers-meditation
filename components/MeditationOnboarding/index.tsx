import React from 'react';
import WheelTower from '@/components/WheelTower';
import Onboarding from 'react-native-onboarding-swiper';
import Wheel from '@/components/Wheel';
import WelcomeTitle from './WelcomeTitle';
import WelcomeImage from './WelcomeImage';
import ImageWrapper from './ImageWrapper';
import SubtitleWrapper from './SubtitleWrapper';
import TitleWrapper from './TitleWrapper';
import { Pressable, Text } from 'react-native';

type Props = {
  finishOnboarding: () => void;
};

const MeditationOnboarding = ({ finishOnboarding }: Props) => {
  const NextButton = (props: any) => (
    <Pressable {...props} style={[{ paddingHorizontal: 16, paddingVertical: 8 }, props?.style]}
    >
      <Text style={{ fontWeight: '600', color: '#1a5632' }}>Next</Text>
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
          backgroundColor: '#fff',
          image: <WelcomeImage />,
          subtitle: 'Hello',
          title: <WelcomeTitle />,
        },
        {
          backgroundColor: '#fff',
          image: (
            <ImageWrapper>
              <WheelTower large={false} text1="Power" text2="Heart" text3="Wisdom" />
            </ImageWrapper>
          ),
          title: <TitleWrapper color="#1a5632" text="We begin by turning the three wheels" />,
          subtitle: <SubtitleWrapper color="#1a5632" text={instructions[0] || ''} />,
        },
        {
          backgroundColor: 'red',
          image: (
            <ImageWrapper>
              <Wheel color="#1a5632" backgroundColor={['yellow', 'red']} text={''} />
            </ImageWrapper>
          ),
          title: <TitleWrapper text="Wheel of Power" />,
          subtitle: <SubtitleWrapper text={instructions[1] || ''} />,
        },
        {
          backgroundColor: 'blue',
          image: (
            <ImageWrapper>
              <Wheel color="white" backgroundColor={['blue', 'green']} text={''} />
            </ImageWrapper>
          ),
          title: <TitleWrapper text="Wheel of Heart" color="white" />,
          subtitle: <SubtitleWrapper text={instructions[2] || ''} color="white" />,
        },
        {
          backgroundColor: 'purple',
          image: (
            <ImageWrapper>
              <Wheel color="white" backgroundColor={['purple', 'indigo']} text={''} />
            </ImageWrapper>
          ),
          title: <TitleWrapper text="Wheel of Wisdom" color="white" />,
          subtitle: <SubtitleWrapper text={instructions[3] || ''} color="white" />,
        },
      ]}
    />
  );
};

export default MeditationOnboarding;
