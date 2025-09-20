import { Alert, Linking, Text, TextStyle } from 'react-native';
import { useCallback } from 'react';

type Props = {
  url: string;
  children: string;
  style?: TextStyle;
};

const Hyperlink = ({ style, url, children }: Props): JSX.Element => {
  const handlePress = useCallback(async () => {
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert(`Don't know how to open this URL: ${url}`);
    }
  }, [url]);

  return (
    <Text onPress={handlePress} style={style}>
      {children}
    </Text>
  );
};

export default Hyperlink;
