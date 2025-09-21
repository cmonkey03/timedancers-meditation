import { Text } from 'react-native';

interface Props {
  color?: string;
  text: string;
}

const SubtitleWrapper = ({ color, text }: Props): JSX.Element => (
  <Text
    style={{
      color,
      fontSize: 14,
      padding: 28,
      textAlign: 'center',
    }}
  >
    {text}
  </Text>
);

export default SubtitleWrapper;
