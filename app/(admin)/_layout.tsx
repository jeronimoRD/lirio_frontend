import { Redirect, Stack } from 'expo-router';

import { useSession } from '../../src/session/context';

export default function AdminLayout() {
  const { user } = useSession();

  if (user === null || user.role !== 'ADMIN') {
    return <Redirect href="/(login)/login" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="users" />
      <Stack.Screen name="posts" />
      <Stack.Screen name="more" />
      <Stack.Screen name="categories" />
      <Stack.Screen name="reports" />
    </Stack>
  );
}
