import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';

type Props = {
  children: React.ReactNode;
};

const DismissKeyboard = ({ children }: Props) => (
  <ScrollView
    keyboardShouldPersistTaps="never"
    contentContainerStyle={{
      flexGrow: 1,
      justifyContent: 'center',
      flexDirection: 'column',
    }}
  >
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      {children}
    </KeyboardAvoidingView>
  </ScrollView>
);

export default DismissKeyboard;
