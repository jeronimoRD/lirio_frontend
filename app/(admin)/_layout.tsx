import { Redirect, Stack } from 'expo-router';

import { useSession } from '../../src/session/context';

export default function AdminLayout() {
  const { user } = useSession();

  if (user === null || user.role !== 'ADMIN') {
    return <Redirect href="/(login)/login" />;
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#FCFAF8' },
        headerTintColor: '#4A3728',
        headerTitleStyle: { fontWeight: '700', color: '#292724' },
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