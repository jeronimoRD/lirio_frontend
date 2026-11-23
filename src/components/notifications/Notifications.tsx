import { ActivityIndicator, FlatList, Pressable, RefreshControl, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Bell, CheckCheck, Heart, MessageCircle, Trash2, UserPlus } from 'lucide-react-native';

import Avatar from '../Avatar';
import ScreenHeader from '../ScreenHeader';
import { useNotifications } from '../../hooks/general/useNotifications';
import type { Notification, NotificationType } from '../../types';
import { formatTimeAgo } from '../../utils/format';

const COLORS = {
  burgundy: '#A81245',
  muted: '#A09B95',
};

function TypeIcon({ type }: { type: NotificationType }) {
  if (type === 'LIKE') {
    return <Heart size={10} color="#FFFFFF" fill="#FFFFFF" strokeWidth={2} />;
  }

  if (type === 'COMMENT') {
    return <MessageCircle size={10} color="#FFFFFF" strokeWidth={2} />;
  }

  return <UserPlus size={10} color="#FFFFFF" strokeWidth={2} />;
}

function NotificationRow({
  item,
  onOpen,
  onRemove,
}: {
  item: Notification;
  onOpen: () => void;
  onRemove: () => void;
}) {
  return (
    <Pressable
      onPress={onOpen}
      accessibilityRole="button"
      accessibilityLabel={`${item.sender.name} ${item.message}`}
      className={`flex-row items-center gap-3 rounded-[18px] border px-4 py-3.5 active:opacity-90 ${
        item.isRead ? 'border-line bg-white' : 'border-brand-line bg-brand-tint'
      }`}>
      <View>
        <Avatar name={item.sender.name} uri={item.sender.avatarUrl} size={44} />

        <View className="absolute -bottom-1 -right-1 h-[20px] w-[20px] items-center justify-center rounded-full border-2 border-white bg-brand">
          <TypeIcon type={item.type} />
        </View>
      </View>

      <View className="flex-1">
        <Text className="text-[13px] leading-5 text-ink">
          <Text className="font-semibold">{item.sender.name}</Text> {item.message}
        </Text>

        <Text className="mt-0.5 text-[11px] text-ink-muted">{formatTimeAgo(item.createdAt)}</Text>
      </View>

      {!item.isRead && <View className="h-2 w-2 rounded-full bg-brand" />}

      <Pressable
        onPress={(event) => {
          event.stopPropagation();
          onRemove();
        }}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel="Eliminar notificación"
        className="p-1 active:opacity-60">
        <Trash2 size={16} color={COLORS.muted} />
      </Pressable>
    </Pressable>
  );
}

function EmptyState() {
  return (
    <View className="items-center rounded-[22px] border border-line bg-white px-6 py-10">
      <View className="mb-5 h-16 w-16 items-center justify-center rounded-full bg-screen">
        <Bell size={26} color={COLORS.burgundy} strokeWidth={1.3} />
      </View>

      <Text className="text-center font-['Lora-Italic'] text-[22px] text-ink">
        Sin novedades por ahora
      </Text>

      <Text className="mt-2 text-center text-[12px] leading-5 text-ink-secondary">
        Cuando alguien te siga, le dé me gusta a tu outfit o te comente, lo verás aquí.
      </Text>
    </View>
  );
}

function LoadingState() {
  return (
    <View className="items-center py-14">
      <ActivityIndicator color={COLORS.burgundy} />

      <Text className="mt-3 font-['Lora-Italic'] text-[15px] text-ink-secondary">
        Cargando tus avisos…
      </Text>
    </View>
  );
}

export default function Notifications() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { notifications, loading, refreshing, error, refresh, markRead, markAllRead, remove } =
    useNotifications();

  const unread = notifications.filter((item) => !item.isRead).length;

  const open = (item: Notification) => {
    markRead(item.id);

    if ((item.type === 'LIKE' || item.type === 'COMMENT') && item.postId) {
      router.push(`/${item.postId}`);
    }
  };

  return (
    <View className="flex-1 bg-screen">
      <FlatList
        className="flex-1"
        data={notifications}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            tintColor={COLORS.burgundy}
            colors={[COLORS.burgundy]}
          />
        }
        contentContainerStyle={{
          paddingBottom: Math.max(insets.bottom, 20) + 24,
          gap: 10,
        }}
        ListHeaderComponent={
          <View className="px-[18px]">
            <ScreenHeader
              title="Notificaciones"
              onBack={() => router.back()}
              right={
                unread > 0 ? (
                  <Pressable
                    onPress={() => markAllRead()}
                    accessibilityRole="button"
                    accessibilityLabel="Marcar todas como leídas"
                    className="h-10 w-10 items-center justify-center rounded-full border border-line bg-white active:opacity-70">
                    <CheckCheck size={18} color={COLORS.burgundy} />
                  </Pressable>
                ) : undefined
              }
            />

            <View className="mb-4 mt-4 flex-row items-center gap-2">
              <Text className="text-[9px] font-semibold uppercase tracking-[0.2em] text-ink-secondary">
                {unread > 0 ? `${unread} sin leer` : 'Todo al día'}
              </Text>

              <View className="h-px flex-1 bg-line" />
            </View>

            {!!error && (
              <View className="mb-3 rounded-card border border-brand-line bg-brand-tint p-4">
                <Text className="text-[13px] leading-5 text-brand">{error}</Text>
              </View>
            )}
          </View>
        }
        renderItem={({ item }) => (
          <View className="px-[18px]">
            <NotificationRow
              item={item}
              onOpen={() => open(item)}
              onRemove={() => remove(item.id)}
            />
          </View>
        )}
        ListEmptyComponent={
          <View className="px-[18px]">
            {loading ? <LoadingState /> : error ? undefined : <EmptyState />}
          </View>
        }
      />
    </View>
  );
}
