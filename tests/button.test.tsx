import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react-native';
import Button from '@/components/Button';

// Mock the theme hook
const mockUseThemeColors = vi.fn();
vi.mock('@/hooks/use-theme', () => ({
  useThemeColors: mockUseThemeColors,
}));

// Mock react-native-reanimated
vi.mock('react-native-reanimated', () => {
  const View = require('react-native').View;
  return {
    default: {
      View,
    },
    useSharedValue: vi.fn(() => ({ value: 1 })),
    useAnimatedStyle: vi.fn(() => ({})),
    withSpring: vi.fn((value) => value),
    withTiming: vi.fn((value) => value),
  };
});

describe('components/Button', () => {
  const mockColors = {
    text: '#000000',
    background: '#ffffff',
  };

  beforeEach(() => {
    mockUseThemeColors.mockReturnValue(mockColors);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders with primary variant by default', () => {
    const onPress = vi.fn();
    const { getByText } = render(
      <Button onPress={onPress} text="Test Button" />
    );

    const buttonText = getByText('Test Button');
    expect(buttonText).toBeTruthy();
  });

  it('renders with ghost variant when specified', () => {
    const onPress = vi.fn();
    const { getByText } = render(
      <Button onPress={onPress} text="Ghost Button" variant="ghost" />
    );

    const buttonText = getByText('Ghost Button');
    expect(buttonText).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = vi.fn();
    const { getByText } = render(
      <Button onPress={onPress} text="Clickable Button" />
    );

    const button = getByText('Clickable Button').parent?.parent;
    fireEvent.press(button!);

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('applies testID when provided', () => {
    const onPress = vi.fn();
    const { getByTestId } = render(
      <Button onPress={onPress} text="Test Button" testID="test-button" />
    );

    const button = getByTestId('test-button');
    expect(button).toBeTruthy();
  });

  it('handles press in and press out events', () => {
    const onPress = vi.fn();
    const { getByText } = render(
      <Button onPress={onPress} text="Interactive Button" />
    );

    const button = getByText('Interactive Button').parent?.parent;
    
    fireEvent(button!, 'pressIn');
    fireEvent(button!, 'pressOut');

    // Should not crash and should still be able to press
    fireEvent.press(button!);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('renders different text content', () => {
    const onPress = vi.fn();
    const { getByText, rerender } = render(
      <Button onPress={onPress} text="First Text" />
    );

    expect(getByText('First Text')).toBeTruthy();

    rerender(<Button onPress={onPress} text="Second Text" />);
    expect(getByText('Second Text')).toBeTruthy();
  });

  it('works with different onPress handlers', () => {
    const firstHandler = vi.fn();
    const secondHandler = vi.fn();
    
    const { getByText, rerender } = render(
      <Button onPress={firstHandler} text="Button" />
    );

    const button = getByText('Button').parent?.parent;
    fireEvent.press(button!);
    expect(firstHandler).toHaveBeenCalledTimes(1);
    expect(secondHandler).not.toHaveBeenCalled();

    rerender(<Button onPress={secondHandler} text="Button" />);
    fireEvent.press(button!);
    expect(firstHandler).toHaveBeenCalledTimes(1);
    expect(secondHandler).toHaveBeenCalledTimes(1);
  });

  it('applies theme colors correctly', () => {
    const customColors = {
      text: '#ff0000',
      background: '#00ff00',
    };
    mockUseThemeColors.mockReturnValue(customColors);

    const onPress = vi.fn();
    render(<Button onPress={onPress} text="Themed Button" variant="ghost" />);

    expect(mockUseThemeColors).toHaveBeenCalled();
  });

  it('handles empty text gracefully', () => {
    const onPress = vi.fn();
    const { getByText } = render(
      <Button onPress={onPress} text="" />
    );

    // Should render without crashing
    const buttonText = getByText('');
    expect(buttonText).toBeTruthy();
  });

  it('handles long text content', () => {
    const onPress = vi.fn();
    const longText = 'This is a very long button text that might wrap or overflow';
    const { getByText } = render(
      <Button onPress={onPress} text={longText} />
    );

    const buttonText = getByText(longText);
    expect(buttonText).toBeTruthy();
  });

  it('maintains accessibility with testID', () => {
    const onPress = vi.fn();
    const { getByTestId } = render(
      <Button 
        onPress={onPress} 
        text="Accessible Button" 
        testID="accessible-button"
        variant="ghost"
      />
    );

    const button = getByTestId('accessible-button');
    expect(button).toBeTruthy();
    
    fireEvent.press(button);
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
