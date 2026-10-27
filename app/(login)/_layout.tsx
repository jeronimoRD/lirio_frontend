import { Redirect, Stack } from 'expo-router';
import { useSession } from '@/session/context';

export default function LoginLayout() {
  const { user } = useSession();

  if (user) {
    return <Redirect href={user.role === 'ADMIN' ? '/(admin)' : '/home'} />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
