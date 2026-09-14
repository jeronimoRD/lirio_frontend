import { Stack } from 'expo-router';
import '../global.css';
import { SessionProvider } from '../src/session/context';

export default function RootLayout() {
  return (
    <SessionProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </SessionProvider>
  );
}