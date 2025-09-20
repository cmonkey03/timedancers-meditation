import Button from '@/components/Button';
import WheelControls from '@/components/WheelControls';
import WheelTower from '@/components/WheelTower';
import { useKeepAwakeSafe } from '@/hooks/use-keep-awake-safe';
import displayTime from '@/utils/displayTime';
import { setAudioModeAsync, useAudioPlayer } from 'expo-audio';
import { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';

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

  // expo-audio players for chimes
  const chime1 = useAudioPlayer(require('@/assets/sounds/chime1.mp3'));
  const chime2 = useAudioPlayer(require('@/assets/sounds/chime2.mp3'));

  // Configure audio once (silent mode, etc.)
  useEffect(() => {
    (async () => {
      try {
        await setAudioModeAsync({ playsInSilentMode: true });
      } catch {
        // ignore
      }
    })();
  }, []);

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

  const playPreloadedChime = useCallback(async (which: 1 | 2) => {
    try {
      const p = which === 1 ? chime1 : chime2;
      if (!p) return;
      // expo-audio does not auto-reset to start after ending
      await p.seekTo(0);
      await p.play();
    } catch {}
  }, [chime1, chime2]);

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
      if (chime1 && chime2) {
        setStarted(true);

        interval = setInterval(() => {
          switch (true) {
            case timer1 === subSeconds:
              playPreloadedChime(1);
              setTimer1(timer1 - 1);
              break;
            case 0 < timer1:
              setTimer1(timer1 - 1);
              break;
            case timer2 === subSeconds:
              playPreloadedChime(1);
              setTimer2(timer2 - 1);
              break;
            case 0 < timer2:
              setTimer2(timer2 - 1);
              break;
            case timer3 === subSeconds:
              playPreloadedChime(1);
              setTimer3(timer3 - 1);
              break;
            case 0 < timer3:
              setTimer3(timer3 - 1);
              break;
            default:
              clearInterval(interval);
              setCounting(false);
              setStarted(false);
              playPreloadedChime(2);
              break;
          }
        }, 1000);
      }
    }

    return () => clearInterval(interval);
  }, [counting, subSeconds, timer1, timer2, timer3, playPreloadedChime, chime1, chime2]);

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
