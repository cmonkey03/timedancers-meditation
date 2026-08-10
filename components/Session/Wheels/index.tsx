import ReportingObserver from '@/components/Session/Ring';
import { getPhaseAccessibilityLabel } from '@/utils/accessibility';
import * as Timer from '@/utils/timer';
import { useEffect, useRef } from 'react';
import { View } from 'react-native';

function capitalize(s: string): string {
  if (!s) return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// ReportingObserver definitions with rainbow colors (bottom to top: yellow/red → blue/green → purple/indigo)
const WHEELS = [
  { key: "power",  seconds: 60, colors: ["yellow", "red"] as [string, string] }, // Yellow to Red (bottom)
  { key: "heart",   seconds: 60, colors: ["blue", "green"] as [string, string] }, // Blue to Green (middle)  
  { key: "wisdom", seconds: 60, colors: ["purple", "indigo"] as [string, string] }, // Purple to Indigo (top)
] as const;

type Props = {
  timer: {
    now: {
      currentIndex: number;
      phaseRemainingMs: number;
      done: boolean;
    };
    phases: { seconds: number }[];
    started: boolean;
  };
  prevIndex: number;
};

export default function SessionReportingObservers({ timer, prevIndex }: Props) {
  const localPrevIndex = useRef(prevIndex);
  
  // Update local ref when prop changes (using effect to avoid render-time ref access)
  useEffect(() => {
    localPrevIndex.current = prevIndex;
  }, [prevIndex]);

  return (
    <>
      {(() => {
        // Create ring cards in correct order (wisdom at top, power at bottom)
        const ringOrder = [2, 1, 0]; // wisdom, heart, power (top to bottom)
        
        // eslint-disable-next-line react-hooks/refs -- localPrevIndex ref is intentionally accessed during render for animation state
        return ringOrder.map((i) => {
          const ring = WHEELS[i];
          const isActive = i === timer.now.currentIndex && !timer.now.done && timer.now.phaseRemainingMs > 0 && timer.started;
          const justReleased = 
            i === localPrevIndex.current && !isActive && timer.now.phaseRemainingMs === 0;
          const isDone = i < timer.now.currentIndex || timer.now.done;

          const ringState: "idle" | "active" | "releasing" | "done" =
            timer.now.done ? "done" : isActive ? "active" : justReleased ? "releasing" : isDone ? "done" : "idle";

          const total = timer.phases[i]?.seconds ?? ring.seconds;
          const remaining = (() => {
            if (i === timer.now.currentIndex) {
              return Timer.getRemainingSeconds(timer.now.phaseRemainingMs);
            }
            if (isDone) return 0;
            return total;
          })();

          const big = isActive && timer.started;
          
          return (
            <View key={ring.key} style={{ alignItems: "center", marginVertical: big ? 16 : 16 }}>
              <ReportingObserver
                size={big ? 200 : 120}
                label={capitalize(ring.key)}
                remaining={remaining}
                total={total}
                state={ringState}
                colors={ring.colors}
                accessibilityLabel={getPhaseAccessibilityLabel(ring.key, remaining)}
              />
            </View>
          );
        });
      })()}
    </>
  );
}
