import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react-native';
import { useCustomFonts } from '@/hooks/use-fonts';

// Mock expo-font
const mockUseFonts = vi.fn();
vi.mock('expo-font', () => ({
  useFonts: mockUseFonts,
}));

// Mock expo-google-fonts
vi.mock('@expo-google-fonts/cinzel', () => ({
  Cinzel_400Regular: 'Cinzel_400Regular',
  Cinzel_500Medium: 'Cinzel_500Medium',
  Cinzel_600SemiBold: 'Cinzel_600SemiBold',
}));

vi.mock('@expo-google-fonts/inter', () => ({
  Inter_400Regular: 'Inter_400Regular',
  Inter_500Medium: 'Inter_500Medium',
  Inter_600SemiBold: 'Inter_600SemiBold',
}));

describe('hooks/useCustomFonts', () => {
  it('returns fonts loaded state and font families', () => {
    mockUseFonts.mockReturnValue([true]);

    const { result } = renderHook(() => useCustomFonts());

    expect(result.current.fontsLoaded).toBe(true);
    expect(result.current.fonts).toEqual({
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
    });
  });

  it('returns false when fonts are not loaded', () => {
    mockUseFonts.mockReturnValue([false]);

    const { result } = renderHook(() => useCustomFonts());

    expect(result.current.fontsLoaded).toBe(false);
    expect(result.current.fonts).toEqual({
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
    });
  });

  it('calls useFonts with correct font configuration', () => {
    mockUseFonts.mockReturnValue([true]);

    renderHook(() => useCustomFonts());

    expect(mockUseFonts).toHaveBeenCalledWith({
      Cinzel_400Regular: 'Cinzel_400Regular',
      Cinzel_500Medium: 'Cinzel_500Medium',
      Cinzel_600SemiBold: 'Cinzel_600SemiBold',
      Inter_400Regular: 'Inter_400Regular',
      Inter_500Medium: 'Inter_500Medium',
      Inter_600SemiBold: 'Inter_600SemiBold',
    });
  });
});
