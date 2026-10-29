import { useCallback, useState } from 'react';
import { Redirect, Stack } from 'expo-router';
import { Drawer } from 'react-native-drawer-layout';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { useSession } from '../../src/session/context';
import AdminMore from '../../src/components/admin/AdminMore';
import AdminDrawerContext from '../../src/components/admin/AdminDrawerContext';

export default function AdminLayout() {
  const { user } = useSession();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  if (user === null || user.role !== 'ADMIN') {
    return <Redirect href="/(login)/login" />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AdminDrawerContext.Provider value={openDrawer}>
        <Drawer
          open={drawerOpen}
          onOpen={openDrawer}
          onClose={closeDrawer}
          renderDrawerContent={() => <AdminMore onClose={closeDrawer} />}
          drawerType="front"
          drawerPosition="right"
          drawerStyle={{ width: 320, maxWidth: '88%' }}
          overlayAccessibilityLabel="Cerrar menú de administración"
          style={{ flex: 1 }}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="users" />
            <Stack.Screen name="posts" />
            <Stack.Screen name="more" />
            <Stack.Screen name="categories" />
            <Stack.Screen name="reports" />
          </Stack>
        </Drawer>
      </AdminDrawerContext.Provider>
    </GestureHandlerRootView>
  );
}
