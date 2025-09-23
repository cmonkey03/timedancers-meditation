import React, { useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Defs, LinearGradient, Stop, Circle } from "react-native-svg";
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

interface Props {
  size?: number;
  label: string;
  remaining: number;
  total: number;
  state: WheelState;
  colors: [string, string];
}

const MeditationWheel = ({
  size = 180,
  label,
  remaining,        // seconds remaining in this wheel
  total,            // total seconds in this wheel
  state,            // 'idle' | 'active' | 'releasing' | 'done'
  colors,           // [start, end]
}: Props) => {
  const stroke = 10;
  const r = (size - stroke) / 2;
  const C = 2 * Math.PI * r;

  // Progress from 1 → 0 with smooth animation
  const targetProgress = Math.max(0, Math.min(1, remaining / Math.max(1, total)));
  const progress = useSharedValue(targetProgress);
  
  // Animate progress smoothly when it changes
  React.useEffect(() => {
    progress.value = withTiming(targetProgress, {
      duration: 500,
      easing: Easing.out(Easing.cubic),
    });
  }, [targetProgress, progress]);

  // Reanimated shared values for subtle breathing, spin, and glow
  const breath = useSharedValue(0);
  const spin = useSharedValue(0);
  const glow = useSharedValue(0);

  // Idle/active animations
  React.useEffect(() => {
    // continuous breathing for idle & active
    breath.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1400, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 1400, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, [breath]);

  // Release animation (one spin + glow)
  React.useEffect(() => {
    if (state === "releasing") {
      spin.value = withSequence(
        withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) }),
        withTiming(0, { duration: 0 }) // reset
      );
      glow.value = withSequence(
        withTiming(1, { duration: 300, easing: Easing.out(Easing.cubic) }),
        withDelay(150, withTiming(0, { duration: 500 }))
      );
    }
  }, [state, spin, glow]);

  const aProps = useAnimatedProps(() => {
    // progress ring dashoffset - smooth animation
    const dash = C * progress.value;
    return { strokeDashoffset: dash };
  });

  const breathScale = useDerivedValue(() =>
    1 + interpolate(breath.value, [0, 1], [0, state === "active" ? 0.05 : 0.02])
  );

  const spinDeg = useDerivedValue(() => `${spin.value * 360}deg` );
  const glowOpacity = useDerivedValue(() => glow.value);

  // Time mm:ss
  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(Math.floor(remaining % 60)).padStart(2, "0");

  const [c0, c1] = colors;
  const gid = useMemo(() => `g-${label}-${c0}-${c1}` .replace(/\W/g, ""), [label, c0, c1]);

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
            <LinearGradient id={gid} x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={c0} />
              <Stop offset="100%" stopColor={c1} />
            </LinearGradient>
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
            strokeDasharray={C}
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

export default MeditationWheel;
