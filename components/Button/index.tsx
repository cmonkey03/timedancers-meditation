import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface Props {
  onPress(): void;
  text: string;
  variant?: "primary" | "ghost";
}

const Button = ({ onPress, text, variant = "primary" }: Props) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.btn,
        variant === "primary" ? styles.btnPrimary : styles.btnGhost,
      ]}
    >
      <Text style={[
        styles.btnText, 
        variant === "ghost" && { color: "#1a5632" },
      ]}>
        {text}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btn: { 
    minWidth: 140, 
    paddingHorizontal: 24, 
    paddingVertical: 12, 
    borderRadius: 8, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  btnPrimary: { 
    backgroundColor: '#1a5632' 
  },
  btnGhost: { 
    backgroundColor: 'transparent', 
    borderWidth: 1, 
    borderColor: '#1a5632' 
  },
  btnText: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: '#fff' 
  },
});

export default Button;
