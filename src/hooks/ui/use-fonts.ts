import { useFonts } from 'expo-font';
import {
  Cinzel_400Regular,
  Cinzel_500Medium,
  Cinzel_600SemiBold,
} from '@expo-google-fonts/cinzel';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from '@expo-google-fonts/inter';

export const useCustomFonts = () => {
  const [fontsLoaded] = useFonts({
    Cinzel_400Regular,
    Cinzel_500Medium,
    Cinzel_600SemiBold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  return {
    fontsLoaded,
    fonts: {
      cinzel: {
        regular: 'Cinzel_400Regular',
        medium: 'Cinzel_500Medium',
        semiBold: 'Cinzel_600SemiBold',
      },
      inter: {
        regular: 'Inter_400Regular',
        medium: 'Inter_500Medium',
        semiBold: 'Inter_600SemiBold',
      },
    },
  };
};
