// app/_layout.tsx
import React from 'react';
import { Stack } from 'expo-router';
import { Provider as PaperProvider } from 'react-native-paper';

export default function Layout() {
  return (
    <PaperProvider>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#f4511e' },
          headerTintColor: '#fff',
        }}
      />
    </PaperProvider>
  );
}
