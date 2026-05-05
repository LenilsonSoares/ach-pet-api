import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavegacaoPrincipal } from './src/navigation/NavegacaoPrincipal';

export default function App() {
  return (
    <SafeAreaProvider>
      <NavegacaoPrincipal />
    </SafeAreaProvider>
  );
}
