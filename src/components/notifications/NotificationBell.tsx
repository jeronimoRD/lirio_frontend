import { Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Bell } from 'lucide-react-native';

import { colors } from '../../constants/theme';
import { useNotificationCount } from '../../hooks/general/useNotificationCount';

/** Campana de la cabecera con el número de avisos sin leer. */
export default function NotificationBell() {
  const router = useRouter();
  const count = useNotificationCount();

  return (
    <Pressable
      onPress={() => router.push('/notifications')}
      hitSlop={6}
      accessibilityRole="button"
      accessibilityLabel={count > 0 ? `Notificaciones, ${count} sin leer` : 'Notificaciones'}
      className="h-10 w-10 items-center justify-center rounded-full border border-line bg-white active:opacity-70">
      <Bell size={18} color={colors.primary} strokeWidth={1.6} />

      {count > 0 && (
        <View
          className="absolute -right-0.5 -top-0.5 min-w-[18px] items-center justify-center rounded-full bg-brand px-1"
          style={{ height: 18 }}>
          <Text className="text-[10px] font-bold leading-[14px] text-white">
            {count > 99 ? '99+' : count}
          </Text>
        </View>
      )}
    </Pressable>
  );
}
