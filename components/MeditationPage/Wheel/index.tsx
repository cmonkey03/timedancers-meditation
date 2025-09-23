import React, { useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeColors } from '@/hooks/use-theme';
import Svg, { Defs, LinearGradient as SvgLinearGradient, Stop, Circle } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  useDerivedValue,
  withTiming,
  withRepeat,
  withDelay,
  withSequence,
  Easing,
  interpolate,
} from "react-native-reanimated";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type WheelState = "idle" | "active" | "releasing" | "done";

// Meditation wheel props
interface MeditationWheelProps {
  size?: number;
  label: string;
  remaining: number;
  total: number;
  state: WheelState;
  colors: [string, string];
}

// Simple wheel props (for onboarding/tower)
interface SimpleWheelProps {
  color?: string;
  backgroundColor: string[];
  text: string;
}

type Props = MeditationWheelProps | SimpleWheelProps;

const Wheel = (props: Props) => {
  const C = useThemeColors();
  
  // Determine if this is simple or meditation wheel
  const isSimple = 'backgroundColor' in props;
  
  // Always call hooks at the top level - use conditional logic inside
  const progress = useSharedValue(0);
  const breath = useSharedValue(0);
  const spin = useSharedValue(0);
  const glow = useSharedValue(0);
  
  // Extract props based on type
  const simpleProps = isSimple ? props as SimpleWheelProps : null;
  const meditationProps = !isSimple ? props as MeditationWheelProps : {
    size: 180,
    label: '',
    remaining: 0,
    total: 1,
    state: 'idle' as WheelState,
    colors: ['#000', '#000'] as [string, string]
  };

  const {
    size = 180,
    label,
    remaining,
    total,
    state,
    colors,
  } = meditationProps;

  const stroke = 10;
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;

  // Progress from 1 → 0 with smooth animation
  const targetProgress = Math.max(0, Math.min(1, remaining / Math.max(1, total)));
  
  // Animate progress smoothly when it changes (only for meditation wheels)
  React.useEffect(() => {
    if (!isSimple) {
      progress.value = withTiming(targetProgress, {
        duration: 500,
        easing: Easing.out(Easing.cubic),
      });
    }
  }, [targetProgress, progress, isSimple]);

  // Breathing animation for active wheel and gentle pulse for starting wheel
  React.useEffect(() => {
    if (!isSimple) {
      if (state === "active") {
        // continuous breathing for active wheel
        breath.value = withRepeat(
          withSequence(
            withTiming(1, { duration: 1400, easing: Easing.inOut(Easing.ease) }),
            withTiming(0, { duration: 1400, easing: Easing.inOut(Easing.ease) })
          ),
          -1,
          true
        );
      } else if (state === "idle" && label.toLowerCase() === "power") {
        // gentle pulse for the starting wheel (power) when idle - makes app feel alive
        breath.value = withRepeat(
          withSequence(
            withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
            withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.ease) })
          ),
          -1,
          true
        );
      } else {
        // no breathing for other idle/done wheels
        breath.value = withTiming(0, { duration: 300 });
      }
    }
  }, [state, label, breath, isSimple]);

  // Release animation (one spin + glow)
  React.useEffect(() => {
    if (!isSimple && state === "releasing") {
      spin.value = withSequence(
        withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) }),
        withTiming(0, { duration: 0 }) // reset
      );
      glow.value = withSequence(
        withTiming(1, { duration: 300, easing: Easing.out(Easing.cubic) }),
        withDelay(150, withTiming(0, { duration: 500 }))
      );
    }
  }, [state, spin, glow, isSimple]);

  const aProps = useAnimatedProps(() => {
    if (isSimple) return { strokeDashoffset: 0 };
    // progress ring dashoffset - smooth animation
    const dash = circumference * progress.value;
    return { strokeDashoffset: dash };
  });

  const breathScale = useDerivedValue(() => {
    if (isSimple) return 1;
    if (state === "active") {
      return 1 + interpolate(breath.value, [0, 1], [0, 0.05]); // 5% breathing for active
    } else if (state === "idle" && label.toLowerCase() === "power") {
      return 1 + interpolate(breath.value, [0, 1], [0, 0.02]); // 2% gentle pulse for power when idle
    } else {
      return 1; // no animation for other wheels
    }
  });

  const spinDeg = useDerivedValue(() => isSimple ? "0deg" : `${spin.value * 360}deg`);
  const glowOpacity = useDerivedValue(() => isSimple ? 0 : glow.value);

  // Time mm:ss
  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(Math.floor(remaining % 60)).padStart(2, "0");

  const [c0, c1] = colors || ["#000", "#000"];
  const gid = useMemo(() => `g-${label}-${c0}-${c1}` .replace(/\W/g, ""), [label, c0, c1]);

  // Early return for simple wheels
  if (isSimple && simpleProps) {
    const { color, backgroundColor, text } = simpleProps;
    const textColor = color ?? C.text;
    return (
      <LinearGradient
        style={{
          alignItems: 'center',
          borderRadius: 50,
          height: 100,
          justifyContent: 'center',
          width: 100,
        }}
        colors={backgroundColor as any}
      >
        <Text style={{ color: textColor, fontWeight: '600' }}>{text}</Text>
      </LinearGradient>
    );
  }

  const dimmed = state === "idle" || state === "done";

  return (
    <View style={{ alignItems: "center" }}>
      <Animated.View
        style={[
          styles.wheelWrap,
          {
            width: size,
            height: size,
            transform: [
              { scale: breathScale as any },
              state === "releasing" ? ({ rotate: spinDeg } as any) : ({ rotate: "0deg" } as any),
            ],
            opacity: dimmed ? 0.9 : 1,
          },
        ]}
        accessibilityLabel={`${label} ${mm}:${ss} remaining`}
        accessibilityRole="timer"
      >
        {/* soft glow */}
        <Animated.View
          style={[
            {
              position: "absolute",
              width: size + 36,
              height: size + 36,
              borderRadius: (size + 36) / 2,
              backgroundColor: c0,
              opacity: state === "active" ? 0.07 : glowOpacity as any,
              top: -18,
              left: -18,
            },
          ]}
        />

        <Svg width={size} height={size}>
          <Defs>
            <SvgLinearGradient id={gid} x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={c0} />
              <Stop offset="100%" stopColor={c1} />
            </SvgLinearGradient>
          </Defs>

          {/* Base circle */}
          <Circle cx={size / 2} cy={size / 2} r={r} fill={`url(#${gid})` } />

          {/* Track */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke="rgba(255, 255, 255, 0.3)"
            strokeWidth={stroke}
            fill="none"
          />

          {/* Progress ring */}
          <AnimatedCircle
            animatedProps={aProps}
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke="rgba(255, 255, 255, 0.9)"
            strokeWidth={stroke}
            strokeLinecap="round"
            fill="none"
            strokeDasharray={circumference}
            rotation="-90"
            originX={size / 2}
            originY={size / 2}
          />
        </Svg>

        <Text style={styles.time}>{state === "done" ? "✓" : `${mm}:${ss}` }</Text>
      </Animated.View>

      <Text style={[styles.label, dimmed && { opacity: 0.8 }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  wheelWrap: { 
    justifyContent: "center", 
    alignItems: "center",
    position: "relative" as const,
  },
  time: {
    position: "absolute",
    fontSize: 22,
    fontWeight: "800",
    color: "#FFFFFF",
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  label: { 
    marginTop: 12, 
    fontSize: 16, 
    fontWeight: "600", 
    color: "#2d2d2d",
    textAlign: "center" as const,
  },
});

export default Wheel;
