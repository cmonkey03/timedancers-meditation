import { Text } from 'react-native';
import { useCustomFonts } from '@/hooks/use-fonts';

interface Props {
  color?: string;
  text: string;
  reducePadding?: boolean;
}

const SubtitleWrapper = ({ color, text, reducePadding = false }: Props) => {
  const { fontsLoaded, fonts } = useCustomFonts();
  const verticalPadding = reducePadding ? 4 : 16;
  
  if (!fontsLoaded) {
    return (
      <Text
        style={{
          color: color ? `${color}BF` : undefined, // 75% opacity for better readability
          fontSize: 16,
          fontWeight: '400',
          paddingHorizontal: 32,
          paddingVertical: verticalPadding,
          textAlign: 'center',
          lineHeight: 24,
          letterSpacing: 0.2,
        }}
      >
        {text}
      </Text>
    );
  }

  return (
    <Text
      style={{
        color: color ? `${color}BF` : undefined, // 75% opacity for better readability
        fontSize: 16,
        fontFamily: fonts.inter.regular,
        paddingHorizontal: 32,
        paddingVertical: verticalPadding,
        textAlign: 'center',
        lineHeight: 24,
        letterSpacing: 0.3,
      }}
    >
      {text}
    </Text>
  );
};

export default SubtitleWrapper;
