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
    paddingVertical: 12, 
    paddingHorizontal: 20, 
    borderRadius: 14, 
    borderWidth: 1, 
    borderColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  btnPrimary: { backgroundColor: "#1a5632" },
  btnGhost: { backgroundColor: "#ecf2ef", borderColor: "#1a5632" },
  btnText: { color: "#fff", fontWeight: "700", textAlign: "center", fontSize: 16 },
});

export default Button;
