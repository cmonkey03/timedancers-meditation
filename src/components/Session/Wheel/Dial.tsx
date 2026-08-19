import { useCustomFonts } from '@/hooks/ui/use-fonts';
import { useThemeColors } from '@/hooks/ui/use-theme';
import { DIAL_FULL_ROTATION_MINUTES, minuteToRadians } from '@/utils/dial';
import { useMemo } from 'react';
import { Circle, G, Line, Text as SvgText } from 'react-native-svg';

interface DialProps {
  size: number;
  r: number;
  minutes: number;
}

function polar(cx: number, cy: number, radius: number, radians: number) {
  return {
    x: cx + radius * Math.cos(radians),
    y: cy + radius * Math.sin(radians),
  };
}

const TICK_EVERY_MINUTE = 4;
const TICK_EVERY_FIVE = 8;

// Circular slider around the wheel's center: a base ring, minute ticks, minute
// labels, and the draggable nub that marks the current duration.
export default function Dial({ size, r, minutes }: DialProps) {
  const C = useThemeColors();
  const { fontsLoaded, fonts } = useCustomFonts();
  const cx = size / 2;
  const cy = size / 2;

  const ticks = useMemo(() => {
    const list: { minute: number; x1: number; y1: number; x2: number; y2: number; major: boolean }[] = [];
    for (let m = 1; m <= DIAL_FULL_ROTATION_MINUTES; m++) {
      const major = m % 5 === 0;
      const len = major ? TICK_EVERY_FIVE : TICK_EVERY_MINUTE;
      const outer = polar(cx, cy, r, minuteToRadians(m));
      const inner = polar(cx, cy, r - len, minuteToRadians(m));
      list.push({ minute: m, x1: inner.x, y1: inner.y, x2: outer.x, y2: outer.y, major });
    }
    return list;
  }, [cx, cy, r]);

  const labels = useMemo(() => {
    const list: { minute: number; x: number; y: number }[] = [];
    for (let m = 5; m <= DIAL_FULL_ROTATION_MINUTES; m += 5) {
      const p = polar(cx, cy, r + 15, minuteToRadians(m));
      list.push({ minute: m, x: p.x, y: p.y });
    }
    return list;
  }, [cx, cy, r]);

  const nub = polar(cx, cy, r, minuteToRadians(minutes));
  const labelFontSize = Math.max(8, Math.round(size * 0.026));

  return (
    <G testID="wheel-dial">
      {/* base ring */}
      <Circle cx={cx} cy={cy} r={r} fill="none" stroke={C.ringInactive} strokeWidth={1} opacity={0.7} />
      {/* minute ticks */}
      {ticks.map((t) => (
        <Line
          key={t.minute}
          x1={t.x1}
          y1={t.y1}
          x2={t.x2}
          y2={t.y2}
          stroke={C.ringInactive}
          strokeWidth={t.major ? 1.5 : 1}
          opacity={t.major ? 0.8 : 0.5}
        />
      ))}
      {/* minute labels */}
      {labels.map((l) => (
        <SvgText
          key={l.minute}
          x={l.x}
          y={l.y}
          fill={C.mutedText}
          fontSize={labelFontSize}
          textAnchor="middle"
          alignmentBaseline="middle"
          fontFamily={fontsLoaded ? fonts.inter.medium : undefined}
        >
          {l.minute}
        </SvgText>
      ))}
      {/* draggable nub at the current minute */}
      <Circle cx={nub.x} cy={nub.y} r={9.5} fill="none" stroke={C.ringActive} strokeWidth={1.5} opacity={0.35} />
      <Circle cx={nub.x} cy={nub.y} r={5.5} fill={C.ringActive} />
    </G>
  );
}
