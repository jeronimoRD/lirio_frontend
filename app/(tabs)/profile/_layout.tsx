import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { ChevronRight, LogOut, Settings as SettingsIcon } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Drawer } from 'react-native-drawer-layout';

import { useSession } from '../../../src/session/context';
import { cardShadow } from '@/constants/theme';
import ProfileScreen from './index';
import ProfileSettings from './settings';

export default function ProfileLayout({ active = true }: { active?: boolean }) {
  const { signOut } = useSession();
  const insets = useSafeAreaInsets();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [screen, setScreen] = useState<'profile' | 'settings'>('profile');

  const openSettings = () => {
    setDrawerOpen(false);
    setScreen('settings');
  };

  return (
    <Drawer
      open={drawerOpen}
      onOpen={() => setDrawerOpen(true)}
      onClose={() => setDrawerOpen(false)}
      drawerPosition="right"
      drawerType="front"
      drawerStyle={{ width: 300, backgroundColor: '#FCFAF8' }}
      overlayStyle={{ backgroundColor: 'rgba(41, 39, 36, 0.4)' }}
      renderDrawerContent={() => (
        <View className="flex-1 bg-[#FCFAF8]" style={{ paddingTop: insets.top + 20 }}>
          <View className="gap-3 px-5">
            <Text className="font-['Lora-Italic'] text-2xl leading-8 text-[#A81245]">Opciones</Text>

            <Pressable
              onPress={openSettings}
              className="flex-row items-center gap-3 rounded-2xl bg-white p-4"
              style={cardShadow}>
              <View className="h-10 w-10 items-center justify-center rounded-full bg-[#F4EEE7]">
                <SettingsIcon size={18} color="#A81245" />
              </View>
              <Text className="flex-1 text-sm font-semibold text-[#292724]">Configuración</Text>
              <ChevronRight size={16} color="#A09B95" />
            </Pressable>

            <Pressable
              onPress={signOut}
              className="h-12 flex-row items-center justify-center gap-2 rounded-2xl border border-red-200 bg-white active:opacity-80">
              <LogOut size={18} color="#DC2626" />
              <Text className="text-sm font-semibold text-red-600">Cerrar sesión</Text>
            </Pressable>
          </View>
        </View>
      )}>
      {screen === 'profile' ? (
        <ProfileScreen active={active} onOpenDrawer={() => setDrawerOpen(true)} />
      ) : (
        <ProfileSettings onBack={() => setScreen('profile')} />
      )}
    </Drawer>
  );
}
