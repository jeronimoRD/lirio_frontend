import { Redirect, Stack } from 'expo-router';

import { useSession } from '../../src/session/context';

export default function AdminLayout() {
  const { user } = useSession();

  if (user === null) {
    return <Redirect href="/(login)/login" />;
  }

  if (user.role !== 'ADMIN') {
    return <Redirect href="/profile" />;
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#FCFAF8' },
        headerTintColor: '#A81245',
        headerTitleStyle: { fontWeight: '600', color: '#292724' },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{ title: 'Panel de administración' }}
      />
      <Stack.Screen name="users" options={{ title: 'Usuarios' }} />
      <Stack.Screen name="categories" options={{ title: 'Categorías' }} />
    </Stack>
  );
}