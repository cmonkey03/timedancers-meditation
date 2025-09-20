import { View } from 'react-native';
import { useEffect, useState } from 'react';
import { Audio, AVPlaybackNativeSource } from 'expo-av';
import { useAssets } from 'expo-asset';
import { useKeepAwakeSafe } from '@/hooks/use-keep-awake-safe';
import WheelTower from '@/components/WheelTower';
import WheelControls from '@/components/WheelControls';
import displayTime from '@/utils/displayTime';
import Button from '@/components/Button';

type Props = {
  handler: React.Dispatch<React.SetStateAction<any>>;
  onboarded: boolean;
};

const Meditation = ({ handler, onboarded }: Props) => {
  useKeepAwakeSafe();
  const [input, setInput] = useState('3');
  const [counting, setCounting] = useState(false);
  const [started, setStarted] = useState(false);
  const [subSeconds, setSubSeconds] = useState(20);
  const [timer1, setTimer1] = useState(60);
  const [timer2, setTimer2] = useState(60);
  const [timer3, setTimer3] = useState(60);
  const [sound, setSound] = useState<Audio.Sound | null>();
  const [chimes] = useAssets([
    require('@/assets/sounds/chime1.mp3'),
    require('@/assets/sounds/chime2.mp3'),
  ]);

  const handleInput = (text: string) => {
    if (typeof text === 'string' && !Number.isNaN(Number(text))) {
      setInput(text);
    }
  };

  useEffect(() => {
    if (!started) {
      const minutes = parseInt(input) || 0;
      const seconds: number = minutes * 60;
      setSubSeconds(seconds / 3);

      setTimer1(seconds / 3);
      setTimer2(seconds / 3);
      setTimer3(seconds / 3);
    }
  }, [input, started]);

  const onPress = (action: string) => {
    switch (action) {
      case 'counting':
        setCounting(true);
        break;
      case 'cancel':
        setCounting(false);
        setStarted(false);
        break;
      case 'pause':
        setCounting(false);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    let interval: any;

    if (counting) {
      if (chimes && chimes[0] && chimes[1]) {
        const chime1 = chimes[0] as AVPlaybackNativeSource;
        const chime2 = chimes[1] as AVPlaybackNativeSource;
        setStarted(true);

        interval = setInterval(() => {
          switch (true) {
            case timer1 === subSeconds:
              playChime(chime1);
              setTimer1(timer1 - 1);
              break;
            case 0 < timer1:
              setTimer1(timer1 - 1);
              break;
            case timer2 === subSeconds:
              playChime(chime1);
              setTimer2(timer2 - 1);
              break;
            case 0 < timer2:
              setTimer2(timer2 - 1);
              break;
            case timer3 === subSeconds:
              playChime(chime1);
              setTimer3(timer3 - 1);
              break;
            case 0 < timer3:
              setTimer3(timer3 - 1);
              break;
            default:
              clearInterval(interval);
              setCounting(false);
              setStarted(false);
              playChime(chime2);
              break;
          }
        }, 1000);
      }
    }

    return () => clearInterval(interval);
  }, [chimes, counting, subSeconds, timer1, timer2, timer3]);

  const playChime = async (chime: AVPlaybackNativeSource) => {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
    });

    const { sound } = await Audio.Sound.createAsync(chime);
    setSound(sound);

    await sound.playAsync();
  };

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  return (
    <View
      style={{
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#fff',
      }}
    >
      <WheelTower
        large={true}
        text1={displayTime(timer1)}
        text2={displayTime(timer2)}
        text3={displayTime(timer3)}
      />
      <WheelControls
        counting={counting}
        handleInput={handleInput}
        input={input}
        onPress={onPress}
        started={started}
      />
      <View style={{ height: 64 }} />
      <Button
        backgroundColor="#e4ede7"
        onPress={() => handler(!onboarded)}
        text="Instructions"
      />
    </View>
  );
};

export default Meditation;
