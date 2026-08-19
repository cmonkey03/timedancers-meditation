import { useThemeColors } from '@/hooks/ui/use-theme';
import { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';

interface CloudProps {
  size: number;
  radius: number;
  rotation: number;
  progress: number;
}

/**
 * The rotating cloud - feathered gradients for soft cloud-like edges.
 * Multiple overlapping layers with gradual opacity falloff.
 */
export default function Cloud({ size, radius, rotation, progress }: CloudProps) {
  const C = useThemeColors();
  const cx = size / 2;
  const cy = size / 2;

  return (
    <>
      <Defs>
        {/* Core - bright center, very gradual falloff */}
        <RadialGradient id="cloud-core" cx="45%" cy="45%" rx="80%" ry="80%">
          <Stop offset="0%" stopColor={C.wheelCloud[0]} stopOpacity={0.9} />
          <Stop offset="0.2" stopColor={C.wheelCloud[1]} stopOpacity={0.6} />
          <Stop offset="0.5" stopColor={C.wheelCloud[1]} stopOpacity={0.25} />
          <Stop offset="0.8" stopColor={C.wheelCloud[2]} stopOpacity={0.05} />
          <Stop offset="1" stopColor={C.wheelCloud[2]} stopOpacity={0} />
        </RadialGradient>

        {/* Mid layer - softer, offset */}
        <RadialGradient id="cloud-mid" cx="55%" cy="55%" rx="75%" ry="75%">
          <Stop offset="0%" stopColor={C.wheelCloud[0]} stopOpacity={0.35} />
          <Stop offset="0.3" stopColor={C.wheelCloud[1]} stopOpacity={0.2} />
          <Stop offset="0.6" stopColor={C.wheelCloud[1]} stopOpacity={0.08} />
          <Stop offset="1" stopColor={C.wheelCloud[2]} stopOpacity={0} />
        </RadialGradient>

        {/* Outer glow - very soft, diffuse */}
        <RadialGradient id="cloud-glow" cx="50%" cy="50%" rx="70%" ry="70%">
          <Stop offset="0%" stopColor={C.wheelCloud[0]} stopOpacity={0.15} />
          <Stop offset="0.4" stopColor={C.wheelCloud[1]} stopOpacity={0.06} />
          <Stop offset="1" stopColor={C.wheelCloud[2]} stopOpacity={0} />
        </RadialGradient>

        {/* Feathered edge layer - extremely soft outer boundary */}
        <RadialGradient id="cloud-edge" cx="50%" cy="50%" rx="65%" ry="65%">
          <Stop offset="0%" stopColor={C.wheelCloud[0]} stopOpacity={0.08} />
          <Stop offset="0.5" stopColor={C.wheelCloud[1]} stopOpacity={0.03} />
          <Stop offset="1" stopColor={C.wheelCloud[2]} stopOpacity={0} />
        </RadialGradient>
      </Defs>

      {/* Feathered edge - slow rotation */}
      <Circle
        cx={cx}
        cy={cy}
        r={radius * 1.18}
        fill="url(#cloud-edge)"
        transform={`rotate(${rotation * 0.15}, ${cx}, ${cy})`}
      />

      {/* Outer glow - slow rotation */}
      <Circle
        cx={cx}
        cy={cy}
        r={radius * 1.1}
        fill="url(#cloud-glow)"
        transform={`rotate(${rotation * 0.3}, ${cx}, ${cy})`}
      />

      {/* Mid layer - medium rotation */}
      <Circle
        cx={cx}
        cy={cy}
        r={radius * 1.03}
        fill="url(#cloud-mid)"
        transform={`rotate(${rotation * 0.6}, ${cx}, ${cy})`}
      />

      {/* Core cloud layer - main rotation */}
      <Circle
        cx={cx}
        cy={cy}
        r={radius}
        fill="url(#cloud-core)"
        transform={`rotate(${rotation}, ${cx}, ${cy})`}
      />
    </>
  );
}
