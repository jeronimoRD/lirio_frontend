import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import '../global.css';
import { SessionProvider } from '../src/session/context';
import { FavoritesProvider } from '../src/favorites/context';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [fontsLoaded, fontError] = useFonts({
      'Lora-Italic': require('../assets/fonts/Lora-Italic.ttf'),
      'Lora-Regular': require('../assets/fonts/Lora-Regular.ttf'),  // 👈 agregar esta línea
      'Lora-Medium': require('../assets/fonts/Lora-Medium.ttf'),
      'Lora-MediumItalic': require('../assets/fonts/Lora-MediumItalic.ttf'),
    });
  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <SessionProvider>
      <FavoritesProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </FavoritesProvider>
    </SessionProvider>
  );
}