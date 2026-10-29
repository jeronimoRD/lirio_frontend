import { Menu } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { adminColors } from '../../constants/theme';
import { useAdminDrawer } from './AdminDrawerContext';

export default function AdminBrandHeader({ title }: { title: string }) {
  const insets = useSafeAreaInsets();
  const openDrawer = useAdminDrawer();

  return (
    <View
      className="items-center justify-center bg-admin-ink px-4 pb-4"
      style={{ paddingTop: insets.top + 16 }}>
      <Text className="font-['Lora-Italic'] text-[28px] leading-9 text-white">{title}</Text>
      <Text className="text-[11px] font-light leading-[13px] text-white/70">
        Panel de administración
      </Text>
      <Pressable
        onPress={openDrawer}
        accessibilityRole="button"
        accessibilityLabel="Abrir menú de administración"
        className="absolute right-4 h-12 w-12 items-center justify-center rounded-full active:bg-white/10"
        style={{ top: insets.top + 8 }}>
        <Menu size={24} color={adminColors.faint} />
      </Pressable>
    </View>
  );
}
