import { Text } from 'react-native';

interface Props {
  color?: string;
  text: string;
}

const SubtitleWrapper = ({ color, text }: Props) => (
  <Text
    style={{
      color: color ? `${color}BF` : undefined, // 75% opacity for better readability
      fontSize: 16,
      fontWeight: '400',
      paddingHorizontal: 32,
      paddingVertical: 16,
      textAlign: 'center',
      lineHeight: 24,
      letterSpacing: 0.2,
    }}
  >
    {text}
  </Text>
);

export default SubtitleWrapper;
